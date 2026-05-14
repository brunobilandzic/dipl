import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  warehouseManagers: null,
  financialManagers: null,
  productionManagers: null,
  cultivationManagers: null,
  generalManager: null,
  isLoading: false,
};

export const managersSlice = createSlice({
  name: "managers",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fillManagersSelection.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fillManagersSelection.fulfilled, (state, action) => {
      const { managers, managersType } = action.payload;
      state[`${managersType}`] = managers;
      state.isLoading = false;
    });
    builder.addCase(fillManagersSelection.rejected, (state, action) => {
      alert("Greška prilikom dohvaćanja menadžera.");
      state.isLoading = false;
    });
  },
});

export const fillManagersSelection = createAsyncThunk(
  "managers/fillManagersSelection",
  async ({ managersType }, { dispatch }) => {
    const res = await api.get(`/managers?managersType=${managersType}`);
    return { managers: res.data.managers, managersType };
  },
);

export default managersSlice.reducer;
