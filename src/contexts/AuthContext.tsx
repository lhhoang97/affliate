import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthState, AuthUser } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
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
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: AuthUser = {
      id: '1',
      name: 'John Doe',
      email: email,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    
    setState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  };

  const register = async (name: string, email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: AuthUser = {
      id: '1',
      name: name,
      email: email,
      isVerified: false,
      createdAt: new Date().toISOString(),
    };
    
    setState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  };

  const logout = () => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
