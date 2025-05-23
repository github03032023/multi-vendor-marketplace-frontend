import React, { useState } from "react";
import { Routes, Route, useLocation  } from "react-router-dom";
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
import ProductManagement from "./pages/vendor/vendorProductManagement";
import AdminDashboard from "./pages/admin/adminDashboard";
import AdminUserManagementDashboard from "./pages/admin/adminUserManagement";
import VendorPayoutRequest from "./pages/vendor/vendorPayoutRequest";
import OrderDetailPage from "./pages/admin/orderDetailPage";
import CustomerDashboard from "./pages/customer/customerDashboard";
import ProductDisplayPage from "./components/ProductDisplayPage";
import AdminPayoutAction from "./pages/admin/adminPayoutAction";
import EmailVerification from './components/EmailVerification/emailVerification';
import Footer from "./components/Footer/footer";
import HomepageSections from "./components/HomePageSections/homePageSections";
import AdminHomepageSection from "./components/HomePageSections/adminHomePageSection";
import CustomerWishlist from "./components/CustomerWishlist/customerWishlist";
import BannerDisplay from "./components/Banner/bannerDisplay";
import AdminBannerUpload from "./components/Banner/adminBannerUpload";
import AdminCommissionForm from "./components/AdminCommissionForm/adminCommisssionForm";
import VendorEmailVerification from "./components/EmailVerification/vendorEmailVerification";
import CustomerProfileUpdate from "./pages/customer/customerUpdateProfile";
import FooterInfoPage from "./components/Footer/footerInfoPage";
import ScrollToHashElement from "./components/Footer/scrollToHashElement";
import { AnimatePresence, motion } from "framer-motion";
import PageWrapper from './pages/pageWrapper';

const stripePromise = loadStripe("pk_test_51R4zWDHQ0Inu2WWrgWUYAbKrFrQQm0GCL4WmMQH0XA4RzriWnsQbN5MnsjQTMnT4RYI1H6IdHtIuAWAUMk7gtjrd00DKM65wVY");

const AppRoutes = () => {
    let role = null;
    const location = useLocation(); // Needed for AnimatePresence
    const userId = localStorage.getItem("userId");
    const vendorId = localStorage.getItem("vendorId");
    if (userId) {
        role = localStorage.getItem("role");
    } else if (vendorId) {
        role = "vendor";
    }

    return (
        <>
         <div className="layout-wrapper">
            <Header />
            <ScrollToHashElement />
            <main className="layout-content">
            <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><ProductsDBData /></PageWrapper>} />
                <Route path="/userRegister" element={<PageWrapper><UserRegister /></PageWrapper>} />
                <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                <Route path="/vendorRegister" element={<PageWrapper><VendorRegister /></PageWrapper>} />
                <Route path="/vendorLogin" element={<PageWrapper><VendorLogin /></PageWrapper>} />
                <Route path="/unauthorized" element={<PageWrapper><Unauthorized /></PageWrapper>} />
                <Route path="/product/:productCode" element={<PageWrapper><ProductDisplayPage /></PageWrapper>} />
                <Route path="/verifyEmail" element={<EmailVerification />} />
                <Route path="/verifyVendorEmail" element={<PageWrapper><VendorEmailVerification /></PageWrapper>} />
                
                <Route path="/homePageSection" element={<PageWrapper><HomepageSections /></PageWrapper>} />
                <Route path="/homePageBanner" element={<PageWrapper><BannerDisplay /></PageWrapper>} />
                <Route path="/footer-info" element={<PageWrapper><FooterInfoPage /></PageWrapper>} />

                <Route element={<AuthRoute allowedRoles={['admin']} />}>
                    <Route path="/adminDashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                    <Route path="/adminUserManagementDashboard" element={<PageWrapper><AdminUserManagementDashboard /></PageWrapper>} />
                    <Route path="/adminHomePageSection" element={<PageWrapper><AdminHomepageSection/></PageWrapper>} />
                    <Route path="/adminHomePageBanner" element={<PageWrapper>< AdminBannerUpload/></PageWrapper>} />
                    <Route path="/admin/orders/:orderId" element={<PageWrapper><OrderDetailPage /></PageWrapper>} />
                    <Route path="/approveVendorPayout" element={<PageWrapper><AdminPayoutAction /></PageWrapper>} />
                    <Route path="/adminCommissionForm" element={<PageWrapper><AdminCommissionForm /></PageWrapper>} />
                    {/* <Route path="/adminAnalyticsDashboard" element={<AdminAnalyticsDashboard />} /> */}
                    
                </Route>

                <Route element={<AuthRoute allowedRoles={['vendor']} />}>
                    <Route path="/vendorDashboard" element={<PageWrapper><VendorDashboard /></PageWrapper>} />
                    <Route path="/vendorProductManagement" element={<PageWrapper><ProductManagement /></PageWrapper>} />
                    <Route path="/vendorPayoutRequest" element={<PageWrapper><VendorPayoutRequest /></PageWrapper>} />
                </Route>

                <Route element={<AuthRoute allowedRoles={['customer']} />}>
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/placeOrder" element={<PageWrapper><OrderPage /></PageWrapper>} />
                    <Route path="/customerDashboard" element={<PageWrapper><CustomerDashboard /></PageWrapper>} />
                    <Route path="/customerWishlist" element={<PageWrapper><CustomerWishlist /></PageWrapper>} />
                    <Route path="/customerProfileUpdate" element={<PageWrapper><CustomerProfileUpdate /></PageWrapper>} />
                    
                    <Route
                        path="/payment/:orderId"
                        element={
                            <Elements stripe={stripePromise}>
                                <Payment />
                            </Elements>
                        }
                    />
                    <Route path="/order-confirmation/:orderId"
                        element={<PageWrapper><OrderConfirmation /></PageWrapper>} />
                </Route>

            </Routes>
            </AnimatePresence>
            </main>
            <Footer />
            </div>
        </>

    )
};
export default AppRoutes;