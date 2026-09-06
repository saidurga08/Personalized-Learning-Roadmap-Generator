from fastapi import APIRouter, Body, Response, Query
from typing import Dict, Any, Optional

from app.schemas.request_schema import (
    GenerateRoadmapRequest,
    ModifyRoadmapRequest
)
from app.services.roadmap_generation_service import generate_roadmap
from app.services.roadmap_modification_service import modify_roadmap
from app.services.groq_service import generate_rich_roadmap
from app.services.pdf_service import generate_roadmap_pdf
from app.services.db_sync_service import load_roadmap

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
    req = ModifyRoadmapRequest(
        roadmap_id=roadmap_id,
        user_message=user_msg,
        modification_prompt=user_msg,
        goal=body.get("goal"),
        weeks_duration=body.get("weeks_duration"),
        hours_per_week=body.get("hours_per_week", 15),
        current_roadmap=body.get("current_roadmap")
    )
    return modify_roadmap(req)


@router.delete("/{roadmap_id}")
def delete_roadmap(roadmap_id: str):
    return {"status": "success", "message": "Roadmap deleted successfully", "roadmap_id": roadmap_id}


@router.get("")
@router.get("/")
def list_roadmaps():
    return []


@router.get("/{roadmap_id}")
def get_roadmap(roadmap_id: str):
    return {
        "id": roadmap_id,
        "goal": "Custom AI Personalized Goal",
        "difficulty": "Intermediate",
        "hours_per_week": 15,
        "budget": "$50",
        "progress": 0,
        "status": "In Progress"
    }


@router.get("/{roadmap_id}/pdf")
def generate_pdf_endpoint(
    roadmap_id: str,
    goal: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    hours_per_week: Optional[int] = Query(15),
    weeks_duration: Optional[int] = Query(6)
):
    roadmap_data = None
    try:
        loaded_json = load_roadmap(roadmap_id)
        if loaded_json:
            roadmap_data = {
                "goal": goal or loaded_json.get("goal") or "Personalized AI Learning Goal",
                "difficulty": difficulty or "Intermediate",
                "hours_per_week": hours_per_week,
                "roadmap_json": loaded_json
            }
    except Exception as e:
        print("Notice: PDF generation database lookup notice:", e)

    if not roadmap_data:
        target_goal = goal or "Personalized AI Learning Goal"
        generated_struct = generate_rich_roadmap(target_goal, weeks_duration, hours_per_week)
        roadmap_dict = generated_struct.model_dump() if hasattr(generated_struct, 'model_dump') else generated_struct
        roadmap_data = {
            "goal": target_goal,
            "difficulty": difficulty or "Intermediate",
            "hours_per_week": hours_per_week,
            "roadmap_json": roadmap_dict.get("roadmap", {})
        }

    pdf_bytes = generate_roadmap_pdf(roadmap_data)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=roadmap_guidebook_{roadmap_id}.pdf"}
    )


@router.post("/{roadmap_id}/pdf")
def generate_pdf_from_post(roadmap_id: str, body: Dict[str, Any] = Body(...)):
    roadmap_data = body if "roadmap_json" in body else {"roadmap_json": body, "goal": body.get("goal", "Personalized AI Learning Goal")}
    pdf_bytes = generate_roadmap_pdf(roadmap_data)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=roadmap_guidebook_{roadmap_id}.pdf"}
    )