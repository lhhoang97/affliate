const puppeteer = require('puppeteer');

async function checkWebErrors() {
  console.log('🔍 Checking Web Errors...');
  console.log('========================\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Listen for console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      url: msg.location()?.url || 'unknown'
    });
  });
  
  // Listen for page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push({
      message: error.message,
      stack: error.stack
    });
  });
  
  // Listen for request failures
  const requestErrors = [];
  page.on('requestfailed', request => {
    requestErrors.push({
      url: request.url(),
      failure: request.failure()?.errorText || 'unknown'
    });
  });
  
  try {
    console.log('🌐 Loading homepage...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle2', 
      timeout: 15000 
    });
    
    console.log('🌐 Loading categories page...');
    await page.goto('http://localhost:3000/categories', { 
      waitUntil: 'networkidle2', 
      timeout: 15000 
    });
    
    console.log('🌐 Loading smartphones category...');
    await page.goto('http://localhost:3000/category/smartphones', { 
      waitUntil: 'networkidle2', 
      timeout: 15000 
    });
    
    // Wait a bit more for any delayed errors
    await new Promise(resolve => setTimeout(resolve, 3000));
    
  } catch (error) {
    console.error('❌ Navigation error:', error.message);
  }
  
  await browser.close();
  
  // Report results
  console.log('\n📊 Error Report:');
  console.log('================');
  
  const errors = consoleMessages.filter(msg => msg.type === 'error');
  const warnings = consoleMessages.filter(msg => msg.type === 'warning');
  
  console.log(`✅ Console Errors: ${errors.length}`);
  console.log(`⚠️ Console Warnings: ${warnings.length}`);
  console.log(`❌ Page Errors: ${pageErrors.length}`);
  console.log(`🌐 Request Failures: ${requestErrors.length}`);
  
  if (errors.length > 0) {
    console.log('\n❌ Console Errors:');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.text}`);
      console.log(`   URL: ${error.url}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️ Console Warnings:');
    warnings.forEach((warning, index) => {
      console.log(`${index + 1}. ${warning.text}`);
      console.log(`   URL: ${warning.url}`);
    });
  }
  
  if (pageErrors.length > 0) {
    console.log('\n❌ Page Errors:');
    pageErrors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.message}`);
    });
  }
  
  if (requestErrors.length > 0) {
    console.log('\n🌐 Request Failures:');
    requestErrors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.url}`);
      console.log(`   Error: ${error.failure}`);
    });
  }
  
  if (errors.length === 0 && pageErrors.length === 0 && requestErrors.length === 0) {
    console.log('\n🎉 No errors found! Web app is running smoothly.');
  } else {
    console.log('\n💡 Some issues were found. Check the details above.');
  }
}

// Run the check
checkWebErrors().catch(console.error);
