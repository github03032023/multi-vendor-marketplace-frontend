import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from '../../api/axiosSetUp';
const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/order/${orderId}`);
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
      <h2 className="mb-4">🎉 Order Confirmed!</h2>
      <p>Thank you for your purchase. Your order ID is:</p>
      <h5 className="text-primary">{order._id}</h5>

      <div className="mt-4">
        <h4>Order Summary</h4>
        {order.subOrders.map((sub, index) => (
          <div key={index} className="border rounded p-3 my-3">
            <h6>Vendor: {sub.vendorId.name}</h6>
            <ul>
              {sub.products.map((prod, idx) => (
                <li key={idx}>
                  {prod.productId.name} x {prod.quantity} @ ₹{prod.priceAtPurchase} = ₹{prod.quantity * prod.priceAtPurchase}
                </li>
              ))}
            </ul>
            <p><strong>Sub Total:</strong> ₹{sub.subTotal}</p>
            <p><strong>Status:</strong> {sub.status}</p>
          </div>
        ))}

        <h5>Total: ₹{order.totalAmount}</h5>
        <h5>Shipping Address</h5>
        <p>
          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </p>

        <Link to="/" className="btn btn-success mt-3">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
