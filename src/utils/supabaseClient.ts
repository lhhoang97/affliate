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

// Create Supabase client with better configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

console.log('✅ Supabase client created successfully with enhanced config');
console.log('URL:', supabaseUrl ? 'Set' : 'Not set');
console.log('Key:', supabaseAnonKey ? 'Set' : 'Not set');
