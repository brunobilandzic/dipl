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
    sortProducts: (state, action) => {
      state.items = sortProductsHelper(state.items, action.payload);
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

const sortProductsHelper = (products, sortBy) => {
  switch (sortBy) {
    case "newest":
      return [...products].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    case "oldest":
      return [...products].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
    case "priceAsc":
      return [...products].sort((a, b) => a.price - b.price);
    case "priceDesc":
      return [...products].sort((a, b) => b.price - a.price);
    case "fieldNameAsc":
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    case "fieldNameDesc":
      return [...products].sort((a, b) => b.name.localeCompare(a.name));
    default:
      return products;
  }
};
