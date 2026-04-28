import { filterItems } from "@/lib/utils/list";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  warehouses: {
    items: null,
    filteredItems: null,
  },
  isLoading: false,
};

const warehousesSlice = createSlice({
  name: "warehouses",
  initialState,
  actions: {
    filterWarehouses: (state, action) => {
      state.warehouses.filteredItems = filterItems({
        _items: state.warehouses.items,
        filters: action.payload,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.warehouses.items = action.payload;
        state.warehouses.filteredItems = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchWarehouses.rejected, (state) => {
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

export default warehousesSlice.reducer;
