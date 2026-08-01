from fastapi import FastAPI

app = FastAPI(
    title="PathCraft Roadmap Engine"
)


@app.get("/")
def home():
    return {
        "message": "PathCraft Roadmap Engine Running"
    }