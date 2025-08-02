import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  store_name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, store_name?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Verify token with backend
          const response = await api.get('/api/v1/auth/me');
          if (response.data.user) {
            setUser(response.data.user);
          } else {
            // Invalid token, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        // Token is invalid or expired, clear storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.post('/api/v1/auth/signin', { email, password });
      
      const { token, user: userData } = response.data;
      
      // Store token securely
      localStorage.setItem('authToken', token);
      
      // Update API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user data (without sensitive information)
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        store_name: userData.store_name
      });
      
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Login failed:', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, store_name?: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.post('/api/v1/auth/signup', { 
        name, 
        email, 
        password, 
        store_name 
      });
      
      const { token, user: userData } = response.data;
      
      // Store token securely
      localStorage.setItem('authToken', token);
      
      // Update API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user data
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        store_name: userData.store_name
      });
      
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Registration failed:', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Remove API authorization header
    delete api.defaults.headers.common['Authorization'];
    
    // Clear user state
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.put('/api/v1/auth/profile', data);
      
      // Update user state with new data
      setUser(prev => prev ? { ...prev, ...response.data.user } : null);
      
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Profile update failed:', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};