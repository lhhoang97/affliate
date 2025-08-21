import { AuthUser, LoginCredentials, RegisterCredentials } from '../types';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';



export async function signInWithSupabase(credentials: LoginCredentials): Promise<AuthUser> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please check your environment variables.');
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
    throw new Error('Supabase is not configured. Please check your environment variables.');
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
    throw new Error('Supabase is not configured. Please check your environment variables.');
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
    throw new Error('Supabase is not configured. Please check your environment variables.');
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
    throw new Error('Supabase is not configured. Please check your environment variables.');
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
