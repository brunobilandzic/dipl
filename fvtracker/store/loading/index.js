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
      console.log("Setting loading state to", action.payload);
      state.isLoading = action.payload;
    },
    setSeedLoading: (state, action) => {
      console.log("Setting seed loading state to", action.payload);
      state.seedLoading = action.payload;
    },

  },
});

export const { setLoading, setSeedLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
