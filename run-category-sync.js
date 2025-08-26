#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Category Synchronization Script');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.error('Please create a .env file with your Supabase credentials:');
  console.error('REACT_APP_SUPABASE_URL=your_supabase_url');
  console.error('REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

// Check if sync-categories.js exists
const syncScriptPath = path.join(__dirname, 'sync-categories.js');
if (!fs.existsSync(syncScriptPath)) {
  console.error('❌ sync-categories.js not found!');
  process.exit(1);
}

console.log('📋 Steps to sync categories:');
console.log('1. First, run the SQL script in your Supabase dashboard');
console.log('2. Then run this script to sync categories\n');

console.log('📝 SQL Script to run in Supabase SQL Editor:');
console.log('---------------------------------------------');
const sqlPath = path.join(__dirname, 'UPDATE_CATEGORIES_SCHEMA.sql');
if (fs.existsSync(sqlPath)) {
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  console.log(sqlContent);
} else {
  console.log('UPDATE_CATEGORIES_SCHEMA.sql not found');
}

console.log('\n🔄 Running category sync...');
console.log('==========================');

try {
  execSync('node sync-categories.js', { stdio: 'inherit' });
  console.log('\n✅ Category synchronization completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Check your Supabase dashboard to verify categories were created');
  console.log('2. Restart your React app to see the changes');
  console.log('3. Visit the admin panel to manage categories');
} catch (error) {
  console.error('\n❌ Error running category sync:', error.message);
  process.exit(1);
}
