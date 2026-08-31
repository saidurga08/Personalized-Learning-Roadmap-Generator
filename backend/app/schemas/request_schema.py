from pydantic import BaseModel
from typing import Optional, Union, Any


class GenerateRoadmapRequest(BaseModel):
    goal: str
    skill_level: Optional[str] = "Intermediate"
    hours_per_week: Union[float, int, str] = 15.0
    budget: Union[float, int, str] = "$50"
    learning_method: Optional[str] = "Project-Based"
    weeks_duration: Optional[int] = 8
    deadline: Optional[str] = "2026-06-30"
    language: Optional[str] = "English"
    prior_experience: Optional[str] = None


class ModifyRoadmapRequest(BaseModel):
    roadmap_id: Optional[str] = None
    user_message: Optional[str] = None
    modification_prompt: Optional[str] = None