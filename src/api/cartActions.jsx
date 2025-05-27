import axiosInstance from '../api/axiosSetUp';
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
      const response = await axiosInstance.get('/cart/getCartItems');
      dispatch(setCart(response.data.cart)); 
    //   dispatch(loadCartFromStorage()); 
    } catch (error) {
      console.error('Failed to load cart from server:', error);
    }
  }
};

export const addItemToCart = (productCode, quantity) => async (dispatch) => {
  try {
    const response = await axiosInstance.post('/cart/addToCart', { productCode, quantity });
    dispatch(setCart(response.data.cart));
    localStorage.setItem('cartItems', JSON.stringify(response.data.cart));
  } catch (error) {
    console.error("Add to cart failed:", error);
  }
};

export const removeItemFromCart = (productCode) => async (dispatch) => {
    try {
      const response = await axiosInstance.post('/cart/removeFromCart', {
        productCode,
      });
      // dispatch(removeFromCart(response.data.updatedCart));
      dispatch(setCart(response.data.updatedCart));
      localStorage.setItem('cartItems', JSON.stringify(response.data.updatedCart));
    } catch (error) {
      console.error("Remove items from cart failed:", error.response?.data || error.message);
    }
  };


  export const updateCartItemQuantity = (productCode, quantity) => async (dispatch) => {
    try {
      const response = await axiosInstance.post("/cart/updateQuantity", { productCode, quantity });
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
      await axiosInstance.post("/cart/clearCart");
      dispatch(clearCart());
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };
  