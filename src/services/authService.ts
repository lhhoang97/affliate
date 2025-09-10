import { AuthUser, LoginCredentials, RegisterCredentials } from '../types';
import { supabase } from '../utils/supabaseClient';



export async function signInWithSupabase(credentials: LoginCredentials): Promise<AuthUser> {

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

  try {
    // Use real Supabase registration
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
        },
        emailRedirectTo: undefined, // Disable email confirmation for affiliate model
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Registration failed');

    // Profile will be created automatically by database trigger
    console.log('User registered successfully, profile will be created by trigger');
    
    // Wait a moment for trigger to create profile
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Try to fetch the profile created by trigger
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.log('Profile not created by trigger yet, will be created on first login');
      // Return basic user info - profile will be created when they first login
      return {
        id: data.user.id,
        name: credentials.name,
        email: credentials.email,
        avatar: undefined,
        isVerified: false,
        role: 'user',
        phone: undefined,
        address: undefined,
        bio: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    // Return the profile created by trigger
    return {
      id: profile.id,
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

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Supabase sign out error:', error);
    throw error;
  }
}

export async function updateProfileWithSupabase(userId: string, profileData: Partial<AuthUser>): Promise<AuthUser> {

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
  console.log('getCurrentUser - Starting...');
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('getCurrentUser - Supabase auth result:', { user: user?.email, error });
    
    if (error || !user) {
      console.log('getCurrentUser - No user or error, returning null');
      return null;
    }

    // Try to get user profile from profiles table
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.log('getCurrentUser - Profile not found, using basic user info');
        // Return basic user info if profile doesn't exist
        return {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar: user.user_metadata?.avatar_url || undefined,
          isVerified: user.email_confirmed_at ? true : false,
          role: 'user',
          phone: user.user_metadata?.phone || undefined,
          address: user.user_metadata?.address || undefined,
          bio: user.user_metadata?.bio || undefined,
          createdAt: user.created_at || new Date().toISOString(),
          updatedAt: user.updated_at || new Date().toISOString(),
        };
      }

      // Return profile data
      return {
        id: profile.id,
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
    } catch (profileError) {
      console.log('getCurrentUser - Profile fetch error, using basic user info:', profileError);
      // Fallback to basic user info
      return {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: user.user_metadata?.avatar_url || undefined,
        isVerified: user.email_confirmed_at ? true : false,
        role: 'user',
        phone: user.user_metadata?.phone || undefined,
        address: user.user_metadata?.address || undefined,
        bio: user.user_metadata?.bio || undefined,
        createdAt: user.created_at || new Date().toISOString(),
        updatedAt: user.updated_at || new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error('Supabase get current user error:', error);
    return null;
  }
}
