import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../../context/userContext';
const Header = ({ setSearchQuery }) => {
    // Get cart items count from Redux
    const cartCount = useSelector((state) => state.cart.totalQuantity);
    const { userName, logout } = useContext(UserContext);

    const navigate = useNavigate();

    const handleSignOut = () => {
        logout();
        navigate('/login');  // Redirect after logout
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light w-100 fixed-top">
            <div className="container-fluid px-4">
                {/* Brand Name */}
                <Link className="navbar-brand" to="/">E-Shop</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarContent">
                    {/* Left-aligned Links */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                    </ul>
                    {/* Search Bar */}
                    <form className="d-flex me-3">
                        <input
                            className="form-control"
                            type="search"
                            placeholder="Search Products By Name"
                            aria-label="Search Products"
                            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                        />
                    </form>
                    {/* Cart Icon */}
                    <Link to="/cart" className="btn btn-outline-secondary me-3 position-relative">
                        <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                        {cartCount > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {cartCount}
                                <span className="visually-hidden">items in cart</span>
                            </span>
                        )}
                    </Link>
                    {/* Sign In Button */}
                    {/* Conditional Button */}
                    {userName ? (
                        <>
                            <span className="navbar-text me-3">
                                Logged in as <strong>{userName}</strong>
                            </span>
                            <button onClick={handleSignOut} className="btn btn-outline-danger">
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-outline-primary">Sign In</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;





