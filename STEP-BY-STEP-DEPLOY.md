# 🚀 Step-by-Step Netlify Deployment Guide

## Step 1: Access Netlify (2 minutes)

1. **Open your browser** and go to [netlify.com](https://netlify.com)
2. **Sign up or log in** (you can use GitHub, GitLab, or email)
3. **Click "New site from Git"** (big green button on dashboard)

## Step 2: Connect Your Repository (1 minute)

1. **Choose "GitHub"** as your Git provider
2. **Authorize Netlify** to access your GitHub account (if first time)
3. **Search for "codecrafter"** or find it in the list
4. **Click on your codecrafter repository**

## Step 3: Configure Build Settings (1 minute)

Netlify should auto-detect these settings from your `netlify.toml` file:

- ✅ **Base directory**: `frontend`
- ✅ **Build command**: `npm run build`
- ✅ **Publish directory**: `frontend/build`
- ✅ **Functions directory**: `netlify/functions`

**If not auto-detected, enter these manually.**

## Step 4: Add Environment Variables (2 minutes)

**IMPORTANT**: Before clicking "Deploy site", add your environment variables:

1. **Click "Advanced build settings"**
2. **Click "New variable"** and add:

```
Variable 1:
Key: SUPABASE_URL
Value: https://vhzvkimibbwdteszrhna.supabase.co

Variable 2:
Key: SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoenZraW1pYmJ3ZHRlc3pyaG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2ODEwNzgsImV4cCI6MjA3MDI1NzA3OH0.26xd2E68c5cxDSwxr7SDb-gZ8BuXsDCScK4PpXXEIKc
```

## Step 5: Deploy! (3-5 minutes)

1. **Click "Deploy site"**
2. **Wait for build to complete** (you'll see build logs)
3. **Your site will get a random URL** like `https://amazing-name-123456.netlify.app`

## Step 6: Test Your Application (2 minutes)

1. **Click on your site URL**
2. **Test the form**: Enter an app idea and click "Generate Code"
3. **Test voice input**: Click the microphone button
4. **Verify**: Check that code is generated and displayed

## Step 7: Optional - Custom Domain (5 minutes)

1. **Go to Site settings > Domain management**
2. **Click "Add custom domain"**
3. **Enter your domain** (if you have one)
4. **Follow DNS setup instructions**

---

## 🆘 Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Verify all environment variables are set correctly
- Make sure Node.js version is compatible (16+)

### Functions Not Working
- Check Functions tab in Netlify dashboard
- Verify environment variables are available to functions
- Test individual function endpoints

### Database Connection Issues
- Verify Supabase URL and key are correct
- Check that database table exists (run setup.sql)
- Review Supabase logs

---

## ✅ Success Checklist

- [ ] Site deploys successfully
- [ ] Environment variables are set
- [ ] Form submission works
- [ ] Code generation displays results
- [ ] Voice input button works (mock transcription)
- [ ] Data is saved to Supabase database

---

## 🎉 You're Live!

Once deployed, your CodeCrafter app will have:
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **HTTPS**: Automatic SSL certificate
- ✅ **Auto-deploy**: Updates on every Git push
- ✅ **Serverless backend**: Netlify Functions
- ✅ **Database**: Supabase integration

**Share your live URL with others to try CodeCrafter!**