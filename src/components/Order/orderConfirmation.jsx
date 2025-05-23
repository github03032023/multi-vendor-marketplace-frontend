import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from '../../api/axiosSetUp';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // 👈 useRef to track if already fetched

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchOrder = async () => {
      try {
        const { data } = await axiosInstance.get(`/order/confirmOrder/${orderId}`);
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (!order) return <div className="container mt-4">Order not found.</div>;

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="text-success">🎉 Order Confirmed!</h2>
        <p className="lead">Thank you for your purchase.</p>
        <h5 className="text-primary">Order ID: {order._id}</h5>
      </div>

      <div className="mb-4">
        <h4 className="mb-3">Order Summary</h4>
        {order.subOrders.map((sub, index) => (
          <div key={index} className="border rounded p-3 mb-4 shadow-sm">
            <h6 className="text-muted mb-3">
              <strong>Vendor:</strong> {sub.vendorId?.name || "N/A"}
            </h6>

            <div className="row g-3">
              {sub.products.map((prod, idx) => {
                const product = prod.productId;
                const imageUrl = product.images?.[0]?.url;

                return (
                  <div key={idx} className="col-md-6 col-lg-4 d-flex">
                    <img
                      src={imageUrl}
                      alt={product.productName}
                      className="img-thumbnail"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <div className="ms-3">
                      <h6>{product.productName}</h6>
                      <p className="mb-1">Qty: {prod.quantity}</p>
                      <p className="mb-1">Price: ₹{prod.priceAtPurchase}</p>
                      <p className="mb-1 fw-bold">
                        Total: ₹{prod.quantity * prod.priceAtPurchase}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3">
              <p><strong>Sub Total:</strong> ₹{sub.subTotal}</p>
              <p><strong>Status:</strong> {sub.status}</p>
            </div>
          </div>
        ))}

        <div className="mt-4">
          <h5 className="text-dark">Grand Total: ₹{order.totalAmount}</h5>
        </div>
      </div>

      <div className="mb-4">
        <h5 className="mb-2">Shipping Address</h5>
        <p className="text-muted">
          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </p>
      </div>

      <div className="text-center">
        <Link to="/" className="btn btn-success px-4">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
