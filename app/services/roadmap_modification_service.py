from app.services.db_sync_service import (
    load_roadmap,
    update_roadmap_json
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

    print("========== CURRENT ROADMAP ==========")
    print(repr(current_roadmap))
    print(type(current_roadmap))
    print("=====================================")
    prompt = build_modification_prompt(
        current_roadmap,
        request.user_message
    )

    updated_roadmap = generate_response(
        prompt
    )

    update_roadmap_json(
        request.roadmap_id,
        updated_roadmap
    )

    return updated_roadmap