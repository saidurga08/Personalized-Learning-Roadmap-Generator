from fastapi import FastAPI
from sqlalchemy import text

from app.database import Base, engine
from app.models import *

from app.routers import auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PathQuest API",
    version="1.0.0"
)
app.include_router(auth_router)


@app.get("/")
def root():
    return {"message": "PathQuest Backend Running"}


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