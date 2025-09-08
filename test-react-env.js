// Test React environment variables
console.log('🔍 Testing React environment variables...');

// Check if we're in a React environment
if (typeof process !== 'undefined' && process.env) {
  console.log('✅ Process.env available');
  console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL ? 'Set' : 'Not set');
  console.log('REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
} else {
  console.log('❌ Process.env not available');
}

// Check if we're in browser environment
if (typeof window !== 'undefined') {
  console.log('✅ Window object available (browser environment)');
} else {
  console.log('❌ Window object not available (Node.js environment)');
}
