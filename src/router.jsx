import React from "react";
import {Routes, Route} from "react-router-dom";
import UserRegister from "./pages/customer/register";
import VendorRegister from "./pages/vendor/vendorregister";
import Login from "./pages/customer/userLogin";
import VendorDashboard from "./pages/vendor/vendorDashboard";
import Unauthorized from "./pages/unauthorized";
import VendorLogin from "./pages/vendor/vendorLogin";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/userRegister" element={<UserRegister />}  />
            <Route path="/login" element={<Login />}  />
            <Route path="/vendorRegister" element={<VendorRegister />}/>
            <Route path="/vendorLogin" element={<VendorLogin />}  />
            <Route path="/vendorDashboard" element={<VendorDashboard />}  />
            <Route path="/unauthorized" element={<Unauthorized />}  />
            
            
        </Routes>




  
// <Router>
// <Header setSearchQuery={setSearchQuery} />
// <Routes>
//   <Route path="/" element={<ProductsDBData searchQuery={searchQuery} />} />
//   <Route path="/cart" element={<Cart />} />  
//   <Route path="/login" element={<Login />} />
//   <Route path="/register" element={<Register />} />
//   <Route path="/unauthorized" element={<Unauthorized />} />

//   {/* Protected Routes for Admin. Admin Panel only available for ADmin */}
//   <Route element={<AuthRoute allowedRoles={['admin']} />}>
//     <Route path="/admin" element={<AdminPanel />} />

//   </Route>

//   {/* Protected Routes for User */}
//   <Route element={<AuthRoute allowedRoles={['user', 'admin']} />}>
//     {/* Wrap Payment Route with Stripe Elements */}
//     <Route
//       path="/payment"
//       element={
//         <Elements stripe={stripePromise}>
//           <Payment />
//         </Elements>
//       }
//     />
//   </Route>
//   <Route path="/order-confirmation" element={<OrderConfirmation />} />
// </Routes>
// </Router>

    )
};
export default AppRoutes;