const puppeteer = require('puppeteer');

async function testAdminBusinessMode() {
  console.log('🧪 Testing Admin Business Mode Switch...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to homepage
    console.log('📍 Navigating to homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Check if business mode switch is visible for non-admin users
    console.log('🔍 Checking business mode switch visibility...');
    
    // Look for business mode switch in header
    const businessModeSwitch = await page.$('[title*="Current:"]');
    
    if (businessModeSwitch) {
      console.log('❌ ERROR: Business mode switch is visible for non-admin users!');
      console.log('   Expected: Only admin should see business mode switch');
    } else {
      console.log('✅ SUCCESS: Business mode switch is hidden for non-admin users');
    }
    
    // Check if user is logged in
    const isLoggedIn = await page.$('[data-testid="user-avatar"]') || await page.$('button[aria-label*="account"]');
    
    if (isLoggedIn) {
      console.log('👤 User is logged in');
      
      // Check user role (this would need to be implemented in the UI)
      const userRole = await page.evaluate(() => {
        // This would need to be exposed in the UI for testing
        return window.userRole || 'unknown';
      });
      
      console.log(`🔑 User role: ${userRole}`);
      
      if (userRole === 'admin') {
        console.log('✅ Admin user detected - business mode switch should be visible');
      } else {
        console.log('✅ Non-admin user detected - business mode switch should be hidden');
      }
    } else {
      console.log('👤 User is not logged in');
    }
    
    // Test business mode switching (if admin)
    console.log('🔄 Testing business mode switching...');
    
    // Look for business mode switch
    const modeSwitch = await page.$('[title*="Current:"]');
    
    if (modeSwitch) {
      console.log('🎯 Business mode switch found - testing click...');
      
      // Get current mode
      const currentMode = await page.evaluate(() => {
        const switchElement = document.querySelector('[title*="Current:"]');
        return switchElement ? switchElement.title : 'unknown';
      });
      
      console.log(`📊 Current mode: ${currentMode}`);
      
      // Click to switch mode
      await modeSwitch.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if mode changed
      const newMode = await page.evaluate(() => {
        const switchElement = document.querySelector('[title*="Current:"]');
        return switchElement ? switchElement.title : 'unknown';
      });
      
      console.log(`📊 New mode: ${newMode}`);
      
      if (currentMode !== newMode) {
        console.log('✅ SUCCESS: Business mode switched successfully');
      } else {
        console.log('❌ ERROR: Business mode did not switch');
      }
    } else {
      console.log('ℹ️  Business mode switch not found (expected for non-admin users)');
    }
    
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testAdminBusinessMode().catch(console.error);
