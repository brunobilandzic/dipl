import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  seedLoading: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSeedLoading: (state, action) => {
      state.seedLoading = action.payload;
    },

  },
});

export const { setLoading, setSeedLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
