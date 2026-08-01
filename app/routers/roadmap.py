from fastapi import APIRouter
from app.schemas.request_schema import (
    GenerateRoadmapRequest,
    ModifyRoadmapRequest
)

router = APIRouter(prefix="/roadmaps", tags=["Roadmaps"])


@router.post("/generate")
def generate_roadmap(request: GenerateRoadmapRequest):

    return {
        "message": "Generate roadmap endpoint working",
        "request": request
    }


@router.post("/modify")
def modify_roadmap(request: ModifyRoadmapRequest):

    return {
        "message": "Modify roadmap endpoint working",
        "request": request
    }