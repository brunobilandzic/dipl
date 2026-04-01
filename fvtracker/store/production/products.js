import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: null,
  managers: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    addProduct: (state, action) => {
      state.items.push(action.payload);
    },
    removeProduct: (state, action) => {
      state.items = state.items.filter(
        (product) => product.id !== action.payload,
      );
    },
    updateProduct: (state, action) => {
      state.items = state.items.map((product) =>
        product.id === action.payload.id ? action.payload : product,
      );
    },
    setManagers: (state, action) => {
      state.managers = action.payload;
    },
  },
});

export const {
  setProducts,
  addProduct,
  removeProduct,
  updateProduct,
  setManagers,
} = productsSlice.actions;
export default productsSlice.reducer;
