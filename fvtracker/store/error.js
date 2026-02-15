import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    alertError: (state, action) => {
      alert(action.payload);
    },
    clearError: (state) => {
      state.message = null;
    },
  },
});


export const { alertError, clearError } = errorSlice.actions;

export default errorSlice.reducer;