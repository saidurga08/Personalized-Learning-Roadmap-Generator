from sqlalchemy import (
    Column,
    String,
    Text,
    Date,
    Numeric,
    DateTime,
    ForeignKey
)

from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base


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
        ForeignKey("goals.id")
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
        nullable=False
    )

    status = Column(
        String,
        default="active"
    )

    progress_percentage = Column(
        Numeric,
        default=0
    )

    roadmap_json = Column(
        JSONB
    )

    start_date = Column(
        Date
    )

    target_completion_date = Column(
        Date
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