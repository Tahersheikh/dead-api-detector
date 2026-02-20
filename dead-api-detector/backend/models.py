"""
SQLAlchemy ORM models matching the database schema.
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database import Base


class Api(Base):
    __tablename__ = "apis"

    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name             = Column(String(255), nullable=False)
    url              = Column(String(500), nullable=False, unique=True)
    category         = Column(String(100), nullable=False)
    status           = Column(String(20), nullable=False, default="unknown")
    response_time_ms = Column(Integer, nullable=False, default=0)
    last_checked     = Column(DateTime(timezone=True), nullable=True)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())


class StatusHistory(Base):
    __tablename__ = "status_history"

    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    api_id           = Column(UUID(as_uuid=True), ForeignKey("apis.id", ondelete="CASCADE"), nullable=False)
    status           = Column(String(20), nullable=False)
    response_time_ms = Column(Integer, nullable=True)
    checked_at       = Column(DateTime(timezone=True), server_default=func.now())
