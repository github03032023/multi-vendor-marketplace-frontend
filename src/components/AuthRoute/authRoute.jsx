// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { getUserFromToken } from "../../utils/auth";


// const AuthRoute = ({ allowedRoles }) => {

//     const user = getUserFromToken();
//     if (!user) {
//         // User is not authenticated
//         return <Navigate to="/login" />;
//     }

//     if (!allowedRoles.includes(user.role)) {
//         // User does not have the required role
//         return <Navigate to="/unauthorized" />;
//     }
//     if ((user.role == 'admin') || (user.role == 'customer')) {
//         return (user.role) ? <Outlet /> : <Navigate to="/login" />;
//     } else if (user.role == 'vendor') {
//         return (user.role) ? <Outlet /> : <Navigate to="/VendorLogin" />;
//     }
// };


// export default AuthRoute;












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
