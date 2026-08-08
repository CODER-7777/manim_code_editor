# Manim Code Editor - Production Deployment Guide

## Phase 10: Deployment Instructions

### 1. Frontend (Next.js) -> Vercel
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and create a new project, selecting your GitHub repository.
3. In the Vercel project settings, go to Environment Variables and add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will build and host your Next.js app on its edge network for free.

### 2. Backend (FastAPI + Celery + Manim) -> Microsoft Azure (Ubuntu VM)
Because Manim requires heavy system dependencies, we use a Dockerized backend on an Azure Virtual Machine.

1. **Claim Azure for Students**: Go to [Azure for Students](https://azure.microsoft.com/en-us/free/students/), sign in with your GitHub/student email, and claim your $100 credit.
2. **Create a Virtual Machine**:
   - Go to the Azure Portal -> Virtual Machines -> Create.
   - Choose **Ubuntu Server 24.04 LTS** (or 22.04 LTS).
   - Size: Select `Standard_B2s` (gives you 4GB RAM, perfect for rendering).
   - Authentication type: Select **Password** (or SSH public key if you know how to use it) and create a username/password.
   - In Inbound Port Rules, allow **SSH (22)** and **HTTP (80)**.
3. **SSH into the VM**: Open your terminal and connect to the public IP address Azure gives you:
   ```bash
   ssh your_username@<your_azure_vm_ip>
   ```
4. **Install Docker & Docker Compose**:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose -y
   sudo usermod -aG docker $USER
   newgrp docker
   ```
5. **Clone the Repo** (or just the `backend/` folder).
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
