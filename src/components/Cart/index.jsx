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
  const navigateHome = () => {
    navigate("/");
  };


  // const handleRemove = (productCode) => {
  //   dispatch(removeItemFromCart(productCode));
  // };

  const handleRemove = async (productCode) => {
    await dispatch(removeItemFromCart(productCode));
    dispatch(loadCart());
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
                className="card mb-4 shadow-sm p-3 border-0"
              >
                <div className="row g-3 align-items-center">
                  {/* Left: Product Image + Quantity Control */}
                  <div className="col-12 col-md-3 text-center">
                    <img
                      src={
                        item.images?.[0]?.url ??
                        "https://members.naeyc.org/eweb/images/DEMO1/notavailable.jpg"
                      }
                      alt={item.productName}
                      className="img-fluid rounded"
                      style={{ maxHeight: "120px", objectFit: "contain" }}
                    />
                    <div className="d-flex justify-content-center align-items-center mt-2">
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
                  </div>

                  {/* Right: Product Details */}
                  <div className="col-12 col-md-9">
                    {/* <h5>{item.productName}</h5> */}
                    <Link to={`/product/${item.productCode}`}>
                      <h5>{item.productName}</h5>

                    </Link>
                    <p className="text-muted mb-1">{item.description}</p>
                    <p className="mb-1">
                      <strong>Vendor:</strong> {item.vendorCompanyName} ({item.vendorCountry})
                    </p>
                    <p className="mb-1">
                      <strong>Category:</strong> {item.category}
                    </p>
                    <p className="fw-bold mb-2">
                      Rs.{item.price} × {item.quantity} = Rs.{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemove(item.productCode)}
                    >
                      Remove
                    </button>
                  </div>
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
              <span className="fw-bold">Rs.{totalPrice.toFixed(2)}</span>
            </h5>
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-md-end gap-2 mt-4">

            <button
              className="btn btn-warning"
              onClick={handleClearCart}
            >
              <i className="bi bi-trash3 me-1"></i>Clear Cart
            </button>

            <button
              className="btn btn-info"
              onClick={navigateHome}
            >
              <i className="bi bi-plus-circle me-1"></i>Add more items
            </button>
            <button className="btn btn-success" onClick={proceedToPay}>
              <i className="bi bi-credit-card me-1"></i>Proceed To Pay
            </button>
          </div>
        </>
      )}
      {/* 
      {cartItems.length > 0 && (
        <>
          <button
            className="btn btn-warning mt-3"
            onClick={handleClearCart}
          >
            Clear Cart
          </button>

          <button
            className="btn btn-info mt-3"
            onClick={navigateHome}
          >
            Add more items to cart
          </button>
        </>
      )} */}
    </div>
  );
};

export default Cart;
