from app.services.groq_service import (
    generate_response
)

prompt = """
Return ONLY JSON.

{
    "status":"working"
}
"""

response = generate_response(prompt)

print(response)