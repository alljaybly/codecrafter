# 🗄️ Supabase Database Setup Guide for CodeCrafter

## Step 1: Create Supabase Account & Project

### 1.1 Sign Up for Supabase
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub, Google, or email
4. Verify your email if required

### 1.2 Create New Project
1. Click "New Project" in your dashboard
2. Choose your organization (or create one)
3. Fill in project details:
   - **Project Name**: `codecrafter` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., US East, Europe West)
4. Click "Create new project"
5. Wait 2-3 minutes for project initialization

## Step 2: Get Your Project Credentials

### 2.1 Find Your Project URL and Keys
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this secret!)

### 2.2 Update Your Environment Variables
Update your `.env` file with real Supabase credentials:
```bash
# Replace these with your actual Supabase values
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key_here
```

## Step 3: Set Up Database Schema

### 3.1 Access SQL Editor
1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query" to create a new SQL script

### 3.2 Run Database Setup Scripts

#### Option A: Use the Clean SQL File
1. Open the file `database/supabase-complete-setup.sql` in your project
2. Copy the entire contents of that file
3. Paste it into the Supabase SQL Editor

#### Option B: Copy from Here (Clean Version)
If you prefer to copy directly, here's the clean SQL without markdown:

### 3.3 Execute the Script
1. Paste the entire script into the SQL Editor
2. Click "Run" button
3. You should see success messages and counts
4. Verify tables were created in the **Table Editor**

## Step 4: Verify Database Setup

### 4.1 Check Tables
Go to **Table Editor** and verify these tables exist:
- ✅ `ideas` - Stores generated code projects
- ✅ `badges` - Tracks earned user badges  
- ✅ `badge_library` - Master list of all available badges

### 4.2 Check Initial Data
1. Click on `badge_library` table
2. You should see 8 badges loaded
3. Click on `badges` table  
4. You should see 2 starter badges already earned

### 4.3 Test Database Connection
Run this test query in SQL Editor:
```sql
SELECT 
  (SELECT COUNT(*) FROM ideas) as ideas_count,
  (SELECT COUNT(*) FROM badges) as badges_count,
  (SELECT COUNT(*) FROM badge_library) as library_count;
```

## Step 5: Configure Authentication (Optional)

### 5.1 Enable Authentication
1. Go to **Authentication** → **Settings**
2. Enable desired providers (Email, Google, GitHub, etc.)
3. Configure redirect URLs if needed

### 5.2 Update RLS Policies (If Using Auth)
If you want user-specific data, update the RLS policies:
```sql
-- Example: User-specific ideas
DROP POLICY IF EXISTS "Allow public read access on ideas" ON ideas;
CREATE POLICY "Users can view own ideas" ON ideas 
  FOR SELECT USING (auth.uid()::text = user_id);
```

## Step 6: Update Your Application

### 6.1 Update Environment Variables
Update your `.env` file with the real values:
```bash
SUPABASE_URL=https://your-actual-project-id.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key_here
```

### 6.2 Test Connection
Your Netlify functions should now connect to the real database!

## Step 7: Monitor and Maintain

### 7.1 Monitor Usage
- Check **Database** → **Usage** for storage and bandwidth
- Monitor **Logs** for any errors

### 7.2 Backup Strategy
- Supabase automatically backs up your database
- For critical data, consider additional backups

## 🎉 You're Done!

Your Supabase database is now fully configured and ready for CodeCrafter!

### Next Steps:
1. Deploy your application to Netlify
2. Test the live application
3. Monitor database performance
4. Add more badges as needed

### Troubleshooting:
- If functions can't connect, double-check your environment variables
- If RLS blocks access, review your policies
- Check Supabase logs for detailed error messages