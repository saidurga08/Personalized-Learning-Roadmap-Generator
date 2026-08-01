import json


def build_generation_prompt(request):

    prompt = f"""
You are PathQuest AI.

Your task is to generate a personalized learning roadmap.

Return ONLY valid JSON.

User Constraints:

Goal:
{request.goal}

Skill Level:
{request.skill_level}

Hours Per Week:
{request.hours_per_week}

Budget:
{request.budget}

Learning Method:
{request.learning_method}

Prior Experience:
{request.prior_experience}

Generate the roadmap using the agreed JSON format.

Do not include markdown.

Do not explain anything.

Return JSON only.
"""

    return prompt

def build_modification_prompt(
    roadmap_json,
    user_message
):

    roadmap = json.dumps(
        roadmap_json,
        indent=4
    )

    prompt = f"""
You are PathQuest AI.

You are given an existing roadmap.

Modify ONLY what the user requested.

Keep everything else unchanged.

Return ONLY valid JSON.

Current Roadmap:

{roadmap}

User Request:

{user_message}

Return the COMPLETE updated roadmap.

Do not explain.

Do not use markdown.

Return JSON only.
"""

    return prompt