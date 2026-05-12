import api from "@/lib/api";
import { sortItems } from "@/lib/utils/list";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  products: {
    items: [],
    filteredItems: [],
  },
  isLoading: false,
};

const productsSlice = createSlice({
  name: "production",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(refreshProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshProducts.fulfilled, (state, action) => {
        state.products.items = action.payload;
        state.products.filteredItems = sortItems({
          items: action.payload,
          sortBy: SORT_INIT_VALUE,
        });
        state.isLoading = false;
      })
      .addCase(refreshProducts.rejected, (state) => {
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
