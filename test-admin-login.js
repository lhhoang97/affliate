const puppeteer = require('puppeteer');

async function testAdminLogin() {
  console.log('🧪 Testing Admin Login and Business Mode Switch...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to login page
    console.log('📍 Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    
    // Fill in admin credentials
    console.log('🔑 Logging in as admin...');
    
    // Wait for email input
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    // Fill email
    await page.type('input[type="email"]', 'hoang@shopwithus.com');
    
    // Fill password
    await page.type('input[type="password"]', 'password123');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if logged in
    const isLoggedIn = await page.$('button[aria-label*="account"]') || await page.$('[data-testid="user-avatar"]');
    
    if (isLoggedIn) {
      console.log('✅ SUCCESS: Admin logged in successfully');
      
      // Check if business mode switch is visible
      const businessModeSwitch = await page.$('[title*="Current:"]');
      
      if (businessModeSwitch) {
        console.log('✅ SUCCESS: Business mode switch is visible for admin user');
        
        // Test mode switching
        console.log('🔄 Testing business mode switching...');
        
        // Get current mode
        const currentMode = await page.evaluate(() => {
          const switchElement = document.querySelector('[title*="Current:"]');
          return switchElement ? switchElement.title : 'unknown';
        });
        
        console.log(`📊 Current mode: ${currentMode}`);
        
        // Click to switch mode
        await businessModeSwitch.click();
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
        
        // Test multiple mode switches
        console.log('🔄 Testing multiple mode switches...');
        
        for (let i = 0; i < 3; i++) {
          await businessModeSwitch.click();
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const mode = await page.evaluate(() => {
            const switchElement = document.querySelector('[title*="Current:"]');
            return switchElement ? switchElement.title : 'unknown';
          });
          
          console.log(`📊 Mode after switch ${i + 1}: ${mode}`);
        }
        
      } else {
        console.log('❌ ERROR: Business mode switch not visible for admin user');
      }
      
    } else {
      console.log('❌ ERROR: Admin login failed');
    }
    
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testAdminLogin().catch(console.error);
