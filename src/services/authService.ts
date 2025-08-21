import { AuthUser, LoginCredentials, RegisterCredentials } from '../types';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

// Mock auth service for development when Supabase is not configured
const mockUser: AuthUser = {
  id: 'mock-user-id',
  name: 'Mock User',
  email: 'mock@example.com',
  avatar: undefined,
  isVerified: true,
  role: 'user',
  phone: undefined,
  address: undefined,
  bio: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function signInWithSupabase(credentials: LoginCredentials): Promise<AuthUser> {
  if (!isSupabaseConfigured) {
    // Fallback to mock authentication
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock admin user for testing
    if (credentials.email === 'admin@shopwithus.com' && credentials.password === 'admin123456') {
      return {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@shopwithus.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50',
        isVerified: true,
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    // Mock hoang admin user for testing
    if (credentials.email === 'hoang@shopwithus.com' && credentials.password === 'hoang123@') {
      return {
        id: '36e2c0ba-9d84-4834-a03a-facea24aa45a',
        name: 'Hoang Admin',
        email: 'hoang@shopwithus.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50',
        isVerified: true,
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    // Mock regular user
    if (credentials.email === 'user@example.com' && credentials.password === 'user123') {
      return {
        id: 'user-1',
        name: 'Regular User',
        email: 'user@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50',
        isVerified: true,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    throw new Error('Invalid email or password');
  }

  try {
    // Use real Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Login failed');

    // Get user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      id: data.user.id,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      isVerified: profile.is_verified,
      role: profile.role,
      phone: profile.phone,
      address: profile.address,
      bio: profile.bio,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  } catch (error) {
    console.error('Supabase sign in error:', error);
    throw new Error(error instanceof Error ? error.message : 'Login failed');
  }
}

export async function signUpWithSupabase(credentials: RegisterCredentials): Promise<AuthUser> {
  if (!isSupabaseConfigured) {
    // Fallback to mock registration
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    return {
      id: `user-${Date.now()}`,
      name: credentials.name,
      email: credentials.email,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50',
      isVerified: false,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    // Use real Supabase registration
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Registration failed');

    // Create profile in profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        name: credentials.name,
        email: credentials.email,
        role: 'user',
        is_verified: false,
      })
      .select()
      .single();

    if (profileError) throw profileError;

    return {
      id: data.user.id,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      isVerified: profile.is_verified,
      role: profile.role,
      phone: profile.phone,
      address: profile.address,
      bio: profile.bio,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  } catch (error) {
    console.error('Supabase sign up error:', error);
    throw new Error(error instanceof Error ? error.message : 'Registration failed');
  }
}

export async function signOutWithSupabase(): Promise<void> {
  if (!isSupabaseConfigured) {
    // Fallback to mock logout
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('Mock sign out successful');
    return;
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Supabase sign out error:', error);
    throw error;
  }
}

export async function updateProfileWithSupabase(userId: string, profileData: Partial<AuthUser>): Promise<AuthUser> {
  if (!isSupabaseConfigured) {
    // Fallback to mock profile update
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      ...mockUser,
      ...profileData,
      id: userId,
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: profileData.name,
        avatar: profileData.avatar,
        phone: profileData.phone,
        address: profileData.address,
        bio: profileData.bio,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      isVerified: data.is_verified,
      role: data.role,
      phone: data.phone,
      address: data.address,
      bio: data.bio,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Supabase profile update error:', error);
    throw new Error(error instanceof Error ? error.message : 'Profile update failed');
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured) {
    // Fallback to mock current user
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockUser;
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) return null;

    // Get user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) return null;

    return {
      id: user.id,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      isVerified: profile.is_verified,
      role: profile.role,
      phone: profile.phone,
      address: profile.address,
      bio: profile.bio,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  } catch (error) {
    console.error('Supabase get current user error:', error);
    return null;
  }
}
