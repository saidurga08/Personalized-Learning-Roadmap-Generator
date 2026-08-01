from app.services.prompt_builder import build_generation_prompt
from app.services.groq_service import generate_response
from app.services.db_sync_service import (
    save_goal,
    save_roadmap,
    save_constraints,
    save_steps,
    update_roadmap_json
)

TEST_USER_ID = "ce753051-0512-4c08-b38f-c7f338bac676"


def generate_roadmap(request):

    prompt = build_generation_prompt(request)

    roadmap = generate_response(prompt)

    goal_id = save_goal(
        TEST_USER_ID,
        roadmap
    )

    roadmap_id = save_roadmap(
        TEST_USER_ID,
        goal_id,
        roadmap
    )

    save_constraints(
        roadmap_id,
        request
    )

    save_steps(
        roadmap_id,
        roadmap
    )

    update_roadmap_json(
        roadmap_id,
        roadmap
    )

    return {
        "roadmap_id": roadmap_id,
        "roadmap": roadmap.model_dump()
    }