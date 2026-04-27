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