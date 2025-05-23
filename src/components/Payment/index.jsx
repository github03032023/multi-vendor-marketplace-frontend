import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from '../../api/axiosSetUp';
import { clearCart } from "../../slices/cartSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51R4zWDHQ0Inu2WWrgWUYAbKrFrQQm0GCL4WmMQH0XA4RzriWnsQbN5MnsjQTMnT4RYI1H6IdHtIuAWAUMk7gtjrd00DKM65wVY");

const CheckoutForm = () => {
  const { orderId } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axiosInstance.get(`/order/${orderId}`);
        setOrder(data);
      } catch (err) {
        setError("Failed to load order.");
      }
    };

    const createPaymentIntent = async () => {
      try {
        const { data } = await axiosInstance.post("/payment/create-intent", { orderId });
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError("Failed to initiate payment.");
      }
    };

    fetchOrder();
    createPaymentIntent();
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (result.error) {
      setError(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      const paymentResult = await axiosInstance.post("/payment/confirm", {
        orderId,
        paymentIntent: result.paymentIntent,
      });

      if (!paymentResult.paymentId) {
        toast.success(`Payment successful!`);
        alert("Payment successful!");
        dispatch(clearCart());
        navigate(`/order-confirmation/${orderId}`);
      } else {
        toast.error(`Payment has issues!`);
        setError("Payment succeeded, but no payment ID was returned.");
      }
    }
  };

  return (
    <>
      {/* Fixed Top Header */}
      <nav className="navbar navbar-dark bg-dark fixed-top" style={{ height: "73px" }}>
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Checkout</span>
        </div>
      </nav>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="container" style={{ marginTop: "100px" }}>
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow p-4">
                <h4 className="text-center mb-4">Complete Your Payment</h4>

                {error && (
                  <div className="alert alert-danger text-center">{error}</div>
                )}

                {!order ? (
                  <div className="text-center">Loading order details...</div>
                ) : (
                  <>
                    <p className="text-muted text-center mb-4">
                      <strong>Order Total:</strong> ₹{order.totalAmount}
                    </p>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Card Details</label>
                        <div
                          className="form-control p-2"
                          style={{ minHeight: "45px", backgroundColor: "#f8f9fa" }}
                        >
                          <CardElement
                            options={{
                              style: {
                                base: {
                                  fontSize: "16px",
                                  color: "#495057",
                                  "::placeholder": {
                                    color: "#6c757d",
                                  },
                                },
                              },
                            }}
                          />
                        </div>
                      </div>

                      <button
                        className="btn btn-primary w-100 mt-3"
                        type="submit"
                        disabled={!stripe}
                      >
                        Pay Now
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Payment = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Payment;

