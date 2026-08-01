from app.schemas.request_schema import (
    GenerateRoadmapRequest
)

from app.services.prompt_builder import (
    build_generation_prompt
)


request = GenerateRoadmapRequest(

    goal="Machine Learning",

    skill_level="Beginner",

    hours_per_week=10,

    budget=5000,

    learning_method="Video",

    prior_experience="Basic Python"

)

prompt = build_generation_prompt(request)

print(prompt)