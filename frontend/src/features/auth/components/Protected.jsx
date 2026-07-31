import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import LoadingScreen from "../pages/LoadingScreen"; // Update the path if needed

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;