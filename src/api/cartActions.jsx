import axios from '../api/axiosSetUp';
import { addToCart, removeFromCart, loadCartFromStorage, clearCart, setCart } from '../slices/cartSlice';

export const loadCart = () => async (dispatch) => {
  // //Fetch from localStorage first
  // const localStorageCart = JSON.parse(localStorage.getItem('cartItems'));
  // if (localStorageCart) {
  //   // Update the Redux state with data from localStorage
  //   dispatch(loadCartFromStorage());
  // }

  // Sync cart with the backend if the user is logged in
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await axios.get('/cart/getCartItems');
      dispatch(setCart(response.data.cart)); 
    //   dispatch(loadCartFromStorage()); 
    } catch (error) {
      console.error('Failed to load cart from server:', error);
    }
  }
};

export const addItemToCart = (productCode, quantity) => async (dispatch) => {
  try {
    const response = await axios.post('/cart/addToCart', { productCode, quantity });
    const product = response.data.cart.find(item => item.productCode === productCode); 
    // dispatch(addToCart(product));
    localStorage.setItem('cartItems', JSON.stringify(response.data.cart));
  } catch (error) {
    console.error("Add to cart failed:", error);
  }
};

export const removeItemFromCart = (productCode) => async (dispatch) => {
    try {
      const response = await axios.post('/cart/removeFromCart', {
        data: { productCode },
      });
      dispatch(removeFromCart(response.data.updatedCart));
      localStorage.setItem('cartItems', JSON.stringify(response.data.updatedCart));
    } catch (error) {
      console.error("Remove from cart failed:", error.response?.data || error.message);
    }
  };


  export const updateCartItemQuantity = (productCode, quantity) => async (dispatch) => {
    try {
      const response = await axios.post("/cart/updateQuantity", { productCode, quantity });
      dispatch(setCart(response.data.cart));
      localStorage.setItem("cartItems", JSON.stringify(response.data.cart));
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  export const clearCartOnLogout = () => (dispatch) => {
    dispatch(clearCart());
  };
  

  export const clearCartFromBackend = () => async(dispatch) => {
    try {
      await axios.post("/cart/clearCart");
      dispatch(clearCart());
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };
  