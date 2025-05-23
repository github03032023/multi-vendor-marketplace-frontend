// import React, { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from 'jwt-decode';
// import { Link } from "react-router-dom";
// import { UserContext } from '../../context/userContext';
// import axios from '../../api/axiosSetUp';
// import vendorlogin from '../../assets/images/login.avif';


// const VendorLogin = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const navigate = useNavigate();
//     const { setUserName, setVendorId, setRole } = useContext(UserContext);

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setError("");
//         try {
//             const response = await axios.post("/vendor/vendorLogin", { email, password });
//             console.log("Response from VendorLogin-", response);
//             if (response.data.success) {
//                 const token = response.data.token;
//                 localStorage.setItem("token", token); // Store JWT
//                 // Decode token to get user information
//                 const decodedToken = jwtDecode(token);
//                 localStorage.setItem("vendorId", decodedToken.vendorId);
//                 console.log("vendorId is -", decodedToken.vendorId);
//                 localStorage.setItem("userName", response.data.vendor.name); // or decodedToken.username
//                 console.log("userName is -", response.data.vendor.name);

//                 setUserName(response.data.vendor.name);
//                 setRole("vendor"); // explicitly setting role as vendor as Db doesn't store it 
//                 setVendorId(decodedToken.vendorId);
//                 // Navigate to Vendor Dashboard
//                 navigate("/vendorDashboard");
//             } else {
//                 setError(response.data.message);
//             }
//         } catch (error) {
//             const backendMessage = error.response?.data?.message || "Something went wrong during vendor login.";
//             setError(backendMessage);
//         }
//     };

//     return (
//         <div className="container">
//             <div className="row vh-100 align-items-center">
//                 {/* Left Side - Image */}
//                 <div className="col-md-6 d-none d-md-block">
//                     {/* <img src="/images/login.jpg" alt="Login" className="img-fluid rounded" /> */}
//                     <div className="w-100 h-100">
//                         <img
//                             src={vendorlogin}
//                             alt="Vendor Login"
//                             className="img-fluid w-100 h-100 rounded-start"
//                             style={{ objectFit: 'cover' }}
//                         />
//                     </div>
//                 </div>

//                 {/* Right Side - Login Form */}
//                 <div className="col-md-6">
//                     <div className="card shadow-lg p-4">
//                         <h2 className="text-center mb-4">Login</h2>
//                         {error && <p className="alert alert-danger">{error}</p>}
//                         <form onSubmit={handleLogin}>
//                             <div className="mb-3">
//                                 <label className="form-label">Email</label>
//                                 <input
//                                     type="email"
//                                     className="form-control"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <div className="mb-3">
//                                 <label className="form-label">Password</label>
//                                 <input
//                                     type="password"
//                                     className="form-control"
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <button type="submit" className="btn btn-primary w-100">Login</button>
//                         </form>
//                     </div>
//                     <p className="text-center mt-3">
//                         Don't have an account? <Link to="/vendorRegister">Register here</Link>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default VendorLogin;


import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { Link } from "react-router-dom";
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../api/axiosSetUp';
import vendorlogin from '../../assets/images/login.avif';


const VendorLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUserName, setVendorId, setRole } = useContext(UserContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axiosInstance.post("/vendor/vendorLogin", { email, password });
            console.log("Response from VendorLogin-", response);
            if (response.data.success) {
                const token = response.data.token;
                localStorage.setItem("token", token); // Store JWT
                // Decode token to get user information
                const decodedToken = jwtDecode(token);
                localStorage.setItem("vendorId", decodedToken.vendorId);
                console.log("vendorId is -", decodedToken.vendorId);
                localStorage.setItem("userName", response.data.vendor.name); // or decodedToken.username
                console.log("userName is -", response.data.vendor.name);

                setUserName(response.data.vendor.name);
                setRole("vendor"); // explicitly setting role as vendor as Db doesn't store it 
                setVendorId(decodedToken.vendorId);
                // Navigate to Vendor Dashboard
                navigate("/vendorDashboard");
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            const backendMessage = error.response?.data?.message || "Something went wrong during vendor login.";
            setError(backendMessage);
        }
    };

    return (
        <div className="container py-5">
        <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-lg-10 shadow rounded-4 overflow-hidden p-0">
                <div className="row g-0">
                    {/* Left Side - Image */}
                    <div className="col-md-6 d-none d-md-block">
                        <img
                            src={vendorlogin}
                            alt="Vendor Login"
                            className="img-fluid h-100 w-100 object-fit-cover"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="col-md-6 bg-white p-4 p-md-5">
                        <h2 className="text-center mb-4">Vendor Login</h2>
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
                            <Link to="/vendorRegister">Register here</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default VendorLogin;
