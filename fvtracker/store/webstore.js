import api from "@/lib/api";
import { SORT_INIT_VALUE } from "@/lib/constants/others";
import { sortItems } from "@/lib/utils/list";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  products: {
    items: [],
    filteredItems: [],
  },
  cart: {
    items: [],
  },
  isLoading: false,
};

const productsSlice = createSlice({
  name: "webstore",
  initialState,
  reducers: {
    addToCartRedux: (state, action) => {
      const { product, quantity } = action.payload;
      const existingItem = state.cart.items.find(
        (item) => item.product.id === product.id,
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.items.push({ product, quantity });
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cart.items = state.cart.items.filter(
        (item) => item.product.id !== productId,
      );
    },
    fillReduxCart: (state, action) => {
      state.cart.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshProductsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshProductsThunk.fulfilled, (state, action) => {
        state.products.items = action.payload;
        state.products.filteredItems = sortItems({
          items: action.payload,
          sortBy: SORT_INIT_VALUE,
        });
        state.isLoading = false;
      })
      .addCase(refreshProductsThunk.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const refreshProductsThunk = createAsyncThunk(
  "webstore/refreshProducts",
  async () => {
    console.log("Fetching products...");
    const res = await api.get("/products");
    const data = res.data;
    console.log({ data });
    return res.data.products;
  },
);

export default productsSlice.reducer;
export const { addToCartRedux, removeFromCart } = productsSlice.actions;
