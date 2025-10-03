import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const hasAccess = (requiredRoles) => {
  const token = localStorage.getItem('auth_token');
  if (!token) return false;
  if (!requiredRoles || requiredRoles.length === 0) return true;
  const role = localStorage.getItem('auth_role');
  return requiredRoles.includes(role);
};

const ProtectedRoute = ({ children, roles }) => {
  return hasAccess(roles) ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;