# Manim Code Editor - Production Deployment Guide

## Phase 10: Deployment Instructions

### 1. Frontend (Next.js) -> Vercel
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and create a new project, selecting your GitHub repository.
3. In the Vercel project settings, go to Environment Variables and add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will build and host your Next.js app on its edge network for free.

### 2. Backend (FastAPI + Celery + Manim) -> DigitalOcean Droplet
Because Manim requires heavy system dependencies, we use a Dockerized backend on a DigitalOcean Droplet.

1. **Create a Droplet**: Sign up for DigitalOcean (use GitHub Student Pack for credits). Create an Ubuntu Droplet (at least 2GB RAM recommended).
2. **SSH into the Droplet**:
   ```bash
   ssh root@<your_droplet_ip>
   ```
3. **Install Docker & Docker Compose**:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose
   ```
4. **Clone the Repo** (or just the `backend/` folder).
5. **Set Environment Variables**:
   Create a `.env` file in the `backend/` directory on the server with:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   CELERY_BROKER_URL=redis://redis:6379/0
   CELERY_RESULT_BACKEND=redis://redis:6379/0
   ```
6. **Docker Compose Setup**:
   Create a `docker-compose.yml` in the `backend/` folder:
   ```yaml
   version: '3.8'
   services:
     redis:
       image: redis:alpine
       ports:
         - "6379:6379"
     web:
       build: .
       command: uvicorn main:app --host 0.0.0.0 --port 8000
       ports:
         - "8000:8000"
       depends_on:
         - redis
       env_file:
         - .env
     worker:
       build: .
       command: celery -A worker.celery_app worker --loglevel=info
       depends_on:
         - redis
       env_file:
         - .env
   ```
7. **Start the Backend**:
   ```bash
   docker-compose up -d
   ```
   Your FastAPI server will be running on port 8000. You should set up a reverse proxy (like Nginx) and SSL (Certbot) for production.

### 3. Custom Domain
1. Claim a free domain via the GitHub Student Developer Pack (Namecheap, Name.com, or .tech).
2. In Vercel, go to Settings -> Domains and add your custom domain.
3. Copy the IP address provided by Vercel.
4. Go to your domain registrar's DNS settings and add an `A` record pointing to the Vercel IP.
