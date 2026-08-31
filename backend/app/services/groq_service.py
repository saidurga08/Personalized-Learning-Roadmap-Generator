import json
import re
from groq import Groq
from app.config import GROQ_API_KEY


def generate_response(prompt: str, request=None):
    if GROQ_API_KEY and GROQ_API_KEY.strip() and not GROQ_API_KEY.startswith("gsk_placeholder"):
        try:
            client = Groq(api_key=GROQ_API_KEY)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.2,
                max_completion_tokens=8000
            )

            content = response.choices[0].message.content.strip()
            content = (
                content.replace("```json", "")
                       .replace("```", "")
                       .strip()
            )

            roadmap_json = json.loads(content)
            from app.schemas.roadmap_schema import ModifiedRoadmap
            try:
                return ModifiedRoadmap(**roadmap_json)
            except Exception:
                return roadmap_json
        except Exception as e:
            print("Groq API call exception, using dynamic fallback:", e)

    # Dynamic fallback customized for user goal and requested duration
    goal_name = "Custom Learning Path"
    duration_weeks = 6
    hours_per_wk = 15

    # Extract goal from prompt or request
    if request and hasattr(request, 'goal') and request.goal:
        goal_name = request.goal
    else:
        goal_match = re.search(r"Goal:\s*\n?([^\n]+)", prompt, re.IGNORECASE)
        if goal_match:
            goal_name = goal_match.group(1).strip()

    # Extract weeks duration from prompt or request
    if request and hasattr(request, 'weeks_duration') and request.weeks_duration:
        duration_weeks = int(request.weeks_duration)
    else:
        weeks_match = re.search(r"(\d+)\s*week", prompt, re.IGNORECASE)
        if weeks_match:
            duration_weeks = int(weeks_match.group(1))

    # Extract hours per week
    if request and hasattr(request, 'hours_per_week') and request.hours_per_week:
        hours_per_wk = int(request.hours_per_week)

    generated_weeks = []
    for w in range(1, duration_weeks + 1):
        generated_weeks.append({
            "week_number": w,
            "week": w,
            "title": f"Module {w}: {goal_name} - Phase {w}",
            "description": f"Master week {w} core concepts and applied exercises for {goal_name}.",
            "estimated_hours": float(hours_per_wk),
            "milestone": f"Pass Week {w} Practical Assessment",
            "assignment": f"Complete hands-on {goal_name} mini-project for Week {w}",
            "topics": [
                {
                    "title": f"{goal_name} Architecture & Design Patterns Part {w}",
                    "description": f"Deep dive into key principles and foundational patterns of {goal_name}.",
                    "estimated_hours": hours_per_wk / 2.0,
                    "resources": [
                        {
                            "title": f"{goal_name} Official Reference Guide",
                            "url": "https://developer.mozilla.org/",
                            "type": "Documentation",
                            "is_free": True
                        }
                    ]
                },
                {
                    "title": f"Applied Hands-on Project & Optimization Part {w}",
                    "description": f"Practical exercise and performance tuning for Week {w}.",
                    "estimated_hours": hours_per_wk / 2.0,
                    "resources": [
                        {
                            "title": f"Mastering {goal_name} Video Course",
                            "url": "https://youtube.com",
                            "type": "Video",
                            "is_free": True
                        }
                    ]
                }
            ],
            "tasks": [
                {"id": 1000 + w * 10 + 1, "title": f"Read study guide for Week {w}", "completed": False},
                {"id": 1000 + w * 10 + 2, "title": f"Complete practical coding lab #{w}", "completed": False},
                {"id": 1000 + w * 10 + 3, "title": f"Submit weekly assignment project for Week {w}", "completed": False}
            ]
        })

    fallback_data = {
        "constraints": {
            "hours_per_week": hours_per_wk,
            "budget": 50,
            "learning_method": "both (videos and text)",
            "prior_experience": "Intermediate"
        },
        "roadmap": {
            "title": f"{goal_name} Master Roadmap",
            "goal": goal_name,
            "skill_level": "Intermediate",
            "estimated_duration_weeks": duration_weeks,
            "total_estimated_hours": float(hours_per_wk * duration_weeks),
            "overview": f"A comprehensive {duration_weeks}-week AI learning path designed to master {goal_name}.",
            "weeks": generated_weeks
        }
    }

    from app.schemas.roadmap_schema import ModifiedRoadmap
    try:
        return ModifiedRoadmap(**fallback_data)
    except Exception:
        return fallback_data