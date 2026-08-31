from fastapi import FastAPI, Body, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from typing import Dict, Any

from app.database import Base, engine
from app.models import *
from app.routers import auth_router
from app.routers.roadmap import router as roadmap_router
from app.schemas.user import UserCreate, UserLogin
from app.services.auth_service import register_user, authenticate_user

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

# Top-level API bindings matching frontend Axios client routes
@app.post("/register")
def register_top(user_in: UserCreate):
    return register_user(user_in)

@app.post("/login")
def login_top(login_in: UserLogin):
    return authenticate_user(login_in.email, login_in.password)

@app.get("/profile")
def profile_top():
    return {
        "id": "1",
        "name": "Alex Rivera",
        "email": "alex.rivera@example.com",
        "study_streak": 12
    }

@app.get("/dashboard")
def dashboard_top():
    return {
        "active_roadmaps_count": 2,
        "completed_tasks_count": 14,
        "total_tasks_count": 24,
        "overall_progress_percentage": 58,
        "study_streak_days": 12
    }

@app.get("/badges")
def badges_top():
    return [
        {"id": 1, "badge_name": "First Roadmap", "unlocked": True, "icon": "🚀"},
        {"id": 2, "badge_name": "25% Complete", "unlocked": True, "icon": "🥉"},
        {"id": 3, "badge_name": "50% Complete", "unlocked": True, "icon": "🥈"},
        {"id": 4, "badge_name": "75% Complete", "unlocked": False, "icon": "🥇"},
        {"id": 5, "badge_name": "100% Mastered", "unlocked": False, "icon": "👑"}
    ]

@app.patch("/tasks/{task_id}")
def update_task_status(task_id: str, body: Dict[str, Any] = Body(...)):
    return {"status": "success", "task_id": task_id, "completed": body.get("completed", True)}

@app.post("/calendar/sync")
def sync_calendar(body: Dict[str, Any] = Body(...)):
    return {"status": "synced", "calendar": "Google Calendar", "events_created": 4}

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