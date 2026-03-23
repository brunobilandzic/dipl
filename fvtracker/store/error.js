import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  error: null,
  message: null,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload.error;
      state.message = action.payload.message;
    },
    clearError: (state) => {
      state = initialState;
    },
  },
});

export const { alertError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
