import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {},
});

export const {} = salesSlice.actions;
export default salesSlice.reducer;
