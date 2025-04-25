import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import UserRegister from "./pages/customer/register";
import VendorRegister from "./pages/vendor/vendorregister";
import Login from "./pages/customer/userLogin";
import VendorDashboard from "./pages/vendor/vendorDashboard";
import Unauthorized from "./pages/unauthorized";
import VendorLogin from "./pages/vendor/vendorLogin";
import Header from "./components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import ProductsDBData from "./components/ProductsDBData";
import Payment from "./components/Payment";
import AuthRoute from "./components/AuthRoute/authRoute";
import Cart from "./components/Cart";
// Adding Stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderPage from "./components/Order/orderPage";
import OrderConfirmation from "./components/Order/orderConfirmation";


const stripePromise = loadStripe("pk_test_51R4zWDHQ0Inu2WWrgWUYAbKrFrQQm0GCL4WmMQH0XA4RzriWnsQbN5MnsjQTMnT4RYI1H6IdHtIuAWAUMk7gtjrd00DKM65wVY");

const AppRoutes = () => {
    const [searchQuery, setSearchQuery] = useState("");
    return (
        <>
            <Header setSearchQuery={setSearchQuery} />
            <Routes>
                <Route path="/" element={<ProductsDBData searchQuery={searchQuery} />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/userRegister" element={<UserRegister />} />
                <Route path="/login" element={<Login />} />
                <Route path="/vendorRegister" element={<VendorRegister />} />
                <Route path="/vendorLogin" element={<VendorLogin />} />
                <Route path="/vendorDashboard" element={<VendorDashboard />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/placeOrder" element={<OrderPage />} />
                


                <Route element={<AuthRoute allowedRoles={['customer', 'admin']} />}>
                    <Route
                        path="/payment/:orderId"
                        element={
                            <Elements stripe={stripePromise}>
                                <Payment />
                            </Elements>
                        }
                    />
                    <Route path="/order-confirmation/:orderId"
                     element={<OrderConfirmation/>} />
                </Route>
                
            </Routes>

        </>

    )
};
export default AppRoutes;