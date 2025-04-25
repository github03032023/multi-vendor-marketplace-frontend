// import React, { useContext, useEffect, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { UserContext } from '../../context/userContext';
// import { loadCart } from '../../api/cartActions';
// import { clearCart } from '../../slices/cartSlice';
// const Header = ({ setSearchQuery }) => {
//     // Get cart items count from Redux
//     const cartCount = useSelector((state) => state.cart.totalQuantity);
//     const { userName, logout } = useContext(UserContext);
//     const dispatch = useDispatch();

//     useEffect(() => {
//       // Load cart only if user is logged in and token exists
//       const token = localStorage.getItem('token');
//       if (userName && token) {
//         dispatch(loadCart());
//       }
//     }, [userName, dispatch]);


//     const navigate = useNavigate();

//     const handleSignOut = () => {
//         logout();
//         dispatch(clearCart());
//         navigate('/login');  // Redirect after logout
//     };

//     return (
//         <nav className="navbar navbar-expand-lg navbar-light bg-light w-100 fixed-top">
//             <div className="container-fluid px-4">
//                 {/* Brand Name */}
//                 <Link className="navbar-brand" to="/">E-Shop</Link>
//                 <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
//                     <span className="navbar-toggler-icon"></span>
//                 </button>
//                 <div className="collapse navbar-collapse" id="navbarContent">
//                     {/* Left-aligned Links */}
//                     <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//                         <li className="nav-item">
//                             <Link className="nav-link" to="/">Home</Link>
//                         </li>
//                     </ul>
//                     {/* Search Bar */}
//                     <form className="d-flex me-3">
//                         <input
//                             className="form-control"
//                             type="search"
//                             placeholder="Search Products By Name"
//                             aria-label="Search Products"
//                             onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
//                         />
//                     </form>
//                     {/* Cart Icon */}
//                     <Link to="/cart" className="btn btn-outline-secondary me-3 position-relative">
//                         <FontAwesomeIcon icon={faShoppingCart} size="lg" />
//                         {cartCount > 0 && (
//                             <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
//                                 {cartCount}
//                                 <span className="visually-hidden">items in cart</span>
//                             </span>
//                         )}
//                     </Link>
//                     {/* Sign In Button */}
//                     {/* Conditional Button */}
//                     {userName ? (
//                         <>
//                             <span className="navbar-text me-3">
//                                 Logged in as <strong>{userName}</strong>
//                             </span>
//                             <button onClick={handleSignOut} className="btn btn-outline-danger">
//                                 Sign Out
//                             </button>
//                         </>
//                     ) : (
//                         <Link to="/login" className="btn btn-outline-primary">Sign In</Link>
//                     )}
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Header;



import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { UserContext } from '../../context/userContext';
import { loadCart } from '../../api/cartActions';
import { clearCart } from '../../slices/cartSlice';

const Header = ({ setSearchQuery }) => {
     // Get cart items count from Redux
  const cartCount = useSelector((state) => state.cart.totalQuantity);
  const { userName, logout } = useContext(UserContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (userName && token) {
      dispatch(loadCart());
    }
  }, [userName, dispatch]);

  const handleLogout = () => {
    logout();
    dispatch(clearCart());
    navigate('/login');
  };

  return (
    <header className="w-full bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Left - Logo */}
      <Link to="/" className="text-xl font-semibold tracking-tight">
        E-Shop
      </Link>

      {/* Center - Search Bar */}
      <div className="flex-1 mx-6">
        <Input
          type="search"
          placeholder="Search products..."
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
      </div>

      {/* Right - Navigation */}
      <div className="flex items-center gap-4">
        <Link to="/cart" className="relative">
          <Button variant="outline" size="icon">
            <ShoppingCart className="w-5 h-5" />
          </Button>
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2">{cartCount}</Badge>
          )}
        </Link>

        {userName ? (
          <>
            <span className="text-sm font-medium">{userName}</span>
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/userRegister">
              <Button variant="outline">Register</Button>
            </Link>
          </>
        )}
        <Link to="/vendorRegister">
          <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
            Become a Seller
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;


