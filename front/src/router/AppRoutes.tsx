import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

import Register from '../pages/auth/Register';
import Login from '../pages/auth/Login';
import Login2 from '../pages/auth/Login2';
import Logout from '../pages/auth/Logout';
import Data from '../pages/Data';
import User from '../pages/User';

const Protected: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // console.log('AppRoutes.tsx > Protected > isAuthenticated:', isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
};

const PublicOnly: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // console.log('AppRoutes.tsx > PublicOnly > isAuthenticated:', isAuthenticated);
  return isAuthenticated ? <Navigate to="/auth/login" replace /> : children;
};

export default function AppRoutes() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login2 />} />
        <Route path="/auth/logout" element={<Protected><Logout /></Protected>} />
        <Route path="/data" element={<Protected><Data /></Protected>} />
        <Route path="/user" element={<Protected><User /></Protected>} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </main>
  )
};
