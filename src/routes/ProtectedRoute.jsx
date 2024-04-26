import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '/src/contexts/AuthContext'; 

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth(); 

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;