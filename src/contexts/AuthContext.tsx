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
        if (isSupabaseConfigured) {
          // Try to get current user from Supabase
          const currentUser = await getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          }
        } else {
          // Fallback to localStorage for mock auth
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser);
              setUser(parsedUser);
              setIsAuthenticated(true);
            } catch (e) {
              localStorage.removeItem('user');
            }
          }
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
      if (isSupabaseConfigured) {
        // Use Supabase authentication
        const authUser = await signInWithSupabase(credentials);
        setUser(authUser);
        setIsAuthenticated(true);
      } else {
        // Fallback to mock authentication
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock admin user for testing
        if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
          const adminUser: AuthUser = {
            id: 'admin-1',
            name: 'Admin User',
            email: 'admin@example.com',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50',
            isVerified: true,
            role: 'admin',
            createdAt: new Date().toISOString(),
          };
          
          setUser(adminUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(adminUser));
          return;
        }
        
        // Mock regular user
        if (credentials.email === 'user@example.com' && credentials.password === 'user123') {
          const regularUser: AuthUser = {
            id: 'user-1',
            name: 'Regular User',
            email: 'user@example.com',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50',
            isVerified: true,
            role: 'user',
            createdAt: new Date().toISOString(),
          };
          
          setUser(regularUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(regularUser));
          return;
        }
        
        throw new Error('Invalid email or password');
      }
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
      if (isSupabaseConfigured) {
        // Use Supabase registration
        const authUser = await signUpWithSupabase(credentials);
        setUser(authUser);
        setIsAuthenticated(true);
      } else {
        // Fallback to mock registration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (credentials.password !== credentials.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        const newUser: AuthUser = {
          id: `user-${Date.now()}`,
          name: credentials.name,
          email: credentials.email,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50',
          isVerified: false,
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(newUser));
      }
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
      if (isSupabaseConfigured && user) {
        // Use Supabase profile update
        const updatedUser = await updateProfileWithSupabase(user.id, profileData);
        setUser(updatedUser);
      } else {
        // Fallback to mock profile update
        await new Promise(resolve => setTimeout(resolve, 1000));

        const updatedUser = { ...user, ...profileData } as AuthUser;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
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
