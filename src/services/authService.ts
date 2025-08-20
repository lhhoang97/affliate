import { AuthUser, LoginCredentials, RegisterCredentials } from '../types';

// Mock auth service for development
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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock successful login
  return {
    ...mockUser,
    email: credentials.email,
  };
}

export async function signUpWithSupabase(credentials: RegisterCredentials): Promise<AuthUser> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock successful registration
  return {
    ...mockUser,
    name: credentials.name,
    email: credentials.email,
    isVerified: false,
  };
}

export async function signOutWithSupabase(): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Mock successful logout
  console.log('Mock sign out successful');
}

export async function updateProfileWithSupabase(userId: string, profileData: Partial<AuthUser>): Promise<AuthUser> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock successful profile update
  return {
    ...mockUser,
    ...profileData,
    id: userId,
    updatedAt: new Date().toISOString(),
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Mock returning current user
  return mockUser;
}
