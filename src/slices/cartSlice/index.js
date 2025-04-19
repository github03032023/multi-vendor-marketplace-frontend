import { createSlice } from "@reduxjs/toolkit";

// Local Storage Helpers
const saveToLocalStorage = (cartItems) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

const getInitialCart = () => {
  const stored = localStorage.getItem("cartItems");
  return stored ? JSON.parse(stored) : [];
};

const storedCart = getInitialCart();

const initialState = {
  items: storedCart,
  totalQuantity: storedCart.reduce((total, item) => total + item.quantity, 0),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadCartFromStorage: (state) => {
      const storedItems = getInitialCart();
      state.items = storedItems;
      state.totalQuantity = storedItems.reduce((total, item) => total + item.quantity, 0);
    },

    setCart: (state, action) => {
      state.items = action.payload;
      state.totalQuantity = action.payload.reduce((total, item) => total + item.quantity, 0);
      saveToLocalStorage(state.items);
    },

    addToCart: (state, action) => {
      const newItem = action.payload;
      const quantity = newItem.quantity ?? 1;
      const existingItem = state.items.find(item => item.productId === newItem.productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...newItem, quantity });
      }

      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      saveToLocalStorage(state.items);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.productId !== productId);
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      saveToLocalStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  loadCartFromStorage,
  setCart,
  addToCart,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
