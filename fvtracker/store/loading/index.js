import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      console.log("Setting loading state to", action.payload);
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading, setError, clearError } = loadingSlice.actions;
export default loadingSlice.reducer;
