import { SORT_INIT_VALUE } from "@/lib/constants/others";
import { filterItems, sortItems } from "@/lib/utils/list";
import { createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  products: {
    items: null,
    filteredItems: null,
  },
  managers: null,
  harvestingBatches: {
    items: null,
    filteredItems: null,
  },
  isLoading: false,
};

const productsSlice = createSlice({
  name: "production",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products.items = action.payload;
      state.products.filteredItems = sortItems({
        items: action.payload,
        sortBy: SORT_INIT_VALUE,
      });
    },
    /*  addProduct: (state, action) => {
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
    }, */
    setManagers: (state, action) => {
      state.managers = action.payload;
    },
    sortProducts: (state, action) => {
      state.products.filteredItems = sortItems({
        items: state.products.items,
        sortBy: action.payload,
      });
    },
    filterProducts: (state, action) => {
      state.products.filteredItems = filterItems({
        _items: state.products.items,
        itemModelName: "Product",
        filters: action.payload,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshHarvestingBatches.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshHarvestingBatches.fulfilled, (state, action) => {
        state.harvestingBatches.items = action.payload;
        state.harvestingBatches.filteredItems = sortItems({
          items: action.payload,
          sortBy: SORT_INIT_VALUE,
        });
      })
      .addCase(refreshHarvestingBatches.rejected, (state, action) => {
        state.harvestingBatches.isLoading = false;
      });
  },
});

export const refreshHarvestingBatches = createAsyncThunk(
  "production/refreshHarvestingBatches",
  async (_, { dispatch }) => {
    const res = await api.get("/harvesting-batches");
    return res.data.harvestingBatches;
  },
);

export const {
  setProducts /* 
  addProduct,
  removeProduct,
  updateProduct, */,
  setManagers,
  sortProducts,
  filterProducts,
} = productsSlice.actions;

export default productsSlice.reducer;
