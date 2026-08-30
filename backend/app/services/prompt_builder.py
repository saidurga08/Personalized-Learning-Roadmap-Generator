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

Updated Constraints Rules:

Return the updated constraints in the "constraints" object.

The value of "learning_method" MUST be exactly one of:

- videos
- text 
- both (videos and text)

Do NOT return values like:
- online
- offline
- self-paced
- hybrid

The value MUST match the database enum exactly.

Return ONLY JSON.
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

You may:
- change the duration
- change study hours
- change the budget
- replace resources
- reorder weeks
- remove completed topics
- add new topics
- compress or expand the schedule
- reschedule missed work
- modify milestones

BUT preserve the user's overall learning goal unless explicitly changed.

Return ONLY valid JSON.

Do NOT explain anything.

Do NOT use markdown.

Return EXACTLY this JSON structure:

{{
  "constraints":
  {{
      "hours_per_week": integer,
      "budget": integer,
      "learning_method": string,
      "prior_experience": string
  }},

  "roadmap":
  {{
      "title": "...",
      "goal": "...",
      "skill_level": "...",
      "estimated_duration_weeks": integer,
      "total_estimated_hours": integer,
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

Updated Constraints Rules:

Return the updated constraints in the "constraints" object.

The value of "learning_method" MUST be exactly one of:

- videos
- text
- both (text and video)

Do NOT return values like:
- online
- offline
- self-paced
- hybrid

The value MUST match the database enum exactly.

Return ONLY raw JSON.
"""

    return prompt