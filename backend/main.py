from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from worker import render_manim_code
from celery.result import AsyncResult
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Manim Render Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RenderRequest(BaseModel):
    code: str
    project_id: str

@app.post("/render")
async def start_render(req: RenderRequest):
    # Pass the code and project_id to the celery worker
    task = render_manim_code.delay(req.code, req.project_id)
    return {"task_id": task.id, "status": "processing"}

@app.get("/status/{task_id}")
async def get_status(task_id: str):
    task_result = AsyncResult(task_id)
    return {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result if task_result.ready() else None
    }
