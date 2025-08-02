import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');

  // Check if both token and user data exist
  if (!token || !userStr) {
    console.log('🔒 ProtectedRoute: No auth found, redirecting to signin');
    return <Navigate to="/signin" replace />;
  }

  // Validate user data
  try {
    const user = JSON.parse(userStr);
    if (!user.id || !user.email) {
      console.log('🔒 ProtectedRoute: Invalid user data, redirecting to signin');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return <Navigate to="/signin" replace />;
    }
  } catch (error) {
    console.log('🔒 ProtectedRoute: Failed to parse user data, redirecting to signin');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return <Navigate to="/signin" replace />;
  }

  console.log('🔒 ProtectedRoute: Auth valid, rendering protected content');
  return <>{children}</>;
};