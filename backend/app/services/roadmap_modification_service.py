from app.services.prompt_builder import build_modification_prompt
from app.services.groq_service import generate_response
from app.services.db_sync_service import (
    load_roadmap,
    update_roadmap_json,
    update_constraints,
    delete_resources,
    delete_steps,
    save_steps
)


def modify_roadmap(request):
    roadmap_id = str(getattr(request, 'roadmap_id', '101'))
    user_msg = getattr(request, 'modification_prompt', None) or getattr(request, 'user_message', None) or "Adjust workload and topics"

    try:
        current_roadmap = load_roadmap(roadmap_id)
    except Exception as e:
        print("Notice: load_roadmap failed, using default roadmap context:", e)
        current_roadmap = {"title": "Learning Roadmap", "steps": []}

    prompt = build_modification_prompt(
        current_roadmap,
        user_msg
    )

    result = generate_response(prompt)

    try:
        if hasattr(result, 'constraints') and result.constraints:
            update_constraints(roadmap_id, result.constraints)
        if hasattr(result, 'roadmap') and result.roadmap:
            delete_resources(roadmap_id)
            delete_steps(roadmap_id)
            save_steps(roadmap_id, result.roadmap)
            update_roadmap_json(roadmap_id, result.roadmap)
    except Exception as db_err:
        print("Notice: DB sync skipped during modification:", db_err)

    return result