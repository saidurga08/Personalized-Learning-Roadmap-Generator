import json

def build_generation_prompt(request):

    prompt = f"""
You are PathQuest AI.

Generate a personalized learning roadmap.

Return ONLY valid JSON.

DO NOT return markdown.

DO NOT explain anything.

DO NOT change field names.

Generate a roadmap between 6 and 8 weeks unless the user explicitly asks for longer.

Each week should contain at most 2 topics.

Each topic should contain at most 2 resources.

Return JSON in EXACTLY this format:

{{
  "title": "Machine Learning Foundations with Python",
  "goal": "Master Machine Learning with Python",
  "skill_level": "beginner",
  "estimated_duration_weeks": 8,
  "total_estimated_hours": 100,
  "overview": "A short overview.",
  "weeks": [
    {{
      "week_number": 1,
      "title": "Week title",
      "description": "Week description",
      "estimated_hours": 12.5,
      "milestone": "Milestone",
      "assignment": "Assignment",
      "topics": [
        {{
          "title": "Topic title",
          "description": "Topic description",
          "estimated_hours": 5,
          "resources": [
            {{
              "title": "Resource title",
              "url": "https://...",
              "type": "video",
              "is_free": true
            }}
          ]
        }}
      ]
    }}
  ]
}}

User Constraints

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

Return ONLY JSON.
"""

    return prompt

def build_modification_prompt(roadmap_json, user_message):

    roadmap = json.dumps(roadmap_json, indent=2)

    prompt = f"""
You are PathCraft AI.

You are given an existing roadmap.

Modify ONLY what the user requested.

DO NOT change anything else.

Return ONLY valid JSON.

The response MUST exactly match the following schema.
Do not rename fields.
Do not remove fields.
Do not add new top-level fields.

Current Roadmap:
{roadmap}

User Request:
{user_message}

Return the COMPLETE updated roadmap in the EXACT same JSON structure as the current roadmap.

Return ONLY raw JSON.
Return the COMPLETE updated roadmap in the EXACT same JSON structure as the current roadmap.

IMPORTANT:
- Return ONLY a valid JSON object.
- Do NOT wrap it in markdown.
- Do NOT use ```json.
- Do NOT write any explanation before or after the JSON.
- Preserve every existing field unless the user's request requires changing it.
- If the user asks to remove or modify something, update only the relevant parts.

The first character must be {{
The last character must be }}

Return only the JSON object.
"""

    return prompt