from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from worker import render_manim_code
from celery.result import AsyncResult
import os
import re
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

# ──────────────────────────────────────────────
# Rate Limiter (DDoS / abuse prevention)
# ──────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Manim Render Server")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ──────────────────────────────────────────────
# CORS — restrict to known origins
# ──────────────────────────────────────────────
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# ──────────────────────────────────────────────
# Code Sandboxing — block dangerous imports
# ──────────────────────────────────────────────
BLOCKED_MODULES = [
    "os", "sys", "subprocess", "shutil", "socket", "http",
    "urllib", "requests", "pathlib", "importlib", "ctypes",
    "pickle", "shelve", "signal", "multiprocessing", "threading",
    "asyncio", "webbrowser", "smtplib", "ftplib", "telnetlib",
    "code", "codeop", "compile", "compileall", "py_compile",
    "__import__", "eval", "exec", "open", "builtins",
]

def validate_code(code: str) -> str | None:
    """Returns an error message if the code contains dangerous patterns, else None."""
    # Check for dangerous imports
    for module in BLOCKED_MODULES:
        # Match: import os / from os / import os, sys / __import__('os')
        patterns = [
            rf'\bimport\s+{re.escape(module)}\b',
            rf'\bfrom\s+{re.escape(module)}\b',
            rf"__import__\s*\(\s*['\"]?{re.escape(module)}",
        ]
        for pattern in patterns:
            if re.search(pattern, code):
                return f"Blocked: '{module}' is not allowed for security reasons."
    
    # Block eval/exec calls
    if re.search(r'\b(eval|exec)\s*\(', code):
        return "Blocked: eval() and exec() are not allowed."
    
    # Block open() for file access
    if re.search(r'\bopen\s*\(', code):
        return "Blocked: open() is not allowed. Use Manim's built-in file handling."
    
    # Limit code size (prevent memory bombs)
    if len(code) > 50_000:
        return "Code is too large. Maximum 50,000 characters."
    
    return None


class RenderRequest(BaseModel):
    code: str
    project_id: str

    @field_validator("code")
    @classmethod
    def code_must_be_safe(cls, v: str) -> str:
        error = validate_code(v)
        if error:
            raise ValueError(error)
        return v

    @field_validator("project_id")
    @classmethod
    def project_id_must_be_clean(cls, v: str) -> str:
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError("Invalid project_id format.")
        if len(v) > 100:
            raise ValueError("project_id too long.")
        return v


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────
@app.post("/render")
@limiter.limit("5/minute")  # Max 5 renders per minute per IP
async def start_render(request: Request, req: RenderRequest):
    task = render_manim_code.delay(req.code, req.project_id)
    return {"task_id": task.id, "status": "processing"}

@app.get("/status/{task_id}")
@limiter.limit("30/minute")  # Polling can be more frequent
async def get_status(request: Request, task_id: str):
    # Validate task_id format (UUID)
    if not re.match(r'^[a-f0-9-]+$', task_id):
        raise HTTPException(status_code=400, detail="Invalid task ID")
    
    task_result = AsyncResult(task_id)
    return {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result if task_result.ready() else None
    }

@app.get("/health")
async def health():
    return {"status": "ok"}
