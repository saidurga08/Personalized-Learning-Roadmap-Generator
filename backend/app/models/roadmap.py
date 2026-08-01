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
    Enum as SQLEnum
)

from sqlalchemy.dialects.postgresql import UUID, JSONB
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
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    goal_id = Column(
        UUID(as_uuid=True),
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
        SQLEnum(
            "beginner",
            "intermediate",
            "advanced",
            name="skill_level_enum",
            create_type=False
        ),
        nullable=False
    )

    status = Column(
        SQLEnum(
            RoadmapStatus,
            name="roadmap_status_enum",
            create_type=False
        ),
        nullable=False,
        server_default="active"
    )

    progress_percentage = Column(
        Numeric,
        nullable=False,
        server_default="0.00"
    )

    roadmap_json = Column(
        JSONB,
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

    goal = relationship(
        "Goal",
        back_populates="roadmaps"
    )