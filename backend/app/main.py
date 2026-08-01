from fastapi import FastAPI

app = FastAPI(
    title="PathQuest API",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "PathQuest Backend Running"
    }