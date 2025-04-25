import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/api';
import { clearCart } from '../../slices/cartSlice';

const prepareSubOrders = (cartItems) => {
  const subOrdersByVendor = {};

  cartItems.forEach((item) => {
    const vendorId = item.vendorId;

    if (!subOrdersByVendor[vendorId]) {
      subOrdersByVendor[vendorId] = {
        vendorId,
        vendorCompanyName: item.vendorCompanyName,
        vendorCountry: item.vendorCountry,
        products: [],
        subTotal: 0,
        status: 'Processing',
        statusHistory: [],
      };
    }

    subOrdersByVendor[vendorId].products.push({
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.price,
      productName: item.productName,
    });

    subOrdersByVendor[vendorId].subTotal += item.price * item.quantity;
  });

  return Object.values(subOrdersByVendor);
};

const calculateTotal = (subOrders) =>
  subOrders.reduce((acc, sub) => acc + sub.subTotal, 0);

const OrderPage = () => {
  const userId = localStorage.getItem("userId");
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {

    const requiredFields = ["country", "postalCode", "state"];
    const missingFields = requiredFields.filter((field) => !address[field].trim());

    if (missingFields.length > 0) {
      alert(`Please fill in the following Shipping Address fields: ${missingFields.join(", ")}`);
      return;
    }
    const subOrders = prepareSubOrders(cartItems);
    const totalAmount = calculateTotal(subOrders);

    const orderPayload = {
      customerId: userId,
      subOrders,
      totalAmount,
      shippingAddress: address,
      updatedBy: userId,
    };

    try {
      const response = await createOrder(orderPayload);
      // dispatch(clearCart());
      navigate(`/payment/${response.data.orderId}`);
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order');
    }
  };

  const subOrders = prepareSubOrders(cartItems);
  const totalAmount = calculateTotal(subOrders);

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">Confirm Your Order</h2>

      {/* Shipping Address */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">Shipping Address</div>
        <div className="card-body">
          <div className="row">
            {["street", "city", "state", "postalCode", "country"].map((field) => (
              <div className="col-md-6 mb-3" key={field}>
                <input
                  type="text"
                  className="form-control"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={address[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="card mb-4">
        <div className="card-header bg-secondary text-white">Order Summary</div>
        <div className="card-body">
          <p><strong>Total Items:</strong> {cartItems.reduce((sum, i) => sum + i.quantity, 0)}</p>
          <p><strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* SubOrders Section */}
      <div className="card">
        <div className="card-header bg-info text-white">Sub-Orders by Vendor</div>
        <div className="card-body">
          {subOrders.map((sub, index) => (
            <div key={index} className="mb-4">
              <h5 className="text-primary">
                Vendor: {sub.vendorCompanyName || sub.vendorId} <br/>
                Country of Origin : {sub.vendorCountry}
              </h5>
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sub.products.map((prod, i) => (
                    <tr key={i}>
                      <td>{prod.productName || prod.productId}</td>
                      <td>{prod.quantity}</td>
                      <td>₹{prod.priceAtPurchase}</td>
                      <td>₹{(prod.quantity * prod.priceAtPurchase).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="fw-bold">
                    <td colSpan="3" className="text-end">Sub Total</td>
                    <td>₹{sub.subTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-success mt-4" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default OrderPage;








