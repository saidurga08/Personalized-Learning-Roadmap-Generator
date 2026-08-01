from app.services.prompt_builder import (
    build_generation_prompt
)

from app.services.groq_service import (
    generate_response
)


def generate_roadmap(request):

    prompt = build_generation_prompt(request)

    roadmap = generate_response(prompt)

    return roadmap