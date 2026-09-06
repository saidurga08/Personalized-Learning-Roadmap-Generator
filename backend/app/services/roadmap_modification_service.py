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
    roadmap_id = str(getattr(request, 'roadmap_id', ''))
    user_msg = getattr(request, 'modification_prompt', None) or getattr(request, 'user_message', None) or "Adjust workload and topics"
    
    current_roadmap = None
    if roadmap_id:
        try:
            current_roadmap = load_roadmap(roadmap_id)
        except Exception as e:
            print("Notice: load_roadmap failed or not found in DB:", e)

    if not current_roadmap and hasattr(request, 'current_roadmap') and request.current_roadmap:
        current_roadmap = request.current_roadmap

    if not isinstance(current_roadmap, dict):
        current_roadmap = {}

    goal_name = getattr(request, 'goal', None) or current_roadmap.get('goal') or current_roadmap.get('title') or "Learning Goal"
    raw_weeks = current_roadmap.get('weeks', []) if isinstance(current_roadmap.get('weeks'), list) else []
    weeks_duration = getattr(request, 'weeks_duration', None) or (len(raw_weeks) if raw_weeks else 6)

    # Ensure context fields are set
    current_roadmap['goal'] = goal_name
    current_roadmap['title'] = current_roadmap.get('title') or f"{goal_name} Roadmap"
    current_roadmap['estimated_duration_weeks'] = weeks_duration

    # Attach goal & weeks_duration to request object if missing
    if not getattr(request, 'goal', None):
        setattr(request, 'goal', goal_name)
    if not getattr(request, 'weeks_duration', None):
        setattr(request, 'weeks_duration', weeks_duration)

    prompt = build_modification_prompt(
        current_roadmap,
        user_msg
    )

    result = generate_response(prompt, request)

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