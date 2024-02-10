import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./CartReducer";
import ProductReducer from "./ProductReducer";
import AddressReducer from "./AddressReducer";

export default configureStore({
    reducer:{
        cart:CartReducer,
        product:ProductReducer,
        address:AddressReducer,
    }
})