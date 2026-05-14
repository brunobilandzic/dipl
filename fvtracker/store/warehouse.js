import api from "@/lib/api";
import { filterItems, sortItems } from "@/lib/utils/list";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  warehouses: {
    items: [],
    filteredItems: [],
  },
  warehouseRequests: null,
  isLoading: false,
};

const warehousesSlice = createSlice({
  name: "warehouses",
  initialState,
  reducers: {
    filterWarehouses: (state, action) => {
      state.warehouses.filteredItems = filterItems({
        _items: state.warehouses.items,
        filters: action.payload,
      });
    },
    sortWarehouses: (state, action) => {
      state.warehouses.filteredItems = sortItems({
        items: state.warehouses.filteredItems,
        sortBy: action.payload,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        console.log("Updating state with fetched warehouses:", action.payload);
        state.warehouses.items = action.payload;
        state.warehouses.filteredItems = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchWarehouses.rejected, (state) => {
        alert("Greška prilikom dohvaćanja skladišta.");
        state.isLoading = false;
      })
      .addCase(fetchWarehouseRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWarehouseRequests.fulfilled, (state, action) => {
        state.warehouseRequests = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchWarehouseRequests.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const fetchWarehouses = createAsyncThunk(
  "warehouses/fetchWarehouses",
  async (_, { dispatch }) => {
    console.log("Fetching warehouses...");
    const res = await api.get("/warehouses");
    console.log("Warehouses fetched successfully:", res.data);
    return res.data.warehouses;
  },
);
export const fetchWarehouseRequests = createAsyncThunk(
  "warehouses/fetchWarehouseRequests",
  async (_, { dispatch }) => {
    console.log("Fetching warehouse requests...");
    const res = await api.get("/warehouse-requests");
    console.log("Warehouse requests fetched:", res.data);
    return res.data.warehouseRequests;
  },
);
export const { filterWarehouses, sortWarehouses } = warehousesSlice.actions;

export default warehousesSlice.reducer;
