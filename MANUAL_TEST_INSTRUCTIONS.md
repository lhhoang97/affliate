# Manual Test Instructions - Admin Business Mode Switch

## 🎯 Test Objective
Verify that business mode switch is only visible to admin users and functions correctly.

## 📋 Test Steps

### 1. Test Non-Admin User (Expected: No Business Mode Switch)
1. Open browser and go to `http://localhost:3000`
2. **Do NOT log in** (or log in with a non-admin user)
3. Check the header area
4. **Expected Result**: No business mode switch should be visible
5. **Expected Result**: Only search bar, cart, and user icons should be visible

### 2. Test Admin User (Expected: Business Mode Switch Visible)
1. Go to `http://localhost:3000/login`
2. Log in with admin credentials:
   - Email: `hoang@shopwithus.com`
   - Password: `password123`
3. After successful login, check the header area
4. **Expected Result**: Business mode switch should be visible (showing current mode)
5. **Expected Result**: Switch should be clickable and cycle through modes

### 3. Test Mode Switching
1. While logged in as admin, click the business mode switch
2. **Expected Result**: Mode should cycle: Affiliate → E-commerce → Hybrid → Affiliate
3. **Expected Result**: UI should update smoothly with transitions
4. **Expected Result**: Cart page should show different text based on mode

### 4. Test Mobile View
1. Open browser developer tools (F12)
2. Switch to mobile view (responsive design)
3. Click the hamburger menu (☰)
4. **Expected Result**: Business mode switch should be visible in mobile drawer
5. **Expected Result**: Should be able to switch modes from mobile drawer

## 🔍 What to Look For

### ✅ Success Indicators
- Business mode switch only visible to admin users
- Smooth transitions when switching modes
- UI updates correctly based on selected mode
- Mobile drawer shows business mode switch for admin
- Non-admin users see clean header without business mode switch

### ❌ Failure Indicators
- Business mode switch visible to non-admin users
- No smooth transitions when switching modes
- UI doesn't update when switching modes
- Mobile drawer doesn't show business mode switch for admin
- Errors in browser console

## 🐛 Troubleshooting

### If Business Mode Switch Not Visible for Admin
1. Check if user role is correctly set to 'admin' in database
2. Check browser console for errors
3. Verify user is properly logged in
4. Check if Header.tsx has correct role check: `user?.role === 'admin'`

### If Business Mode Switch Visible for Non-Admin
1. Check if role check is working: `user?.role === 'admin'`
2. Verify user object structure
3. Check if role field is properly populated

### If Mode Switching Not Working
1. Check browser console for errors
2. Verify BusinessModeContext is working
3. Check if setMode function is properly called
4. Verify localStorage is working

## 📊 Expected Behavior by Mode

### Affiliate Mode
- Cart shows "Buy Now" buttons
- Checkout redirects to affiliate links
- Shows "Estimated Total" instead of detailed pricing

### E-commerce Mode
- Cart shows "Add to Cart" buttons
- Checkout goes to payment page
- Shows detailed pricing (Subtotal, Shipping, Tax, Total)

### Hybrid Mode
- Combines both affiliate and e-commerce features
- Shows both "Buy Now" and "Add to Cart" options
- Flexible checkout options

## 🎉 Test Completion
Once all tests pass, the business mode switch is working correctly and only visible to admin users as intended.
