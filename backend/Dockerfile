# Use the official Manim Community image which includes all heavy dependencies 
# like FFmpeg, LaTeX (texlive), and Pango/Cairo.
FROM manimcommunity/manim:latest

# Switch to root to install python dependencies
USER root

# Set the working directory
WORKDIR /app

# Copy the backend files
COPY requirements.txt .

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# We need a start script or we can just default to running FastAPI. 
# In production, we'd run Celery and FastAPI in separate containers, 
# but for simplicity on a single Droplet, we could run them via a process manager like supervisord, 
# or just provide instructions to run two containers from this image.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
