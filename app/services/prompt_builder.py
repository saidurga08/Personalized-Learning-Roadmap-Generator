import json

def build_generation_prompt(request):

    prompt = f"""
You are PathQuest AI.

Generate a personalized learning roadmap.

Return ONLY valid JSON.

DO NOT return markdown.

DO NOT explain anything.

DO NOT change field names.

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