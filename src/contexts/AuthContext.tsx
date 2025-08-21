import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, LoginCredentials, RegisterCredentials, AuthState } from '../types';
import { 
  signInWithSupabase, 
  signUpWithSupabase, 
  signOutWithSupabase, 
  updateProfileWithSupabase,
  getCurrentUser 
} from '../services/authService';
import { isSupabaseConfigured } from '../utils/supabaseClient';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!isSupabaseConfigured) {
          throw new Error('Supabase is not configured. Please check your environment variables.');
        }
        
        // Try to get current user from Supabase
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }
      
      // Use Supabase authentication
      const authUser = await signInWithSupabase(credentials);
      setUser(authUser);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }
      
      // Use Supabase registration
      const authUser = await signUpWithSupabase(credentials);
      setUser(authUser);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await signOutWithSupabase();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      localStorage.removeItem('user');
    }
  };

  const updateProfile = async (profileData: Partial<AuthUser>) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      // Use Supabase profile update
      const updatedUser = await updateProfileWithSupabase(user.id, profileData);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
