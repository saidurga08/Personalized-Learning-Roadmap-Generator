from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import Base, engine
from app.models import *

from app.routers import auth_router
from app.routers.roadmap import router as roadmap_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LearnPath AI — Full-Stack Backend API",
    version="1.0.0",
    description="Unified FastAPI Backend combining Authentication and Groq AI Roadmap Engine"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(roadmap_router)


@app.get("/")
def root():
    return {
        "message": "LearnPath AI Full-Stack Unified Backend Running",
        "services": ["Authentication (JWT)", "Groq AI Roadmap Engine", "PostgreSQL DB Persistence"]
    }


@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "success",
            "database": "Connected"
        }

    except Exception as e:
        return {
            "status": "error",
            "database": str(e)
        }