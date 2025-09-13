const puppeteer = require('puppeteer');

async function testAffiliateMode() {
  console.log('🧪 Testing Affiliate Mode Implementation...');
  
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
    
    // Check if business mode switch is visible for admin
    console.log('🔍 Checking business mode switch visibility...');
    
    const businessModeSwitch = await page.$('[title*="Current:"]');
    
    if (businessModeSwitch) {
      console.log('✅ Business mode switch found (admin user)');
      
      // Get current mode
      const currentMode = await page.evaluate(() => {
        const modeElement = document.querySelector('[title*="Current:"]');
        return modeElement ? modeElement.title : 'unknown';
      });
      
      console.log(`📊 Current mode: ${currentMode}`);
      
      // Switch to affiliate mode
      console.log('🔄 Switching to Affiliate mode...');
      await businessModeSwitch.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMode = await page.evaluate(() => {
        const modeElement = document.querySelector('[title*="Current:"]');
        return modeElement ? modeElement.title : 'unknown';
      });
      
      console.log(`📊 New mode: ${newMode}`);
      
      // Check if UI changed for affiliate mode
      console.log('🔍 Checking UI changes for Affiliate mode...');
      
      // Look for "Buy Now" buttons instead of "Add to Cart"
      const buyNowButtons = await page.$$('button:contains("Buy Now")');
      const addToCartButtons = await page.$$('button:contains("Add to Cart")');
      
      console.log(`📊 Buy Now buttons found: ${buyNowButtons.length}`);
      console.log(`📊 Add to Cart buttons found: ${addToCartButtons.length}`);
      
      if (buyNowButtons.length > 0) {
        console.log('✅ SUCCESS: Buy Now buttons found in Affiliate mode');
      } else {
        console.log('❌ ERROR: No Buy Now buttons found in Affiliate mode');
      }
      
      if (addToCartButtons.length === 0) {
        console.log('✅ SUCCESS: Add to Cart buttons hidden in Affiliate mode');
      } else {
        console.log('❌ WARNING: Add to Cart buttons still visible in Affiliate mode');
      }
      
      // Test affiliate link clicks
      if (buyNowButtons.length > 0) {
        console.log('🖱️  Testing affiliate link click...');
        
        // Click first Buy Now button
        await buyNowButtons[0].click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if new tab opened or redirected
        const pages = await browser.pages();
        console.log(`📊 Total pages after click: ${pages.length}`);
        
        if (pages.length > 1) {
          console.log('✅ SUCCESS: New tab opened for affiliate link');
          
          // Close the new tab
          await pages[pages.length - 1].close();
        } else {
          console.log('ℹ️  No new tab opened (might be same-origin link)');
        }
      }
      
      // Switch to E-commerce mode
      console.log('🔄 Switching to E-commerce mode...');
      await businessModeSwitch.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const ecommerceMode = await page.evaluate(() => {
        const modeElement = document.querySelector('[title*="Current:"]');
        return modeElement ? modeElement.title : 'unknown';
      });
      
      console.log(`📊 E-commerce mode: ${ecommerceMode}`);
      
      // Check if UI changed back to E-commerce mode
      const buyNowButtonsEcommerce = await page.$$('button:contains("Buy Now")');
      const addToCartButtonsEcommerce = await page.$$('button:contains("Add to Cart")');
      
      console.log(`📊 Buy Now buttons in E-commerce: ${buyNowButtonsEcommerce.length}`);
      console.log(`📊 Add to Cart buttons in E-commerce: ${addToCartButtonsEcommerce.length}`);
      
      if (addToCartButtonsEcommerce.length > 0) {
        console.log('✅ SUCCESS: Add to Cart buttons visible in E-commerce mode');
      } else {
        console.log('❌ ERROR: No Add to Cart buttons found in E-commerce mode');
      }
      
      // Test cart functionality
      if (addToCartButtonsEcommerce.length > 0) {
        console.log('🛒 Testing Add to Cart functionality...');
        
        // Click first Add to Cart button
        await addToCartButtonsEcommerce[0].click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if cart sidebar opened
        const cartSidebar = await page.$('[data-testid="cart-sidebar"]');
        if (cartSidebar) {
          console.log('✅ SUCCESS: Cart sidebar opened after Add to Cart');
        } else {
          console.log('ℹ️  Cart sidebar not found (might be different implementation)');
        }
      }
      
    } else {
      console.log('ℹ️  Business mode switch not found (non-admin user)');
    }
    
    // Test cart page behavior
    console.log('🛒 Testing cart page behavior...');
    await page.goto('http://localhost:3000/cart', { waitUntil: 'networkidle0' });
    
    // Check if cart page loads
    const cartTitle = await page.$('h1, h2, h3, h4, h5, h6');
    if (cartTitle) {
      const titleText = await page.evaluate(el => el.textContent, cartTitle);
      console.log(`📄 Cart page title: ${titleText}`);
    }
    
    // Check for mode-specific content
    const estimatedTotal = await page.$('text="Estimated Total"');
    const orderSummary = await page.$('text="Order Summary"');
    
    if (estimatedTotal) {
      console.log('✅ SUCCESS: Affiliate mode content found on cart page');
    } else if (orderSummary) {
      console.log('✅ SUCCESS: E-commerce mode content found on cart page');
    } else {
      console.log('ℹ️  Cart page content not clearly identified');
    }
    
    console.log('✅ Affiliate Mode testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testAffiliateMode().catch(console.error);
