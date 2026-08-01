from app.services.prompt_builder import (
    build_modification_prompt
)

from app.services.groq_service import (
    generate_response
)


def modify_roadmap(request):

    current_roadmap = {}

    prompt = build_modification_prompt(

        current_roadmap,

        request.user_message

    )

    updated_roadmap = generate_response(prompt)

    return updated_roadmap