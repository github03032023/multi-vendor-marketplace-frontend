import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlice";


const reduxStore = configureStore({
    reducer: {
        cart: cartReducer,
    },
    devTools: true
});

export default reduxStore;