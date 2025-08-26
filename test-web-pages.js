const puppeteer = require('puppeteer');

async function testWebPages() {
  console.log('🌐 Testing Web Pages...');
  console.log('=======================\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const pages = [
    { name: 'Homepage', url: 'http://localhost:3000' },
    { name: 'Categories', url: 'http://localhost:3000/categories' },
    { name: 'Smartphones Category', url: 'http://localhost:3000/category/smartphones' },
    { name: 'Electronics Category', url: 'http://localhost:3000/category/electronics' },
    { name: 'Admin Dashboard', url: 'http://localhost:3000/admin' },
    { name: 'Admin Categories', url: 'http://localhost:3000/admin/categories' }
  ];
  
  const results = [];
  
  for (const page of pages) {
    try {
      console.log(`🔍 Testing ${page.name}...`);
      const pageInstance = await browser.newPage();
      
      // Set viewport
      await pageInstance.setViewport({ width: 1280, height: 720 });
      
      // Navigate to page
      await pageInstance.goto(page.url, { waitUntil: 'networkidle2', timeout: 10000 });
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check for errors in console
      const consoleErrors = [];
      pageInstance.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // Check for errors in page
      const pageErrors = await pageInstance.evaluate(() => {
        const errors = [];
        if (window.errors) errors.push(...window.errors);
        return errors;
      });
      
      // Get page title
      const title = await pageInstance.title();
      
      // Check if page loaded successfully
      const isLoaded = title !== 'Error' && !title.includes('404');
      
      // Take screenshot for debugging
      await pageInstance.screenshot({ 
        path: `test-${page.name.toLowerCase().replace(/\s+/g, '-')}.png`,
        fullPage: true 
      });
      
      results.push({
        name: page.name,
        url: page.url,
        title: title,
        loaded: isLoaded,
        consoleErrors: consoleErrors,
        pageErrors: pageErrors
      });
      
      console.log(`✅ ${page.name}: ${isLoaded ? 'Loaded' : 'Failed'} - ${title}`);
      
      await pageInstance.close();
      
    } catch (error) {
      console.log(`❌ ${page.name}: Error - ${error.message}`);
      results.push({
        name: page.name,
        url: page.url,
        title: 'Error',
        loaded: false,
        error: error.message
      });
    }
  }
  
  await browser.close();
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const successful = results.filter(r => r.loaded).length;
  const failed = results.filter(r => !r.loaded).length;
  
  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Pages:');
    results.filter(r => !r.loaded).forEach(r => {
      console.log(`   - ${r.name}: ${r.error || 'Failed to load'}`);
    });
  }
  
  // Check for console errors
  const pagesWithErrors = results.filter(r => r.consoleErrors && r.consoleErrors.length > 0);
  if (pagesWithErrors.length > 0) {
    console.log('\n⚠️ Pages with Console Errors:');
    pagesWithErrors.forEach(r => {
      console.log(`   - ${r.name}:`);
      r.consoleErrors.forEach(error => {
        console.log(`     ${error}`);
      });
    });
  }
  
  console.log('\n📸 Screenshots saved for debugging');
  
  return results;
}

// Run the test
testWebPages().catch(console.error);
