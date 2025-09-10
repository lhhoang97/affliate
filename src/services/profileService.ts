import { supabase } from '../utils/supabaseClient';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  role: 'user' | 'admin' | 'moderator';
  is_active: boolean;
  email_verified: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
}

// Get current user profile
export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error getting current profile:', error);
    return null;
  }
}

// Update user profile
export async function updateProfile(profileData: UpdateProfileData): Promise<Profile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return profile;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// Create user profile (called after signup)
export async function createProfile(userId: string, email: string, fullName?: string): Promise<Profile | null> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        full_name: fullName,
        role: 'user',
        is_active: true,
        email_verified: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }

    return profile;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
}

// Get all profiles (admin only)
export async function getAllProfiles(): Promise<Profile[]> {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }

    return profiles || [];
  } catch (error) {
    console.error('Error getting all profiles:', error);
    throw error;
  }
}

// Update user role (admin only)
export async function updateUserRole(userId: string, role: 'user' | 'admin' | 'moderator'): Promise<Profile | null> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        role: role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }

    return profile;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

// Toggle user active status (admin only)
export async function toggleUserStatus(userId: string): Promise<Profile | null> {
  try {
    // First get current status
    const { data: currentProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', userId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Toggle the status
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        is_active: !currentProfile.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }

    return profile;
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw error;
  }
}

// Delete user profile (admin only)
export async function deleteProfile(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  try {
    const profile = await getCurrentProfile();
    return profile?.role === 'admin' || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Get user statistics
export async function getUserStats(): Promise<{
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  newUsersThisMonth: number;
}> {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('role, is_active, created_at');

    if (error) {
      throw error;
    }

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      totalUsers: profiles?.length || 0,
      activeUsers: profiles?.filter((p: any) => p.is_active).length || 0,
      adminUsers: profiles?.filter((p: any) => p.role === 'admin').length || 0,
      newUsersThisMonth: profiles?.filter((p: any) => 
        new Date(p.created_at) >= thisMonth
      ).length || 0
    };

    return stats;
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
}
