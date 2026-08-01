from fastapi import FastAPI
from app.routers.roadmap import router as roadmap_router

app = FastAPI(
    title="PathCraft Roadmap Engine"
)

app.include_router(roadmap_router)


@app.get("/")
def home():
    return {
        "message": "PathCraft Roadmap Engine Running"
    }