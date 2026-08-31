import json

def build_generation_prompt(request):
    weeks_count = getattr(request, 'weeks_duration', 6) or 6

    prompt = f"""
You are PathQuest AI.

Generate a personalized learning roadmap for EXACTLY {weeks_count} weeks.

Return ONLY valid JSON.

DO NOT return markdown.

DO NOT explain anything.

DO NOT change field names.

The roadmap MUST contain EXACTLY {weeks_count} week items in the "weeks" array (from week_number 1 to {weeks_count}).

Each week should be specifically focused on the user's goal: "{request.goal}".

Each week should contain at least 2 topics.

Each topic should contain relevant resources.

Return JSON in EXACTLY this format:

{{
  "title": "{request.goal} Master Roadmap",
  "goal": "{request.goal}",
  "skill_level": "{request.skill_level}",
  "estimated_duration_weeks": {weeks_count},
  "total_estimated_hours": {float(request.hours_per_week) * weeks_count},
  "overview": "A personalized learning roadmap for {request.goal}.",
  "weeks": [
    {{
      "week_number": 1,
      "title": "Week 1 title",
      "description": "Week 1 description",
      "estimated_hours": {request.hours_per_week},
      "milestone": "Milestone 1",
      "assignment": "Assignment 1",
      "topics": [
        {{
          "title": "Topic title",
          "description": "Topic description",
          "estimated_hours": 5,
          "resources": [
            {{
              "title": "Resource title",
              "url": "https://developer.mozilla.org/",
              "type": "video",
              "is_free": true
            }}
          ]
        }}
      ]
    }}
  ]
}}

User Constraints:

Goal:
{request.goal}

Skill Level:
{request.skill_level}

Hours Per Week:
{request.hours_per_week}

Target Weeks Duration:
{weeks_count}

Budget:
{request.budget}

Learning Method:
{request.learning_method}

Prior Experience:
{request.prior_experience}

Return ONLY raw JSON.
"""

    return prompt

def build_modification_prompt(
    roadmap_json,
    user_message
):

    roadmap = json.dumps(
        roadmap_json,
        indent=2
    )

    prompt = f"""
You are PathCraft AI.

You are given an existing personalized learning roadmap.

The user wants to modify it.

Your job is to generate a NEW updated roadmap that satisfies the user's request.

Preserve the user's overall learning goal unless explicitly changed.

Return ONLY valid JSON.

Do NOT explain anything.

Do NOT use markdown.

Return EXACTLY this JSON structure:

{{
  "constraints":
  {{
      "hours_per_week": 15,
      "budget": 50,
      "learning_method": "both (videos and text)",
      "prior_experience": "Intermediate"
  }},

  "roadmap":
  {{
      "title": "...",
      "goal": "...",
      "skill_level": "...",
      "estimated_duration_weeks": 6,
      "total_estimated_hours": 90,
      "overview": "...",
      "weeks": [
          ...
      ]
  }}
}}

Current Roadmap:

{roadmap}

User Request:

{user_message}

Return ONLY raw JSON.
"""

    return prompt