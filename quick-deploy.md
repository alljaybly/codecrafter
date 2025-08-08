# 🚀 Quick Deploy Guide

Follow these steps to deploy CodeCrafter in 15 minutes:

## 1. Database Setup (5 minutes)

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) → "New Project"
2. Name: `codecrafter`, choose region, set password
3. Wait for project creation

### Setup Database
1. In Supabase dashboard → "SQL Editor"
2. Copy this SQL and run it:

```sql
CREATE TABLE IF NOT EXISTS generated_code (
    id BIGSERIAL PRIMARY KEY,
    idea TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generated_code_generated_at ON generated_code(generated_at DESC);

ALTER TABLE generated_code ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on generated_code" ON generated_code
    FOR ALL USING (true);
```

3. Go to Settings → API, copy:
   - Project URL
   - anon public key

## 2. Backend Deploy (5 minutes)

### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app) → "New Project" → "Deploy from GitHub repo"
2. Connect your repo, select it
3. Railway auto-detects Node.js
4. In project dashboard → "Variables" tab, add:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=3001
   ```
5. Deploy automatically starts, get your URL from dashboard

### Option B: Render
1. Go to [render.com](https://render.com) → "New Web Service"
2. Connect GitHub repo
3. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables
5. Deploy

## 3. Frontend Deploy (5 minutes)

### Netlify Deploy
1. Go to [netlify.com](https://netlify.com) → "New site from Git"
2. Connect GitHub repo
3. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
4. Environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```
5. Deploy site

## 4. Test Everything

1. **Test Backend**: Visit `https://your-backend-url.railway.app/health`
2. **Test Frontend**: Visit your Netlify URL
3. **Test Integration**: Try generating code through the UI

## 🔧 Troubleshooting

### Backend Issues
- Check Railway/Render logs
- Verify environment variables are set
- Test endpoints with curl/Postman

### Frontend Issues
- Check browser console for errors
- Verify REACT_APP_API_URL is correct
- Check network tab for API calls

### Database Issues
- Verify Supabase credentials
- Check SQL was executed successfully
- Review Supabase logs

## 🎉 You're Done!

Your CodeCrafter app should now be live! Share the Netlify URL with others to try it out.

### Next Steps
- Set up custom domain
- Add AWS Transcribe for real voice input
- Implement user authentication
- Add more code templates