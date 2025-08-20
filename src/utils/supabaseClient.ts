import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create real Supabase client if configured, otherwise use mock
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

// Mock client for development when Supabase is not configured
function createMockClient() {
  const mockQueryBuilder = {
    select: (columns?: string) => ({
      data: [],
      error: null,
      single: () => ({ data: null, error: null }),
      eq: (column: string, value: any) => ({
        data: null,
        error: null,
        single: () => ({ data: null, error: null })
      })
    }),
    insert: (data: any) => ({
      data: null,
      error: null,
      select: (columns?: string) => ({
        data: null,
        error: null,
        single: () => ({ data: null, error: null })
      })
    }),
    update: (data: any) => ({
      data: null,
      error: null,
      eq: (column: string, value: any) => ({
        data: null,
        error: null,
        select: (columns?: string) => ({
          data: null,
          error: null,
          single: () => ({ data: null, error: null })
        })
      })
    }),
    delete: () => ({
      data: null,
      error: null,
      eq: (column: string, value: any) => ({
        data: null,
        error: null
      })
    })
  };

  const mockUser = {
    id: 'mock-user-id',
    email: 'mock@example.com',
    user_metadata: {
      name: 'Mock User',
      avatar: null
    },
    email_confirmed_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  const mockProfile = {
    id: 'mock-user-id',
    name: 'Mock User',
    email: 'mock@example.com',
    avatar: null,
    is_verified: false,
    role: 'user',
    phone: null,
    address: null,
    bio: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return {
    auth: {
      signIn: (credentials: any) => Promise.resolve({ 
        data: { user: mockUser, session: null }, 
        error: null 
      }),
      signUp: (credentials: any) => Promise.resolve({ 
        data: { user: mockUser, session: null }, 
        error: null 
      }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: mockUser }, error: null })
    },
    from: (table: string) => {
      if (table === 'profiles') {
        return {
          ...mockQueryBuilder,
          select: (columns?: string) => ({
            data: [mockProfile],
            error: null,
            single: () => ({ data: mockProfile, error: null }),
            eq: (column: string, value: any) => ({
              data: [mockProfile],
              error: null,
              single: () => ({ data: mockProfile, error: null })
            })
          })
        };
      }
      return mockQueryBuilder;
    }
  };
}
