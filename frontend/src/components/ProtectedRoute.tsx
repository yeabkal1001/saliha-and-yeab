import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};