# 🚀 Deploy CodeCrafter NOW!

**Total time: ~15 minutes**

## 🎯 Quick Start (Choose Your Path)

### Path A: Automated Setup (Recommended)
```bash
# 1. Setup environment files
node setup-env.js

# 2. Install dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# 3. Deploy backend (Railway)
node deploy-backend.js

# 4. Deploy frontend (see step 3 below)
```

### Path B: Manual Setup
Follow the steps below manually.

---

## 📋 Step-by-Step Manual Deployment

### 1. Database Setup (3 minutes)

**Create Supabase Project:**
1. Go to [supabase.com](https://supabase.com) → "New Project"
2. Name: `codecrafter`, choose region, set password
3. Wait for project creation

**Setup Database:**
1. Supabase dashboard → "SQL Editor"
2. Run this SQL:
```sql
CREATE TABLE IF NOT EXISTS generated_code (
    id BIGSERIAL PRIMARY KEY,
    idea TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generated_code_generated_at ON generated_code(generated_at DESC);
ALTER TABLE generated_code ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on generated_code" ON generated_code FOR ALL USING (true);
```

3. Settings → API → Copy "Project URL" and "anon public" key

### 2. Backend Deploy (5 minutes)

**Railway (Recommended):**
1. [railway.app](https://railway.app) → "New Project" → "Deploy from GitHub repo"
2. Connect repo, Railway auto-detects Node.js
3. Variables tab → Add:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   PORT=3001
   ```
4. Get your Railway URL from dashboard

**Alternative - Render:**
1. [render.com](https://render.com) → "New Web Service"
2. Root Directory: `backend`
3. Build: `npm install`, Start: `npm start`
4. Add same environment variables

### 3. Frontend Deploy (5 minutes)

**Netlify:**
1. [netlify.com](https://netlify.com) → "New site from Git"
2. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
3. Environment variables:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   ```
4. Deploy!

### 4. Test (2 minutes)

1. **Backend**: Visit `https://your-backend.railway.app/health`
2. **Frontend**: Visit your Netlify URL
3. **Integration**: Try generating code!

---

## 🔧 Environment Variables Cheat Sheet

### Backend (.env)
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
PORT=3001
```

### Frontend (.env)
```bash
REACT_APP_API_URL=https://your-backend.railway.app
```

---

## 🆘 Troubleshooting

### "Can't connect to database"
- Check Supabase URL and key are correct
- Verify SQL script ran successfully
- Check backend logs

### "API calls failing"
- Verify REACT_APP_API_URL is correct
- Check CORS settings in backend
- Test backend health endpoint

### "Build failing"
- Check Node.js version (use 16+)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

---

## 🎉 Success!

Your CodeCrafter app is now live! 

**Next Steps:**
- Share your Netlify URL
- Add custom domain
- Set up AWS Transcribe for real voice input
- Add user authentication

**URLs to bookmark:**
- Frontend: `https://your-app.netlify.app`
- Backend: `https://your-backend.railway.app`
- Database: Supabase dashboard

---

## 💡 Pro Tips

1. **Custom Domain**: Add your domain in Netlify settings
2. **HTTPS**: Automatic on both platforms
3. **Monitoring**: Check Railway/Netlify dashboards for logs
4. **Updates**: Push to GitHub to auto-deploy
5. **Scaling**: Both platforms auto-scale

**Need help?** Check the detailed guides in `docs/` folder!