import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  Profile, 
  getCurrentProfile, 
  updateProfile, 
  getUserStats
} from '../services/profileService';
import { useAuth } from './AuthContext';

interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  newUsersThisMonth: number;
}

interface ProfileContextType {
  profile: Profile | null;
  userStatistics: UserStatistics | null;
  isLoading: boolean;
  error: string | null;
  loadProfile: () => Promise<void>;
  updateUserProfile: (profileData: Partial<Profile>) => Promise<void>;
  loadUserStatistics: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userStatistics, setUserStatistics] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated || false;
  const currentUser = auth?.user;

  // Load user profile
  const loadProfile = useCallback(async () => {
    if (!isAuthenticated || !currentUser) {
      setProfile(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const userProfile = await getCurrentProfile();
      setProfile(userProfile);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentUser]);

  // Update user profile
  const updateUserProfile = async (profileData: Partial<Profile>) => {
    if (!isAuthenticated || !currentUser) {
      setError('Please login to update profile');
      return;
    }

    try {
      setError(null);
      const updatedProfile = await updateProfile(profileData);
      setProfile(updatedProfile);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  // Load user statistics
  const loadUserStatistics = useCallback(async () => {
    if (!isAuthenticated || !currentUser) {
      setUserStatistics(null);
      return;
    }

    try {
      setError(null);
      const stats = await getUserStats();
      setUserStatistics(stats);
    } catch (err) {
      console.error('Error loading user statistics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user statistics');
    }
  }, [isAuthenticated, currentUser]);

  // Refresh all profile data
  const refreshProfile = async () => {
    await Promise.all([
      loadProfile(),
      loadUserStatistics()
    ]);
  };

  // Load profile when authentication state changes
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadProfile();
      loadUserStatistics();
    } else {
      setProfile(null);
      setUserStatistics(null);
    }
  }, [isAuthenticated, currentUser, loadProfile, loadUserStatistics]);

  const value: ProfileContextType = {
    profile,
    userStatistics,
    isLoading,
    error,
    loadProfile,
    updateUserProfile,
    loadUserStatistics,
    refreshProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
