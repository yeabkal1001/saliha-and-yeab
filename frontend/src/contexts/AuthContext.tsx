import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  storeName?: string;
  avatar?: string;
  joinedDate?: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  refreshUser: () => void;
  clearError: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  storeName?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simplified authentication check - NO ASYNC OPERATIONS
  useEffect(() => {
    console.log('🔍 AuthContext: Checking localStorage for existing auth...');
    
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        console.log('✅ AuthContext: Found existing user data:', userData);
        setUser(userData);
      } catch (err) {
        console.error('❌ AuthContext: Failed to parse user data:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      console.log('❌ AuthContext: No existing auth found - continuing without auth');
      setUser(null);
    }
    
    // Set loading to false immediately
    setLoading(false);
  }, []); // Empty dependency array to prevent infinite loops

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.signIn({ email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('authToken', token);
      // Convert backend snake_case to frontend camelCase
      const convertedUser = {
        ...userData,
        storeName: userData.store_name,
        id: userData.id.toString()
      };
      localStorage.setItem('user', JSON.stringify(convertedUser));
      setUser(convertedUser);
      return true;
    } catch (err: unknown) {
      console.error('Login failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.signUp(userData);
      const { token, user: newUser } = response.data;
      
      localStorage.setItem('authToken', token);
      // Convert backend snake_case to frontend camelCase
      const convertedUser = {
        ...newUser,
        storeName: newUser.store_name,
        id: newUser.id.toString()
      };
      localStorage.setItem('user', JSON.stringify(convertedUser));
      setUser(convertedUser);
      return true;
    } catch (err: unknown) {
      console.error('Registration failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setError(null);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      // Note: You'll need to add an update profile endpoint to your API
      // const response = await authAPI.updateProfile(userData);
      // setUser(response.data);
      
      // For now, just update local state
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Profile update failed:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    
    try {
      const response = await authAPI.getCurrentUser();
      const userData = response.data.user;
      const convertedUser = {
        ...userData,
        storeName: userData.store_name,
        id: userData.id.toString()
      };
      setUser(convertedUser);
      localStorage.setItem('user', JSON.stringify(convertedUser));
    } catch (err) {
      console.error('Failed to refresh user:', err);
      // If refresh fails, user might be logged out
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Compute isAuthenticated based on both user and token
  const isAuthenticated = !!user && !!localStorage.getItem('authToken');

  console.log('🔐 AuthContext state:', { 
    user: !!user, 
    token: !!localStorage.getItem('authToken'), 
    isAuthenticated, 
    loading 
  });

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      error,
      login,
      register,
      logout,
      updateProfile,
      refreshUser,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};