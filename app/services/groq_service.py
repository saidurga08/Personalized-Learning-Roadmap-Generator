import json

from groq import Groq

from app.config import GROQ_API_KEY


client = Groq(
    api_key=GROQ_API_KEY
)


def generate_response(prompt: str):

    response = client.chat.completions.create(

        model="llama-3.3-70b-versatile",

        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],

        temperature=0.2

    )

    content = response.choices[0].message.content.strip()

    print("========== GROQ RAW RESPONSE ==========")
    print(content)
    print("=======================================")

    content = (
        content.replace("```json", "")
               .replace("```", "")
               .strip()
    )

    roadmap_json = json.loads(content)

    from app.schemas.roadmap_schema import Roadmap

    roadmap = Roadmap(**roadmap_json)

    return roadmap