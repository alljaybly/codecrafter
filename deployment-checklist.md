# CodeCrafter Deployment Checklist

## ✅ Step 1: Supabase Database Setup

1. **Create Supabase Project**
   - [ ] Go to https://supabase.com
   - [ ] Click "New Project"
   - [ ] Choose organization and project name: "codecrafter"
   - [ ] Select region closest to your users
   - [ ] Set database password (save this!)
   - [ ] Wait for project creation (2-3 minutes)

2. **Run Database Setup**
   - [ ] Go to your Supabase dashboard
   - [ ] Click "SQL Editor" in the left sidebar
   - [ ] Copy and paste the contents from `database/setup.sql`
   - [ ] Click "Run" to execute the script
   - [ ] Verify table creation in "Table Editor"

3. **Get API Credentials**
   - [ ] Go to Settings > API
   - [ ] Copy "Project URL" 
   - [ ] Copy "anon public" key
   - [ ] Save these for backend configuration

## ✅ Step 2: Backend Deployment (Railway)

1. **Prepare Backend**
   - [ ] Create Railway account at https://railway.app
   - [ ] Install Railway CLI: `npm install -g @railway/cli`
   - [ ] Login: `railway login`

2. **Deploy Backend**
   - [ ] Navigate to backend folder: `cd backend`
   - [ ] Initialize: `railway init`
   - [ ] Deploy: `railway up`

3. **Set Environment Variables**
   - [ ] Go to Railway dashboard
   - [ ] Click on your service
   - [ ] Go to "Variables" tab
   - [ ] Add all required environment variables

## ✅ Step 3: Frontend Deployment (Netlify)

1. **Prepare Frontend**
   - [ ] Create Netlify account at https://netlify.com
   - [ ] Connect GitHub repository

2. **Configure Build Settings**
   - [ ] Base directory: `frontend`
   - [ ] Build command: `npm run build`
   - [ ] Publish directory: `frontend/build`

3. **Set Environment Variables**
   - [ ] Add REACT_APP_API_URL with your Railway backend URL

## ✅ Step 4: Testing

1. **Test Backend**
   - [ ] Visit your Railway URL
   - [ ] Test /generate-code endpoint

2. **Test Frontend**
   - [ ] Visit your Netlify URL
   - [ ] Test form submission
   - [ ] Test voice input

## 🔧 Environment Variables Reference

### Backend (Railway)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
AWS_ACCESS_KEY_ID=your-aws-key (optional for now)
AWS_SECRET_ACCESS_KEY=your-aws-secret (optional for now)
AWS_REGION=us-east-1
PORT=3001
```

### Frontend (Netlify)
```
REACT_APP_API_URL=https://your-backend.railway.app
```