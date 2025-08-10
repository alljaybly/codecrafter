# 🔧 Netlify Deployment Troubleshooting

## ✅ Build Issues Fixed

The following build issues have been resolved:

1. **Invalid dependency removed**: `@tailwindcss/postcss` (doesn't exist)
2. **Build command updated**: Added `--legacy-peer-deps` flag
3. **Environment variables**: Added `GENERATE_SOURCEMAP=false` and `DISABLE_ESLINT_PLUGIN=true`
4. **Function dependencies**: Added `package.json` for Netlify functions

## 🚀 Deployment Checklist

### 1. Netlify Build Settings
```
Base directory: frontend
Build command: npm ci --legacy-peer-deps && npm run build
Publish directory: build
Functions directory: netlify/functions
```

### 2. Environment Variables (Required)
Add these in your Netlify dashboard under Site Settings > Environment Variables:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
AWS_ACCESS_KEY_ID=your_aws_access_key_id (optional for transcribe)
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key (optional for transcribe)
AWS_REGION=us-east-1 (optional for transcribe)
```

### 3. Supabase Database Setup
Run this SQL in your Supabase SQL editor:

```sql
-- Create the generated_code table
CREATE TABLE IF NOT EXISTS generated_code (
    id BIGSERIAL PRIMARY KEY,
    idea TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on generated_at for better query performance
CREATE INDEX IF NOT EXISTS idx_generated_code_generated_at ON generated_code(generated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE generated_code ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
CREATE POLICY "Allow all operations on generated_code" ON generated_code
    FOR ALL USING (true);
```

## 🧪 Testing Your Deployment

After deployment, test with:

```bash
node verify-deployment.js https://your-site.netlify.app
```

## 🐛 Common Issues & Solutions

### Build Fails with "non-zero exit code: 2"
- ✅ **Fixed**: Updated build command and environment variables
- Check: Netlify build logs for specific error messages

### Functions Return 500 Error
- **Cause**: Missing environment variables
- **Solution**: Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` in Netlify dashboard

### Database Connection Fails
- **Cause**: Supabase not configured or wrong credentials
- **Solution**: 
  1. Verify Supabase project URL and key
  2. Run the database setup SQL
  3. Check Supabase project is active

### TypeScript Build Errors
- ✅ **Fixed**: Added proper TypeScript configuration
- Check: All imports are correct and types are available

### CSS/Tailwind Not Loading
- ✅ **Fixed**: PostCSS configuration is correct
- Check: `tailwind.config.js` and `postcss.config.js` are present

## 📊 Build Success Indicators

Your build should show:
```
✅ Dependencies installed successfully
✅ TypeScript compilation successful
✅ Tailwind CSS processed
✅ React build completed
✅ Functions deployed
```

## 🔍 Debugging Steps

1. **Check Netlify Build Logs**
   - Go to Netlify dashboard > Deploys
   - Click on failed deploy
   - Review full build log

2. **Test Functions Locally**
   ```bash
   netlify dev
   ```

3. **Check Function Logs**
   - Netlify dashboard > Functions
   - Click on function name
   - View real-time logs

4. **Verify Environment Variables**
   - Site Settings > Environment Variables
   - Ensure all required variables are set

## 🎯 Success Metrics

After successful deployment:
- ✅ Site loads at your Netlify URL
- ✅ Form accepts text input
- ✅ Code generation works (returns React components)
- ✅ Voice input button appears (may need microphone permissions)
- ✅ Generated code is stored in Supabase

## 📞 Need Help?

If issues persist:
1. Check the full build log in Netlify
2. Verify all environment variables are set correctly
3. Test the Supabase connection independently
4. Use the verification script to test specific functionality