// productSlice.js

import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
  name: "product",
  initialState: {
    product: [],
  },
  reducers: {
    getProducts: (state, action) => {
      const existingProductIndex = state.product.findIndex(
        (product) => product.id === action.payload.id
      );
      if (existingProductIndex === -1) {
        state.product.push({ ...action.payload });
      }
    },
    
    incrementQty: (state, action) => {
      const itemPresent = state.product.find(
        (item) => item.id === action.payload.id
      );
      itemPresent.quantity++;
    },
    decrementQty: (state, action) => {
      const itemPresent = state.product.find(
        (item) => item.id === action.payload.id
      );
      if (itemPresent.quantity === 1) {
        itemPresent.quantity = 0;
      } else {
        itemPresent.quantity--;
      }
    },
    cleanProduct: (state) => {
      // Set the quantity of all items to 0
      state.product.forEach((item) => {
        item.quantity = 0;
      });
    },
  },
});

export const { getProducts, incrementQty, decrementQty, cleanProduct } =
  productSlice.actions;

export default productSlice.reducer;
