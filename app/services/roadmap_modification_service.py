from app.services.db_sync_service import (
    load_roadmap,
    update_roadmap_json,
    update_constraints,
    delete_resources,
    delete_steps,
    save_steps
)

from app.services.prompt_builder import (
    build_modification_prompt
)

from app.services.groq_service import (
    generate_response
)


def modify_roadmap(request):

    current_roadmap = load_roadmap(
        request.roadmap_id
    )

    prompt = build_modification_prompt(
        current_roadmap,
        request.user_message
    )

    result = generate_response(
        prompt
    )

    constraints = result.constraints
    roadmap = result.roadmap

    update_constraints(
        request.roadmap_id,
        constraints
    )

    delete_resources(
        request.roadmap_id
    )

    delete_steps(
        request.roadmap_id
    )

    save_steps(
        request.roadmap_id,
        roadmap
    )

    update_roadmap_json(
        request.roadmap_id,
        roadmap
    )

    return roadmap