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
      console.log("Setting products in Redux:", action.payload);
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
      if(!state.facilities.items) return;
      state.facilities.selected = state.facilities.items.find((f) => f.slug === action.payload.slug);
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
        state.productStocks.items = action.payload;
        state.productStocks.filteredItems = sortItems({
          items: action.payload,
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
    console.log("Fetching product stocks...");
    const res = await api.get("/stocks");
    const data = res.data;
    console.log(data);
    return res.data.stocks;
  },
);

export const refreshFacilities = createAsyncThunk(
  "production/refreshFacilities",
  async (_, { dispatch }) => {
    console.log("Fetching production facilities...");
    const res = await api.get("/facilities");
    const data = res.data;
    console.log(data);
    return res.data.facilities;
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
  setMachines,
  setFacilities,
  sortFacilities,
  filterFacilities,
  setSelectedFacility,
} = productsSlice.actions;

export default productsSlice.reducer;
