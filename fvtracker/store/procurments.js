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
    updateProcurmentStatus: (state, action) => {
      const { procurmentId, newStatus } = action.payload;
      const procIndex = state.items.findIndex((p) => p._id === procurmentId);
      if (procIndex !== -1) {
        state.items[procIndex].status = newStatus;
        const filteredIndex = state.filteredItems.findIndex(
          (p) => p._id === procurmentId,
        );
        if (filteredIndex !== -1) {
          state.filteredItems[filteredIndex].status = newStatus;
        }
      }
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

export const { addProcurment, updateProcurmentStatus } = procurmentsSlice.actions;
export default procurmentsSlice.reducer;
