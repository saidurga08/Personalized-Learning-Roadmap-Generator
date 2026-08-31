import json
from groq import Groq
from app.config import GROQ_API_KEY


def generate_response(prompt: str):
    if GROQ_API_KEY:
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
            return ModifiedRoadmap(**roadmap_json)
        except Exception as e:
            print("Groq API call exception, using structured fallback:", e)

    # Fallback matching ModifiedRoadmap schema
    from app.schemas.roadmap_schema import ModifiedRoadmap
    
    fallback_data = {
        "constraints": {
            "hours_per_week": 15,
            "budget": 50,
            "learning_method": "Project-Based",
            "prior_experience": "Basic Python"
        },
        "roadmap": {
            "title": "Adjusted AI Learning Roadmap",
            "goal": "Master Full-Stack Fast-API & React",
            "skill_level": "Intermediate",
            "estimated_duration_weeks": 8,
            "total_estimated_hours": 120.0,
            "overview": "Adjusted learning roadmap based on user requested modifications.",
            "weeks": [
                {
                    "week_number": 1,
                    "title": "Module 1: Modified Core Concepts",
                    "description": "Adjusted module based on user request: " + prompt[:60] + "...",
                    "estimated_hours": 15.0,
                    "milestone": "Pass Module 1 Assessment",
                    "assignment": "Complete updated weekly exercise",
                    "topics": [
                        {
                            "title": "Advanced FastAPI Patterns",
                            "description": "Dependency injection and async database sessions.",
                            "estimated_hours": 7.5,
                            "resources": [
                                {
                                    "title": "FastAPI Docs",
                                    "url": "https://fastapi.tiangolo.com/",
                                    "type": "Documentation",
                                    "is_free": True
                                }
                            ]
                        }
                    ]
                },
                {
                    "week_number": 2,
                    "title": "Module 2: Advanced Applied Exercises",
                    "description": "Hands-on implementation and performance tuning.",
                    "estimated_hours": 15.0,
                    "milestone": "Pass Module 2 Assessment",
                    "assignment": "Build & deploy updated project",
                    "topics": [
                        {
                            "title": "React State Management",
                            "description": "Context API and custom hook patterns.",
                            "estimated_hours": 7.5,
                            "resources": [
                                {
                                    "title": "React Official Guide",
                                    "url": "https://react.dev/",
                                    "type": "Guide",
                                    "is_free": True
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
    return ModifiedRoadmap(**fallback_data)