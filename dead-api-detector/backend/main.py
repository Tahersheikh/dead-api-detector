"""
Dead API Detector — FastAPI Backend
Endpoints:
  GET  /            → health ping
  GET  /apis        → list all APIs (with optional filters)
  GET  /categories  → distinct category list
  POST /check-all   → trigger concurrent health checks
"""
import os
import time
import logging
import asyncio
from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import update, text
from dotenv import load_dotenv

from database import get_db, engine
from models import Api, Base
from schemas import ApiOut, CheckAllResponse, CheckResult
from checker import check_all_apis

# ── Setup ────────────────────────────────────────────────────────────────────
load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "*")

app = FastAPI(
    title="Dead API Detector",
    description="Monitor public API health status in real-time.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGIN] if ALLOWED_ORIGIN != "*" else ["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Create tables if they don't exist yet (safe in production — uses IF NOT EXISTS)
Base.metadata.create_all(bind=engine)


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root():
    """Service health ping."""
    return {"status": "ok", "service": "Dead API Detector", "timestamp": datetime.now(timezone.utc)}


@app.get("/categories", response_model=list[str], tags=["APIs"])
def get_categories(db: Session = Depends(get_db)):
    """Return all distinct categories sorted alphabetically."""
    rows = db.query(Api.category).distinct().order_by(Api.category).all()
    return [r[0] for r in rows]


@app.get("/apis", response_model=list[ApiOut], tags=["APIs"])
def get_apis(
    category: Optional[str] = Query(None, description="Filter by category"),
    search:   Optional[str] = Query(None, description="Search by name (case-insensitive)"),
    db: Session = Depends(get_db),
):
    """
    Return all monitored APIs.
    Optionally filter by category and/or search by name.
    Results are sorted: category ASC, name ASC.
    """
    query = db.query(Api)

    if category:
        query = query.filter(Api.category == category)

    if search:
        query = query.filter(Api.name.ilike(f"%{search}%"))

    apis = query.order_by(Api.category, Api.name).all()
    return apis


@app.post("/check-all", response_model=CheckAllResponse, tags=["Health Checks"])
async def check_all(db: Session = Depends(get_db)):
    """
    Trigger immediate concurrent health checks for every API.
    Updates the database in bulk and returns a summary.
    """
    all_apis = db.query(Api).all()
    if not all_apis:
        raise HTTPException(status_code=404, detail="No APIs found in database.")

    api_dicts = [{"id": a.id, "name": a.name, "url": a.url} for a in all_apis]

    logger.info("Starting health check for %d APIs...", len(api_dicts))
    wall_start = time.monotonic()

    results = await check_all_apis(api_dicts)

    wall_end = time.monotonic()
    duration = round(wall_end - wall_start, 2)

    # ── Bulk update ────────────────────────────────────────────────────────
    now = datetime.now(timezone.utc)
    for r in results:
        db.execute(
            update(Api)
            .where(Api.id == r["api_id"])
            .values(
                status=r["status"],
                response_time_ms=r["response_time_ms"],
                last_checked=now,
            )
        )
    db.commit()

    # ── Build response ─────────────────────────────────────────────────────
    up_count   = sum(1 for r in results if r["status"] == "up")
    down_count = len(results) - up_count

    logger.info(
        "Health check complete in %.2fs — %d up / %d down",
        duration, up_count, down_count,
    )

    return CheckAllResponse(
        total=len(results),
        up=up_count,
        down=down_count,
        duration_seconds=duration,
        results=[
            CheckResult(
                api_id=r["api_id"],
                name=r["name"],
                status=r["status"],
                response_time_ms=r["response_time_ms"],
                status_code=r.get("status_code"),
                error=r.get("error"),
            )
            for r in results
        ],
    )
