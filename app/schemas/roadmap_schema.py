from pydantic import BaseModel
from typing import List


class Resource(BaseModel):
    title: str
    url: str
    type: str
    is_free: bool


class Topic(BaseModel):
    title: str
    description: str
    estimated_hours: float
    resources: List[Resource]


class Week(BaseModel):
    week_number: int
    title: str
    description: str
    estimated_hours: float
    milestone: str
    assignment: str
    topics: List[Topic]


class Roadmap(BaseModel):
    title: str
    goal: str
    skill_level: str
    estimated_duration_weeks: int
    total_estimated_hours: float
    overview: str
    weeks: List[Week]