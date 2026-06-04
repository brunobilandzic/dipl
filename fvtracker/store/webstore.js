import api from "@/lib/api";
import { SORT_INIT_VALUE } from "@/lib/constants/others";
import { filterItems, sortItems } from "@/lib/utils/list";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  products: {
    items: null,
    filteredItems: null,
  },
  cart: {
    items: [],
  },
  isLoading: false,
  orders: {
    items: null,
    filteredItems: null,
  },
};

const productsSlice = createSlice({
  name: "webstore",
  initialState,
  reducers: {
    addToCartRedux: (state, action) => {
      const { product, quantity } = action.payload;
      const existingItem = state.cart.items.find(
        (item) => item.product._id === product._id,
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.items.push({ product, quantity });
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cart.items = state.cart.items.filter(
        (item) => item.product._id !== productId,
      );
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    fillReduxCart: (state, action) => {
      state.cart.items = action.payload;
    },
    changeQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.cart.items.find(
        (item) => item.product.id === productId,
      );
      if (existingItem) {
        existingItem.quantity = quantity;
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    emptyCart: (state, action) => {
      state.cart = initialState.cart;
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    sortOrders: (state, action) => {
      const sortBy = action.payload;
      state.orders.filteredItems = sortItems({
        items: state.orders.filteredItems,
        sortBy,
      });
    },
    filterOrders: (state, action) => {
      const filters = action.payload.filters;
      const sortBy = action.payload.sortBy || SORT_INIT_VALUE;
      state.orders.filteredItems = filterItems({
        _items: state.orders.items,
        filters,
      });
      state.orders.filteredItems = sortItems({
        items: state.orders.filteredItems,
        sortBy,
      });
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
      })
      .addCase(refreshOrdersThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshOrdersThunk.fulfilled, (state, action) => {
        state.orders.items = action.payload;
        state.orders.filteredItems = sortItems({
          items: action.payload,
          sortBy: SORT_INIT_VALUE,
        });
        state.isLoading = false;
      })
      .addCase(refreshOrdersThunk.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const refreshProductsThunk = createAsyncThunk(
  "webstore/refreshProducts",
  async () => {
    const res = await api.get("/products");
    const data = res.data;
    return res.data.products;
  },
);

export const refreshOrdersThunk = createAsyncThunk(
  "webstore/refreshOrders",
  async () => {
    const res = await api.get("/orders");
    const data = res.data;
    return res.data.orders;
  },
);

export default productsSlice.reducer;
export const {
  addToCartRedux,
  removeFromCart,
  fillReduxCart,
  changeQuantity,
  emptyCart,
  sortOrders,
  filterOrders,
} = productsSlice.actions;
