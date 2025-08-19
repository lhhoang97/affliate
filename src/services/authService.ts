import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import { AuthUser, LoginCredentials, RegisterCredentials } from '../types';

export async function signInWithSupabase(credentials: LoginCredentials): Promise<AuthUser> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase not configured');
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user data returned');

    // Get user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
    }

    const authUser: AuthUser = {
      id: data.user.id,
      name: profile?.name || data.user.user_metadata?.name || 'User',
      email: data.user.email || '',
      avatar: profile?.avatar || data.user.user_metadata?.avatar,
      isVerified: data.user.email_confirmed_at !== null,
      role: profile?.role || 'user',
      phone: profile?.phone,
      address: profile?.address,
      bio: profile?.bio,
      createdAt: data.user.created_at,
      updatedAt: profile?.updated_at,
    };

    return authUser;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signUpWithSupabase(credentials: RegisterCredentials): Promise<AuthUser> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase not configured');
  }

  try {
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
    if (!data.user) throw new Error('No user data returned');

    // Create profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        name: credentials.name,
        email: credentials.email,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
    }

    const authUser: AuthUser = {
      id: data.user.id,
      name: credentials.name,
      email: credentials.email,
      isVerified: false,
      role: 'user',
      createdAt: data.user.created_at,
    };

    return authUser;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signOutWithSupabase(): Promise<void> {
  if (!isSupabaseConfigured) {
    return;
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function updateProfileWithSupabase(userId: string, profileData: Partial<AuthUser>): Promise<AuthUser> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase not configured');
  }

  try {
    const payload: any = {};
    if (profileData.name !== undefined) payload.name = profileData.name;
    if (profileData.phone !== undefined) payload.phone = profileData.phone;
    if (profileData.address !== undefined) payload.address = profileData.address;
    if (profileData.bio !== undefined) payload.bio = profileData.bio;
    if (profileData.avatar !== undefined) payload.avatar = profileData.avatar;
    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Profile not found');

    const authUser: AuthUser = {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      isVerified: data.is_verified || false,
      role: data.role || 'user',
      phone: data.phone,
      address: data.address,
      bio: data.bio,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return authUser;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
      return null;
    }

    const authUser: AuthUser = {
      id: user.id,
      name: profile?.name || user.user_metadata?.name || 'User',
      email: user.email || '',
      avatar: profile?.avatar || user.user_metadata?.avatar,
      isVerified: user.email_confirmed_at !== null,
      role: profile?.role || 'user',
      phone: profile?.phone,
      address: profile?.address,
      bio: profile?.bio,
      createdAt: user.created_at,
      updatedAt: profile?.updated_at,
    };

    return authUser;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}
