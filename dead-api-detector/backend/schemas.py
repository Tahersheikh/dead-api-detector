"""
Pydantic schemas for request/response validation.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
import uuid


class ApiOut(BaseModel):
    id:               uuid.UUID
    name:             str
    url:              str
    category:         str
    status:           str
    response_time_ms: int
    last_checked:     Optional[datetime]
    created_at:       datetime

    model_config = {"from_attributes": True}


class CheckResult(BaseModel):
    api_id:           uuid.UUID
    name:             str
    status:           str
    response_time_ms: int
    status_code:      Optional[int]
    error:            Optional[str]


class CheckAllResponse(BaseModel):
    total:    int
    up:       int
    down:     int
    duration_seconds: float
    results:  list[CheckResult]
