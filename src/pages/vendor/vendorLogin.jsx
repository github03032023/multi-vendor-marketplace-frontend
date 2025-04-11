import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { Link } from "react-router-dom";
import { UserContext } from '../../context/userContext';
import axios from '../../api/axiosSetUp';

const VendorLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUserName } = useContext(UserContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post("/vendor/vendorLogin", { email, password });
            console.log("Response from VendorLogin-", response);
            if (response.data.success) {
                const token = response.data.token;
                localStorage.setItem("token", token); // Store JWT
                // Decode token to get user information
                const decodedToken = jwtDecode(token);
                localStorage.setItem("userId", decodedToken.vendorId);
                console.log("vendorId is -", decodedToken.vendorId);
                // localStorage.setItem("role", decodedToken.role);
                // console.log("role is -", decodedToken.role);
                localStorage.setItem("userName", response.data.vendor.name); // or decodedToken.username
                console.log("userName is -", response.data.vendor.name);
                setUserName(response.data.vendor.name);
                // Navigate to Vendor Dashboard
                navigate("/vendorDashboard");
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="container">
            <div className="row vh-100 align-items-center">
                {/* Left Side - Image */}
                <div className="col-md-6 d-none d-md-block">
                    <img src="/images/login.jpg" alt="Login" className="img-fluid rounded" />
                </div>

                {/* Right Side - Login Form */}
                <div className="col-md-6">
                    <div className="card shadow-lg p-4">
                        <h2 className="text-center mb-4">Login</h2>
                        {error && <p className="alert alert-danger">{error}</p>}
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
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                        </form>
                    </div>
                    <p className="text-center mt-3">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VendorLogin;
