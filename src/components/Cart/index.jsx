import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../../slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const proceedToPay = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/payment");
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="row">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="col-12 col-sm-12 col-md-12 col-lg-12 mb-3"
              >
                <div className="card h-100 d-flex flex-column align-items-center text-center p-3">
                  <img
                    src={
                      item.images?.[0]?.url ??
                      "https://members.naeyc.org/eweb/images/DEMO1/notavailable.jpg"
                    }
                    className="card-img-top img-fluid"
                    alt={item.productName}
                    style={{ maxWidth: "100px" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.productName}</h5>
                    <p className="card-text fw-bold">
                      ${item.price} × {item.quantity}
                    </p>
                    <p className="card-text text-muted">{item.category}</p>
                  </div>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => dispatch(removeFromCart(item.productId))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded mb-3">
            <h5 className="m-0">
              Total Items:{" "}
              <span className="badge bg-primary">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </h5>
            <h5 className="m-0">
              Total Price:{" "}
              <span className="fw-bold">${totalPrice.toFixed(2)}</span>
            </h5>
          </div>

          <button className="btn btn-success mt-3" onClick={proceedToPay}>
            Proceed To Pay
          </button>
        </>
      )}

      {cartItems.length > 0 && (
        <button
          className="btn btn-warning mt-3"
          onClick={() => dispatch(clearCart())}
        >
          Clear Cart
        </button>
      )}
    </div>
  );
};

export default Cart;
