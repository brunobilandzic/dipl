import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  filteredItems: [],
};

const procurmentsSlice = createSlice({
  name: "procurments",
  initialState,
  reducers: {
    addProcurment: (state, action) => {
      console.log("Adding new procurment to store:", action.payload);
      state.items.push(action.payload);
      state.filteredItems.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProcurments.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchProcurments.fulfilled, (state, action) => {
      state.items = action.payload;
      state.filteredItems = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchProcurments.rejected, (state) => {
      alert("Greška prilikom dohvaćanja nabavki.");
      state.isLoading = false;
    });
  },
});

export const fetchProcurments = createAsyncThunk(
  "procurments/fetchProcurments",
  async (_, { dispatch }) => {
    const res = await api.get("/procurments");
    return res.data.procurments;
  },
);

export const { addProcurment } = procurmentsSlice.actions;
export default procurmentsSlice.reducer;
