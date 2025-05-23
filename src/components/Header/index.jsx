// import React, { useContext, useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { ShoppingCart, Store } from "lucide-react";
// import { UserContext } from '../../context/userContext';
// import { loadCart } from '../../api/cartActions';
// import { clearCart } from '../../slices/cartSlice';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import './header.css'; // custom styles

// const Header = () => {
//   const cartCount = useSelector((state) => state.cart.totalQuantity);
//   const { userName, role, logout } = useContext(UserContext);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (userName && token) {
//       dispatch(loadCart());
//     }
//   }, [userName, dispatch]);

//   const handleLogout = () => {
//     logout();
//     dispatch(clearCart());
//     sessionStorage.removeItem('hasShownNotificationAlert');
//     if(role === "customer" || role === "admin"){
//       navigate('/login');
//     }else {
//       navigate('/vendorLogin');
//     }
    
//   };

//   return (
//     <header className="header-bg sticky-top shadow-sm">
//       <nav className="navbar navbar-expand-lg container-fluid py-2">
//         <div className="container-fluid">
//           <Link to="/" className="navbar-brand d-flex align-items-center">
//             <Store className="me-2 text-white" size={24} />
//             <span className="brand-text">SmartBuy</span>
//           </Link>

//           <div className="d-flex align-items-center">
//             {/* <Link to="/" className="btn btn-outline-secondary btn-sm me-3">Home</Link> */}
//             <Link to="/" className="custom-link me-3">Home</Link>
//             {userName && (
//               <span className="badge bg-light text-dark px-3 py-2 rounded-pill me-3">
//                 Logged in as <strong>{userName}</strong>
//               </span>
//             )}
//           </div>

//           <button
//             className="navbar-toggler"
//             type="button"
//             onClick={() => setIsCollapsed(prev => !prev)}
//           >
//             <span className="navbar-toggler-icon" />
//           </button>

//           <div className={`collapse navbar-collapse ${isCollapsed ? 'show' : ''}`}>
//             <ul className="navbar-nav ms-auto align-items-center gap-3 flex-wrap">

//               {userName && role === "customer" && (
//                 <li className="nav-item position-relative">
//                    <Link to="/cart" className="custom-link position-relative">
//                   {/* <Link to="/cart" className="btn btn-outline-light btn-sm rounded-pill shadow-sm position-relative"> */}
//                     <ShoppingCart className="me-1" size={16} />
//                     Cart
//                     {cartCount > 0 && (
//                       <span className="custom-badge">{cartCount}</span>
//                     )}
//                   </Link>
//                 </li>
//               )}

//               {userName ? (
//                 <>
//                   {role === "customer" && (
//                     <>
//                       <li className="nav-item">
//                         {/* <Link to="/customerDashboard" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">My Orders</Link> */}
//                         <Link to="/customerDashboard" className="custom-link">My Orders</Link>
//                       </li>
//                       <li className="nav-item">
//                         {/* <Link to="/customerWishlist" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">My Wishlist</Link> */}
//                         <Link to="/customerWishlist" className="custom-link">My Wishlist</Link>
//                       </li>
//                       <li className="nav-item">
//                         <Link to="/customerProfileUpdate" className="custom-link">My Profile</Link>
//                       </li>
//                     </>
//                   )}

//                   {role === "vendor" && (
//                     <>
//                       <li className="nav-item">
//                       <Link to="/vendorDashboard" className="custom-link">Dashboard</Link>
//                         {/* <Link to="/vendorDashboard" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Dashboard</Link> */}
//                       </li>
//                       <li className="nav-item">
//                       <Link to="/vendorProductManagement" className="custom-link">Manage Products</Link>
//                         {/* <Link to="/vendorProductManagement" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Manage Products</Link> */}
//                       </li>
//                       <li className="nav-item">
//                       <Link to="/vendorPayoutRequest" className="custom-link">Request Payouts</Link>
//                         {/* <Link to="/vendorPayoutRequest" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Request Payouts</Link> */}
//                       </li>
//                     </>
//                   )}

//                   {role === "admin" && (
//                     <>
//                       <li className="nav-item">
//                       <Link to="/adminDashboard" className="custom-link">Dashboard</Link>
//                         {/* <Link to="/adminDashboard" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Dashboard</Link> */}
//                       </li>
//                       <li className="nav-item">
//                       <Link to="/adminUserManagementDashboard" className="custom-link">Manage Users</Link>
//                         {/* <Link to="/adminUserManagementDashboard" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Manage Users</Link> */}
//                       </li>
//                       <li className="nav-item">
//                         <Link to="/approveVendorPayout" className="custom-link">Approve Payouts</Link>
//                         {/* <Link to="/approveVendorPayout" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Approve Payouts</Link> */}
//                       </li>
//                       <li className="nav-item">
//                       <Link to="/adminHomePageSection" className="custom-link">Homepage Sections</Link>
//                         {/* <Link to="/adminHomePageSection" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Homepage Sections</Link> */}
//                       </li>
//                       <li className="nav-item">
//                       <Link to="/adminHomePageBanner" className="custom-link">Homepage Banners</Link>
//                         {/* <Link to="/adminHomePageBanner" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Homepage Banners</Link> */}
//                       </li>
//                       <li className="nav-item">
//                       <Link to="/adminCommissionForm" className="custom-link">Commission Settings</Link>
//                         {/* <Link to="/adminCommissionForm" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Commission Settings</Link> */}
//                       </li>
//                     </>
//                   )}

//                   <li className="nav-item">
//                     <button onClick={handleLogout} className="btn btn-danger btn-sm rounded-pill shadow-sm">Logout</button>
//                   </li>
//                 </>
//               ) : (
//                 <>
//                   <li className="nav-item">
//                   <Link to="/login" className="custom-link">Login</Link>
//                     {/* <Link to="/login" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Login</Link> */}
//                   </li>
//                   <li className="nav-item">
//                   <Link to="/userRegister" className="custom-link">Register</Link>
//                     {/* <Link to="/userRegister" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Register</Link> */}
//                   </li>
//                   <li className="nav-item">
//                   <Link to="/vendorRegister" className="custom-link bg-success text-white">Become a Seller</Link>
//                     {/* <Link to="/vendorRegister" className="btn btn-success btn-sm rounded-pill shadow-sm text-white">Become a Seller</Link> */}
//                   </li>
//                 </>
//               )}
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;

// import React, { useContext, useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { ShoppingCart, Store } from "lucide-react";
// import { UserContext } from '../../context/userContext';
// import { loadCart } from '../../api/cartActions';
// import { clearCart } from '../../slices/cartSlice';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import './header.css'; // custom styles

// const Header = () => {
//   const cartCount = useSelector((state) => state.cart.totalQuantity);
//   const { userName, role, logout } = useContext(UserContext);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (userName && token) {
//       dispatch(loadCart());
//     }
//   }, [userName, dispatch]);

//   const handleLogout = () => {
//     logout();
//     dispatch(clearCart());
//     sessionStorage.removeItem('hasShownNotificationAlert');
//     if(role === "customer" || role === "admin"){
//       navigate('/login');
//     }else {
//       navigate('/vendorLogin');
//     }
    
//   };

//   return (
//     <header className="header-bg sticky-top shadow-sm">
//       <nav className="navbar navbar-expand-lg container-fluid py-2">
//         <div className="container-fluid">
//           <Link to="/" className="navbar-brand d-flex align-items-center">
//             <Store className="me-2 text-white" size={24} />
//             <span className="brand-text">SmartBuy</span>
//           </Link>

//           <div className="d-flex align-items-center">
//             {/* <Link to="/" className="btn btn-outline-secondary btn-sm me-3">Home</Link> */}
//             <Link to="/" className="custom-link ms-5 me-5">Home</Link>
//             {userName && (
//               <span className="badge bg-light text-dark px-3 py-2 rounded-pill me-3">
//                 Logged in as <strong>{userName}</strong>
//               </span>
//             )}
//           </div>

//           <button
//             className="navbar-toggler"
//             type="button"
//             onClick={() => setIsCollapsed(prev => !prev)}
//           >
//             <span className="navbar-toggler-icon" />
//           </button>

//           <div className={`collapse navbar-collapse ${isCollapsed ? 'show' : ''}`}>
//             <ul className="navbar-nav mx-auto align-items-center gap-3 flex-wrap">

//               {userName && role === "customer" && (
//                 <li className="nav-item px-3">
//                    <Link to="/cart" className="custom-link position-relative">
//                   {/* <Link to="/cart" className="btn btn-outline-light btn-sm rounded-pill shadow-sm position-relative"> */}
//                     <ShoppingCart className="me-1" size={16} />
//                     Cart
//                     {cartCount > 0 && (
//                       <span className="custom-badge">{cartCount}</span>
//                     )}
//                   </Link>
//                 </li>
//               )}

//               {userName ? (
//                 <>
//                   {role === "customer" && (
//                     <>
//                       <li className="nav-item px-3">
//                         {/* <Link to="/customerDashboard" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">My Orders</Link> */}
//                         <Link to="/customerDashboard" className="custom-link">My Orders</Link>
//                       </li>
//                       <li className="nav-item px-3">
//                         {/* <Link to="/customerWishlist" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">My Wishlist</Link> */}
//                         <Link to="/customerWishlist" className="custom-link">My Wishlist</Link>
//                       </li>
//                       <li className="nav-item px-3">
//                         <Link to="/customerProfileUpdate" className="custom-link">My Profile</Link>
//                       </li>
//                     </>
//                   )}

//                   {role === "vendor" && (
//                     <>
//                       <li className="nav-item">
//                       <Link to="/vendorDashboard" className="custom-link">Dashboard</Link>
//                         {/* <Link to="/vendorDashboard" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Dashboard</Link> */}
//                       </li>
//                       <li className="nav-item">
//                       <Link to="/vendorProductManagement" className="custom-link">Manage Products</Link>
//                         {/* <Link to="/vendorProductManagement" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Manage Products</Link> */}
//                       </li>
//                       <li className="nav-item">
//                       <Link to="/vendorPayoutRequest" className="custom-link">Request Payouts</Link>
//                         {/* <Link to="/vendorPayoutRequest" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Request Payouts</Link> */}
//                       </li>
//                     </>
//                   )}

//                   {role === "admin" && (
//                     <>
//                       <li className="nav-item">
//                       <Link to="/adminDashboard" className="custom-link">Dashboard</Link>
//                         {/* <Link to="/adminDashboard" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Dashboard</Link> */}
//                       </li>
//                       <li className="nav-item">
//                       <Link to="/adminUserManagementDashboard" className="custom-link">Manage Users</Link>
//                         {/* <Link to="/adminUserManagementDashboard" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Manage Users</Link> */}
//                       </li>
//                       <li className="nav-item">
//                         <Link to="/approveVendorPayout" className="custom-link">Approve Payouts</Link>
//                         {/* <Link to="/approveVendorPayout" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Approve Payouts</Link> */}
//                       </li>
//                       <li className="nav-item">
//                       <Link to="/adminHomePageSection" className="custom-link">Homepage Sections</Link>
//                         {/* <Link to="/adminHomePageSection" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Homepage Sections</Link> */}
//                       </li>
//                       <li className="nav-item">
//                       <Link to="/adminHomePageBanner" className="custom-link">Homepage Banners</Link>
//                         {/* <Link to="/adminHomePageBanner" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Homepage Banners</Link> */}
//                       </li>
//                       <li className="nav-item">
//                       <Link to="/adminCommissionForm" className="custom-link">Commission Settings</Link>
//                         {/* <Link to="/adminCommissionForm" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Commission Settings</Link> */}
//                       </li>
//                     </>
//                   )}

//                   <li className="nav-item">
//                     <button onClick={handleLogout} className="btn btn-danger btn-sm rounded-pill shadow-sm">Logout</button>
//                   </li>
//                 </>
//               ) : (
//                 <>
//                   <li className="nav-item">
//                   <Link to="/login" className="custom-link">Login</Link>
//                     {/* <Link to="/login" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Login</Link> */}
//                   </li>
//                   <li className="nav-item">
//                   <Link to="/userRegister" className="custom-link">Register</Link>
//                     {/* <Link to="/userRegister" className="btn btn-outline-light btn-sm rounded-pill shadow-sm">Register</Link> */}
//                   </li>
//                   <li className="nav-item">
//                   <Link to="/vendorRegister" className="custom-link bg-success text-white">Become a Seller</Link>
//                     {/* <Link to="/vendorRegister" className="btn btn-success btn-sm rounded-pill shadow-sm text-white">Become a Seller</Link> */}
//                   </li>
//                 </>
//               )}
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;

import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Store } from "lucide-react";
import { UserContext } from '../../context/userContext';
import { loadCart } from '../../api/cartActions';
import { clearCart } from '../../slices/cartSlice';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './header.css'; // custom styles

const Header = () => {
  const cartCount = useSelector((state) => state.cart.totalQuantity);
  const { userName, role, logout } = useContext(UserContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (userName && token) {
      dispatch(loadCart());
    }
  }, [userName, dispatch]);

  const handleLogout = () => {
    logout();
    dispatch(clearCart());
    sessionStorage.removeItem('hasShownNotificationAlert');
    if (role === "customer" || role === "admin") {
      navigate('/login');
    } else {
      navigate('/vendorLogin');
    }
  };

  return (
    <header className="header-bg sticky-top shadow-sm">
      <nav className="navbar navbar-expand-lg container-fluid py-2">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <Store className="me-2 text-white" size={24} />
            <span className="brand-text">SmartBuy</span>
          </Link>

          <div className="d-flex align-items-center">
            <Link to="/" className="custom-link me-3">Home</Link>
            {userName && (
              <span className="badge bg-light text-dark px-3 py-2 rounded-pill me-3">
                Logged in as <strong>{userName}</strong>
              </span>
            )}
          </div>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsCollapsed(prev => !prev)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className={`collapse navbar-collapse ${isCollapsed ? 'show' : ''}`}>
            <ul className="navbar-nav mx-auto align-items-center flex-wrap">
              {userName && role === "customer" && (
                <li className="nav-item px-3 position-relative">
                  <Link to="/cart" className="custom-link position-relative">
                    <ShoppingCart className="me-1" size={16} />
                    Cart
                    {cartCount > 0 && (
                      <span className="custom-badge">{cartCount}</span>
                    )}
                  </Link>
                </li>
              )}

              {userName ? (
                <>
                  {role === "customer" && (
                    <>
                      <li className="nav-item px-3">
                        <Link to="/customerDashboard" className="custom-link">My Orders</Link>
                      </li>
                      <li className="nav-item px-3">
                        <Link to="/customerWishlist" className="custom-link">My Wishlist</Link>
                      </li>
                      <li className="nav-item px-3">
                        <Link to="/customerProfileUpdate" className="custom-link">My Profile</Link>
                      </li>
                    </>
                  )}

                  {role === "vendor" && (
                    <>
                      <li className="nav-item px-3">
                        <Link to="/vendorDashboard" className="custom-link">Dashboard</Link>
                      </li>
                      <li className="nav-item px-3">
                        <Link to="/vendorProductManagement" className="custom-link">Manage Products</Link>
                      </li>
                      <li className="nav-item px-3">
                        <Link to="/vendorPayoutRequest" className="custom-link">Request Payouts</Link>
                      </li>
                    </>
                  )}

                  {role === "admin" && (
                    <>
                      <li className="nav-item px-3">
                        <Link to="/adminDashboard" className="custom-link">Dashboard</Link>
                      </li>
                      <li className="nav-item px-3">
                        <Link to="/adminUserManagementDashboard" className="custom-link">Manage Users</Link>
                      </li>
                      <li className="nav-item px-3">
                        <Link to="/approveVendorPayout" className="custom-link">Approve Payouts</Link>
                      </li>
                      <li className="nav-item px-3">
                        <Link to="/adminHomePageSection" className="custom-link">Homepage Sections</Link>
                      </li>
                      <li className="nav-item px-3">
                        <Link to="/adminHomePageBanner" className="custom-link">Homepage Banners</Link>
                      </li>
                      <li className="nav-item px-3">
                        <Link to="/adminCommissionForm" className="custom-link">Commission Settings</Link>
                      </li>
                    </>
                  )}

                  <li className="nav-item px-3">
                    <button onClick={handleLogout} className="btn btn-danger btn-sm rounded-pill shadow-sm">Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item px-3">
                    <Link to="/login" className="custom-link">Login</Link>
                  </li>
                  <li className="nav-item px-3">
                    <Link to="/userRegister" className="custom-link">Register</Link>
                  </li>
                  <li className="nav-item px-3">
                    <Link to="/vendorRegister" className="custom-link bg-success text-white">Become a Seller</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
