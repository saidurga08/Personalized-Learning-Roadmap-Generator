import uuid
from enum import Enum
from sqlalchemy import (
    Column,
    Text,
    String,
    Date,
    Numeric,
    DateTime,
    ForeignKey,
    JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class RoadmapStatus(str, Enum):
    active = "active"
    completed = "completed"
    archived = "archived"


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    user_id = Column(
        String(36),
        ForeignKey("users.id"),
        nullable=False
    )

    goal_id = Column(
        String(36),
        ForeignKey("goals.id"),
        nullable=True
    )

    title = Column(
        String,
        nullable=False
    )

    goal = Column(
        Text,
        nullable=False
    )

    skill_level = Column(
        String,
        nullable=False,
        default="intermediate"
    )

    status = Column(
        String,
        nullable=False,
        default="active"
    )

    progress_percentage = Column(
        Numeric,
        nullable=False,
        default=0.0
    )

    roadmap_json = Column(
        JSON,
        nullable=True
    )

    start_date = Column(
        Date,
        nullable=False,
        server_default=func.current_date()
    )

    target_completion_date = Column(
        Date,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    user = relationship(
        "User",
        back_populates="roadmaps"
    )

    goal_rel = relationship(
        "Goal",
        back_populates="roadmaps"
    )