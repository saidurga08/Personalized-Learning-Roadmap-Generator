from fastapi import APIRouter

from app.schemas.request_schema import (
    GenerateRoadmapRequest,
    ModifyRoadmapRequest
)

from app.services.roadmap_generation_service import (
    generate_roadmap
)

from app.services.roadmap_modification_service import (
    modify_roadmap
)

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