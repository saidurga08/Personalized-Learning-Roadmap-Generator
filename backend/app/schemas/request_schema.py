from pydantic import BaseModel
from typing import Optional


class GenerateRoadmapRequest(BaseModel):
    goal: str
    skill_level: str
    hours_per_week: float
    budget: float
    learning_method: str
    prior_experience: Optional[str] = None


class ModifyRoadmapRequest(BaseModel):
    roadmap_id: str
    user_message: str