# AI SkillSync - Deployment Guide

## Quick Deploy to Render (Free)

### Step 1: Create a Render Account
1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create a Web Service
1. In Render dashboard, click "New" → "Web Service"
2. Connect your GitHub repository: `skaushikan764-byte/ai-skillsync`
3. Configure:
   - **Name:** ai-skillsync
   - **Environment:** Python
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 3: Deploy
- Click "Create Web Service"
- Wait 2-3 minutes for deployment
- Get your live URL!

---

## Quick Deploy to Railway

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub

### Step 2: Deploy
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `skaushikan764-byte/ai-skillsync`
4. Click "Deploy"

---

## Quick Deploy to Heroku

### Step 1: Install Heroku CLI
```bash
npm install -g heroku
```

### Step 2: Create & Deploy
```bash
heroku create ai-skillsync
git push heroku main
```

---

## Local Development

Run locally:
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Visit: http://localhost:8000
