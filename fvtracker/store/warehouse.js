import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchWarehouses = createAsyncThunk(
  "warehouses/fetchWarehouses",
  async (_, { dispatch }) => {
    console.log("Fetching warehouses...");
    const res = await api.get("/warehouses");
    console.log("Warehouses fetched successfully:", res.data);
    return res.data.warehouses;
  },
);
