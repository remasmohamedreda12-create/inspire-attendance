# INSPIRE Attendance System - Deployment Guide

## ✅ Completed Setup
- ✅ Supabase Project Created: `inspire-attendance`
- ✅ Supabase URL: `https://uttvamnwoeechqituaox.supabase.co`
- ✅ API Key Extracted: `sb_publishable_CB-SjkfDKXZt97XJTVvglQ_snJ3d6ME`
- ✅ Environment variables configured in `server/.env`
- ✅ GitHub repository ready: `remasmohamedreda12-create/inspire-attendance`

## 🚀 Final Deployment Steps

### Step 1: Create Database Table in Supabase
1. Go to: https://supabase.com/dashboard/project/uttvamnwoeechqituaox/sql
2. Click "New query"
3. Copy and paste this SQL:
```sql
CREATE TABLE students (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  s1 BOOLEAN DEFAULT false,
  s2 BOOLEAN DEFAULT false,
  s3 BOOLEAN DEFAULT false,
  s4 BOOLEAN DEFAULT false,
  s5 BOOLEAN DEFAULT false,
  s6 BOOLEAN DEFAULT false,
  s7 BOOLEAN DEFAULT false,
  s8 BOOLEAN DEFAULT false,
  t1 TIMESTAMP,
  t2 TIMESTAMP,
  t3 TIMESTAMP,
  t4 TIMESTAMP,
  t5 TIMESTAMP,
  t6 TIMESTAMP,
  t7 TIMESTAMP,
  t8 TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
4. Click "Run" to execute

### Step 2: Deploy to Render
1. Go to: https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Select repository: `remasmohamedreda12-create/inspire-attendance`
4. Configure:
   - **Name**: `inspire-attendance`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables** (Click "Add Environment Variable"):
     - `PORT` = `5000`
     - `NODE_ENV` = `production`
     - `SUPABASE_URL` = `https://uttvamnwoeechqituaox.supabase.co`
     - `SUPABASE_KEY` = `sb_publishable_CB-SjkfDKXZt97XJTVvglQ_snJ3d6ME`
5. Click "Create Web Service"
6. Wait 3-5 minutes for deployment

### Step 3: Access Your Application
Once deployed:
- **Attendance Page**: `https://inspire-attendance.onrender.com/`
- **Dashboard**: `https://inspire-attendance.onrender.com/dashboard`

### Step 4: Test the Application
1. Go to Dashboard → Add Student:
   - ID: `S001`
   - Name: `أحمد محمد`
   - Phone: `01012345678`
   - Click "Add Student"

2. Go to Attendance page:
   - Enter Student ID: `S001`
   - Select Session: `1`
   - Click "تسجيل حضور"
   - You should see "تم تسجيل الحضور بنجاح" (Attendance registered successfully)

## 📋 Current Environment Configuration

**File**: `server/.env`
```
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://uttvamnwoeechqituaox.supabase.co
SUPABASE_KEY=sb_publishable_CB-SjkfDKXZt97XJTVvglQ_snJ3d6ME
```

## 🔗 Project Links
- **Supabase Dashboard**: https://supabase.com/dashboard/project/uttvamnwoeechqituaox
- **GitHub Repository**: https://github.com/remasmohamedreda12-create/inspire-attendance
- **Render Dashboard**: https://dashboard.render.com

## ⚠️ Important Notes
- The API key provided is a public key (safe to use in frontend)
- Row Level Security (RLS) should be configured in Supabase for production use
- The application uses relative paths (`/api/*`) for cross-environment compatibility
- Both HTML files will be served from the Express server on the same domain

## 🆘 Troubleshooting

### If the table doesn't appear:
1. Check Supabase Table Editor at: https://supabase.com/dashboard/project/uttvamnwoeechqituaox/editor
2. Refresh the page
3. Table should appear as "students" in the list

### If deployment fails:
1. Check Render logs: https://dashboard.render.com
2. Verify all environment variables are set correctly
3. Ensure the GitHub repository has the latest code

### If API calls fail:
1. Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
2. Check Supabase database connection in Settings → API
3. Review Supabase API usage in the dashboard
