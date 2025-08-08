# Deployment Guide

This guide covers deploying CodeCrafter to production environments.

## Frontend Deployment (Netlify)

### Automatic Deployment

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the repository containing CodeCrafter

2. **Configure Build Settings**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`

3. **Environment Variables**
   Add the following environment variable in Netlify dashboard:
   ```
   REACT_APP_API_URL=https://your-backend-url.herokuapp.com
   ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site

### Manual Deployment

1. **Build the project**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy build folder**
   - Drag and drop the `build` folder to Netlify
   - Or use Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod --dir=build
     ```

## Backend Deployment

### Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   cd backend
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set SUPABASE_URL=your_supabase_url
   heroku config:set SUPABASE_ANON_KEY=your_supabase_key
   heroku config:set AWS_ACCESS_KEY_ID=your_aws_key
   heroku config:set AWS_SECRET_ACCESS_KEY=your_aws_secret
   heroku config:set AWS_REGION=us-east-1
   ```

4. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a your-app-name
   git push heroku main
   ```

### Railway Deployment

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Click "New Project"
   - Connect your GitHub repository

2. **Configure Service**
   - Select the backend directory
   - Railway will auto-detect Node.js

3. **Set Environment Variables**
   Add all required environment variables in Railway dashboard

4. **Deploy**
   - Railway will automatically deploy on git push

### Render Deployment

1. **Create Web Service**
   - Go to [Render](https://render.com)
   - Click "New Web Service"
   - Connect your repository

2. **Configure Service**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**
   Add all required environment variables

4. **Deploy**
   - Click "Create Web Service"

## Database Setup (Supabase)

### Production Database

1. **Create Project**
   - Go to [Supabase](https://supabase.com)
   - Create a new project
   - Choose a region close to your users

2. **Run Setup Script**
   - Go to SQL Editor in Supabase dashboard
   - Copy and run the contents of `database/setup.sql`

3. **Configure Security**
   - Review Row Level Security policies
   - Update policies based on your authentication needs
   - Consider enabling additional security features

4. **Get Credentials**
   - Go to Settings > API
   - Copy Project URL and anon public key
   - Use these in your backend environment variables

## AWS Transcribe Setup

### IAM User Setup

1. **Create IAM User**
   - Go to AWS IAM console
   - Create new user with programmatic access
   - Attach policy: `AmazonTranscribeFullAccess`

2. **Get Credentials**
   - Save Access Key ID and Secret Access Key
   - Use these in your backend environment variables

### Alternative: AWS Cognito

For production, consider using AWS Cognito for temporary credentials:

```javascript
// In your backend
const AWS = require('aws-sdk');

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'your-identity-pool-id',
});
```

## Environment Variables Summary

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.com
```

### Backend (.env)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
PORT=3001
```

## SSL/HTTPS Configuration

### Netlify
- Automatic HTTPS with Let's Encrypt
- Custom domain support
- Automatic certificate renewal

### Backend Platforms
- Heroku: Automatic HTTPS
- Railway: Automatic HTTPS
- Render: Automatic HTTPS

## Monitoring and Logging

### Frontend
- Netlify Analytics for traffic monitoring
- Error tracking with services like Sentry

### Backend
- Platform-specific logging (Heroku logs, Railway logs)
- Application monitoring with services like New Relic
- Database monitoring through Supabase dashboard

## Performance Optimization

### Frontend
- Enable gzip compression (automatic on Netlify)
- Optimize images and assets
- Use React.lazy for code splitting

### Backend
- Enable compression middleware
- Implement caching strategies
- Monitor database query performance

## Security Considerations

1. **Environment Variables**
   - Never commit .env files
   - Use platform-specific secret management
   - Rotate keys regularly

2. **CORS Configuration**
   - Restrict origins in production
   - Update CORS settings in backend

3. **Database Security**
   - Review Supabase RLS policies
   - Enable additional security features
   - Monitor access logs

4. **AWS Security**
   - Use least privilege IAM policies
   - Enable CloudTrail for audit logging
   - Consider using temporary credentials

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check backend CORS configuration
   - Verify frontend API URL

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match exactly

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed

4. **Database Connection**
   - Verify Supabase credentials
   - Check network connectivity
   - Review database logs

### Debugging Tips

1. **Check Logs**
   - Frontend: Browser console
   - Backend: Platform logs
   - Database: Supabase logs

2. **Test Endpoints**
   - Use tools like Postman
   - Check API responses
   - Verify request formats

3. **Monitor Performance**
   - Use browser dev tools
   - Check network requests
   - Monitor response times