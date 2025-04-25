import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCartOnLogout, loadCart } from "../../api/cartActions";
import { removeItemFromCart, updateCartItemQuantity, clearCartFromBackend } from "../../api/cartActions"; // Async action
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage/backend
  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);


  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);


  const handleQuantityChange = (productCode, currentQty, noOfItems) => {
    const newQty = currentQty + noOfItems;
    if (newQty < 1) return; // prevent going below 1
    dispatch(updateCartItemQuantity(productCode, newQty));
  };

  const proceedToPay = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/placeOrder");
    }
  };

  const handleRemove = (productCode) => {
    dispatch(removeItemFromCart(productCode));
  };

  const isLoggedIn = !!localStorage.getItem("token");

  const handleClearCart = () => {
    if (isLoggedIn) {
      // Call API to clear server-side cart
      dispatch(clearCartFromBackend());
    } else {
      // Just clear localStorage or Redux state
      dispatch(clearCartOnLogout());
      
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
          <div className="row" >
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
                      ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <div className="d-flex justify-content-center align-items-center mb-2">
                      <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={() => handleQuantityChange(item.productCode, item.quantity, -1)}
                      >
                        -
                      </button>
                      <span className="fw-bold">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm ms-2"
                        onClick={() => handleQuantityChange(item.productCode, item.quantity, 1)}
                      >
                        +
                      </button>
                    </div>

                    <p className="card-text text-muted">{item.category}</p>
                  </div>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(item.productCode)}
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
          onClick={handleClearCart}
        >
          Clear Cart
        </button>
      )}
    </div>
  );
};

export default Cart;
