import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { Link } from "react-router-dom";
import { UserContext } from '../../context/userContext';
import login from '../../assets/images/userLogin.jpg';
import axiosInstance from '../../api/axiosSetUp';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUserName, setRole, setUserId } = useContext(UserContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axiosInstance.post("/customer/userLogin", { email, password });
            console.log("Response from UserLogin-", response);
            if (response.data.success) {
                const token = response.data.token;
                localStorage.setItem("token", token); // Store JWT
                // Decode token to get user information
                const decodedToken = jwtDecode(token);
                localStorage.setItem("userId", decodedToken.userId);
                console.log("userId is -", decodedToken.userId);
                localStorage.setItem("role", decodedToken.role);
                console.log("role is -", decodedToken.role);
                localStorage.setItem("userName", response.data.user.name); // or decodedToken.username
                console.log("userName is -", response.data.user.name);
                setUserName(response.data.user.name);
                setRole(decodedToken.role);
                setUserId(decodedToken.userId);
                // Navigate based on user role
                if (decodedToken.role === "admin") {
                    // navigate("/approveVendorPayout");
                    navigate("/adminDashboard");
                } else {
                    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

                    if (cartItems.length > 0) {
                        navigate("/cart");
                    } else {
                        navigate("/customerDashboard"); // Let user add new items
                        //navigate("/");
                    }
                }
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            const backendMessage = err.response?.data?.error || "Something went wrong during user login.";
            setError(backendMessage);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center align-items-center min-vh-100">
                <div className="col-lg-10 shadow rounded-4 overflow-hidden p-0">
                    <div className="row g-0">
                        {/* Left - Image */}
                        <div className="col-md-6 d-none d-md-block">
                            <img src={login} alt="Login" className="img-fluid h-100 w-100 object-fit-cover" />
                        </div>

                        {/* Right - Login Form */}
                        <div className="col-md-6 bg-white p-4 p-md-5">
                            <h2 className="text-center mb-4">Login</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 mt-2">Login</button>
                            </form>
                            <div className="text-center mt-3">
                                <span>Don't have an account? </span>
                                <Link to="/userRegister">Register here</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
