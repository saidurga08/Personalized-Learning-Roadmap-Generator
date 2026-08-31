from fastapi import APIRouter, Body
from typing import Dict, Any, Optional

from app.schemas.request_schema import (
    GenerateRoadmapRequest,
    ModifyRoadmapRequest
)
from app.services.roadmap_generation_service import generate_roadmap
from app.services.roadmap_modification_service import modify_roadmap

router = APIRouter(
    prefix="/roadmaps",
    tags=["Roadmaps"]
)


@router.post("/generate")
def generate(request: GenerateRoadmapRequest):
    return generate_roadmap(request)


@router.post("/modify")
def modify(request: ModifyRoadmapRequest):
    return modify_roadmap(request)


@router.put("/{roadmap_id}")
def modify_by_id(roadmap_id: str, body: Dict[str, Any] = Body(...)):
    user_msg = body.get("modification_prompt") or body.get("user_message") or "Adjust workload"
    req = ModifyRoadmapRequest(roadmap_id=roadmap_id, user_message=user_msg, modification_prompt=user_msg)
    return modify_roadmap(req)


@router.get("")
@router.get("/")
def list_roadmaps():
    return [
        {
            "id": 101,
            "goal": "Master Full-Stack Fast-API & React",
            "difficulty": "Intermediate",
            "hours_per_week": 15,
            "budget": "$50",
            "deadline": "2026-04-30",
            "progress": 58,
            "status": "In Progress"
        }
    ]


@router.get("/{roadmap_id}")
def get_roadmap(roadmap_id: str):
    return {
        "id": roadmap_id,
        "goal": "Master Full-Stack Fast-API & React",
        "difficulty": "Intermediate",
        "hours_per_week": 15,
        "budget": "$50",
        "progress": 58,
        "status": "In Progress"
    }