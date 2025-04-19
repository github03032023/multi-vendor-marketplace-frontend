import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserFromToken } from "../../utils/auth";

const AuthRoute = ({ allowedRoles }) => {
  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  // Authenticated and role is allowed
  return <Outlet />;
};

export default AuthRoute;
