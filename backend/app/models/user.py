from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    password_hash = Column(
        String,
        nullable=False
    )

    full_name = Column(
        String,
        nullable=True
    )

    default_skill_level = Column(
        String,
        nullable=False,
        default="beginner"
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

    goals = relationship(
        "Goal",
        back_populates="user",
        cascade="all, delete"
    )

    roadmaps = relationship(
        "Roadmap",
        back_populates="user",
        cascade="all, delete"
    )