import React from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import MainLayout from "../layouts/MainLayout";

const ProtectedRoute = ({ children }) => {
  const { token, authLoading } = useAuth();

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default ProtectedRoute;