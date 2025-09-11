const fs = require('fs');
const path = require('path');

const filesToCleanup = [
  'test-bundle-deals.js',
  'setup-bundle-deals.js',
  'test-supabase-connection.js',
  'simple-bundle-setup.js',
  'final-bundle-test.js',
  'cleanup-test-files.js'
];

console.log('🧹 Cleaning up test files...\n');

filesToCleanup.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`✅ Removed ${file}`);
    } else {
      console.log(`⚠️  ${file} not found`);
    }
  } catch (error) {
    console.error(`❌ Error removing ${file}:`, error.message);
  }
});

console.log('\n🎉 Cleanup completed!');
console.log('\n📁 Remaining files:');
console.log('- CREATE_BUNDLE_DEALS_TABLE.sql (SQL setup)');
console.log('- QUICK_BUNDLE_SETUP.md (Setup guide)');
console.log('- BUNDLE_DEALS_SETUP_GUIDE.md (Detailed guide)');
console.log('- src/pages/AdminBundleDealsPage.tsx (Admin interface)');
console.log('- src/types/bundleDeal.ts (Type definitions)');
console.log('- src/services/cartService.ts (Updated with bundle logic)');
console.log('- src/contexts/SimpleCartContext.tsx (Updated context)');
console.log('- src/components/SimpleCartSidebar.tsx (Updated UI)');
