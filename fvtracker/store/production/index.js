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
  productStocks: {
    items: null,
    filteredItems: null,
  },
  machines: {
    items: null,
    filteredItems: null,
  },
  facilities: {
    items: null,
    filteredItems: null,
    selected: null,
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
    addProduct: (state, action) => {
      state.products.items.push(action.payload);
      state.products.filteredItems.push(action.payload);
      state.products.filteredItems = sortItems({
        items: state.products.filteredItems,
        sortBy: SORT_INIT_VALUE,
      });
    },
    removeProduct: (state, action) => {
      state.products.items = state.products.items.filter(
        (product) => product.id !== action.payload,
      );
      state.products.filteredItems = state.products.filteredItems.filter(
        (product) => product.id !== action.payload,
      );
    },
    updateProduct: (state, action) => {
      state.products.items = state.products.items.map((product) =>
        product._id === action.payload._id ? action.payload : product,
      );
      state.products.filteredItems = state.products.filteredItems.map(
        (product) =>
          product._id === action.payload._id ? action.payload : product,
      );
    },
    editProductStocks: (state, action) => {
      const { warehouseStocks, productionStocks } = action.payload;
      state.products.items = state.products.items.map((product) => {
        if (product._id === action.payload.productId) {
          return {
            ...product,
            warehouseStocks,
            productionStocks,
          };
        }
        return product;
      });
    },
    setManagers: (state, action) => {
      state.managers = action.payload;
    },
    sortProducts: (state, action) => {
      state.products.filteredItems = sortItems({
        items: state.products.filteredItems,
        sortBy: action.payload,
      });
    },
    filterProducts: (state, action) => {
      const { filters, sortBy } = action.payload;
      state.products.filteredItems = filterItems({
        _items: state.products.items,
        itemModelName: "Product",
        filters,
      });
      state.products.filteredItems = sortItems({
        items: state.products.filteredItems,
        sortBy,
      });
    },
    setMachines: (state, action) => {
      state.machines.items = action.payload;
      state.machines.filteredItems = sortItems({
        items: action.payload,
        sortBy: SORT_INIT_VALUE,
      });
    },
    setFacilities: (state, action) => {
      state.facilities.items = action.payload;
      state.facilities.filteredItems = sortItems({
        items: action.payload,
        sortBy: SORT_INIT_VALUE,
      });
    },
    sortFacilities: (state, action) => {
      state.facilities.filteredItems = sortItems({
        items: state.facilities.items,
        sortBy: action.payload,
      });
    },
    filterFacilities: (state, action) => {
      state.facilities.filteredItems = filterItems({
        _items: state.facilities.items,
        filters: action.payload,
      });
    },
    setSelectedFacility: (state, action) => {
      if (!state.facilities.items) return;
      state.facilities.selected = state.facilities.items.find(
        (f) => f.slug === action.payload,
      );
    },
    unselectFacility: (state) => {
      state.facilities.selected = null;
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
        state.isLoading = false;
      })
      .addCase(refreshProductsStocks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshProductsStocks.fulfilled, (state, action) => {
        state.productStocks.items = action.payload.productionStocks;
        state.productStocks.filteredItems = sortItems({
          items: action.payload.productionStocks,
          sortBy: SORT_INIT_VALUE,
        });
      })
      .addCase(refreshProductsStocks.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(refreshFacilities.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshFacilities.fulfilled, (state, action) => {
        state.facilities.items = action.payload;
        state.facilities.filteredItems = sortItems({
          items: action.payload,
          sortBy: SORT_INIT_VALUE,
        });
      })
      .addCase(refreshFacilities.rejected, (state, action) => {
        state.isLoading = false;
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

export const refreshProductsStocks = createAsyncThunk(
  "production/refreshProductsStocks",
  async (_, { dispatch }) => {
    const res = await api.get("/stocks");
    const data = res.data;
    return res.data.stocks;
  },
);

export const refreshFacilities = createAsyncThunk(
  "production/refreshFacilities",
  async (_, { dispatch }) => {
    const res = await api.get("/facilities");
    const data = res.data;
    return res.data.facilities;
  },
);

export const {
  setProducts,
  addProduct,
  removeProduct,
  updateProduct,
  setManagers,
  sortProducts,
  filterProducts,
  setMachines,
  setFacilities,
  sortFacilities,
  filterFacilities,
  setSelectedFacility,
  unselectFacility,
  editProductStocks,
} = productsSlice.actions;

export default productsSlice.reducer;
