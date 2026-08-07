import os
import subprocess
import tempfile
import shutil
from celery import Celery
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

# Initialize Celery connected to Redis
celery_app = Celery(
    "manim_worker",
    broker=os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0"),
    backend=os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
)

# Initialize Supabase Client
supabase_url: str = os.environ.get("SUPABASE_URL", "")
supabase_key: str = os.environ.get("SUPABASE_SERVICE_KEY", "")
supabase = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

@celery_app.task(bind=True)
def render_manim_code(self, code: str, project_id: str):
    # 1. Create a temporary directory
    with tempfile.TemporaryDirectory() as temp_dir:
        code_path = os.path.join(temp_dir, "scene.py")
        
        # 2. Write the user code to scene.py
        with open(code_path, "w") as f:
            f.write(code)
            
        # 3. Run manim
        # We assume the scene class is always named 'MainScene' or we just render all scenes
        # To be safe, we will just render the file and output it at low quality for preview (-ql)
        # You can change -ql to -qh for high quality.
        command = [
            "manim", 
            code_path, 
            "-ql", 
            "--media_dir", temp_dir,
            "-o", f"{project_id}.mp4"
        ]
        
        try:
            # We don't want to run forever, add a timeout
            process = subprocess.run(
                command, 
                cwd=temp_dir, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE,
                timeout=60,
                text=True
            )
            
            if process.returncode != 0:
                return {"error": "Manim rendering failed", "details": process.stderr}
                
        except subprocess.TimeoutExpired:
            return {"error": "Rendering timed out."}
            
        # 4. Find the generated mp4
        video_dir = os.path.join(temp_dir, "videos", "scene", "480p15") # -ql outputs to 480p15
        video_path = os.path.join(video_dir, f"{project_id}.mp4")
        
        if not os.path.exists(video_path):
            # Fallback search if manim changed output paths
            video_path = None
            for root, dirs, files in os.walk(temp_dir):
                for file in files:
                    if file.endswith(".mp4"):
                        video_path = os.path.join(root, file)
                        break
        
        if not video_path:
            return {"error": "Video file not found after rendering"}
            
        # 5. Upload to Supabase Storage
        file_name = f"{project_id}_{self.request.id}.mp4"
        public_url = None
        
        if supabase:
            with open(video_path, "rb") as f:
                supabase.storage.from_("manim-videos").upload(
                    path=file_name,
                    file=f,
                    file_options={"content-type": "video/mp4"}
                )
                
            # 6. Return the public URL
            public_url = supabase.storage.from_("manim-videos").get_public_url(file_name)
        
        return {"success": True, "video_url": public_url, "local_path": video_path}
