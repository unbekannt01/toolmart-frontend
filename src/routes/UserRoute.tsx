"use client";

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const UserRoute = () => {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // If logged in and is an ADMIN, redirect to admin panel
  if (role === "ADMIN") {
    return <Navigate to="/admin" />;
  }

  // Otherwise, allow access to the route
  return <Outlet />;
};

export default UserRoute;
