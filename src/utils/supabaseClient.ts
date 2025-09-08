import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

console.log('🔍 Supabase client initialization:');
console.log('REACT_APP_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('REACT_APP_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
console.log('URL value:', supabaseUrl);
console.log('Key length:', supabaseAnonKey.length);

// Create Supabase client
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials missing!');
  console.error('URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('Key:', supabaseAnonKey ? 'Set' : 'Missing');
  throw new Error('Supabase credentials are missing. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Supabase client created successfully');
console.log('URL:', supabaseUrl ? 'Set' : 'Not set');
console.log('Key:', supabaseAnonKey ? 'Set' : 'Not set');
