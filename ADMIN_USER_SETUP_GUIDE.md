# 🔐 Admin User Setup Guide for Web Login

## 📋 Prerequisites
- Access to your Supabase Dashboard
- Your web application deployed and accessible

## 🚀 Step-by-Step Instructions

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `rlgjpejeulxvfatwvniq`

### Step 2: Create Admin User in Authentication
1. In your Supabase Dashboard, go to **Authentication** → **Users**
2. Click **"Add User"** button
3. Fill in the following details:
   - **Email**: `admin@shopwithus.com`
   - **Password**: `Admin123!@#`
   - **Email Confirm**: ✅ Check this box
4. Click **"Create User"**

### Step 3: Get the User ID
1. After creating the user, you'll see the user in the Users list
2. Click on the user to view details
3. Copy the **User ID** (it looks like: `12345678-1234-1234-1234-123456789abc`)

### Step 4: Create Admin Profile in Database
1. Go to **SQL Editor** in your Supabase Dashboard
2. Create a new query and paste this SQL:

```sql
-- Replace 'YOUR_USER_ID_HERE' with the actual User ID from Step 3
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  'YOUR_USER_ID_HERE', -- Replace with actual User ID
  'admin@shopwithus.com',
  'Admin User',
  'admin',
  NOW(),
  NOW()
);
```

3. Click **"Run"** to execute the query

### Step 5: Verify Admin User
1. Run this query to verify the admin user was created:

```sql
SELECT * FROM profiles WHERE email = 'admin@shopwithus.com';
```

2. You should see the user with `role = 'admin'`

### Step 6: Test Web Login
1. Go to your web application (not localhost)
2. Navigate to the login page
3. Use these credentials:
   - **Email**: `admin@shopwithus.com`
   - **Password**: `Admin123!@#`
4. Click **"Login"**

### Step 7: Access Admin Panel
1. After successful login, you should be redirected to the admin panel
2. If not, navigate to `/admin` manually
3. You should see all admin features available

## 🔧 Alternative: Update Existing User to Admin

If you already have a user account and want to make it admin:

```sql
-- Replace with the email of the user you want to make admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## 🛡️ Security Notes

### Password Security
- Change the default password after first login
- Use a strong password with:
  - At least 8 characters
  - Mix of uppercase and lowercase letters
  - Numbers and special characters

### Access Control
- Only share admin credentials with trusted team members
- Consider implementing 2FA for admin accounts
- Regularly review admin user access

## 🚨 Troubleshooting

### Login Issues
1. **"Invalid credentials"**: Double-check email and password
2. **"User not found"**: Verify the user was created in Supabase Auth
3. **"Access denied"**: Check if the profile has `role = 'admin'`

### Database Issues
1. **"Table not found"**: Make sure you've run the `SUPABASE_SETUP.sql` script
2. **"Permission denied"**: Check RLS policies in Supabase

### Web Application Issues
1. **"Cannot connect"**: Verify your web app is deployed and accessible
2. **"Environment variables"**: Check if Supabase URL and keys are correct

## 📞 Support

If you encounter any issues:
1. Check the Supabase Dashboard logs
2. Verify your environment variables
3. Test with a simple login first
4. Contact support if needed

## ✅ Success Checklist

- [ ] Admin user created in Supabase Auth
- [ ] Admin profile created in database
- [ ] User ID matches between Auth and Profile
- [ ] Role set to 'admin' in profile
- [ ] Can login from web application
- [ ] Can access admin panel
- [ ] All admin features working

---

**🎉 Congratulations!** You now have a working admin account that can login from your web application!
