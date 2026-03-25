import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  generalManager: null,
};

export const generalManagerSlice = createSlice({
  name: "generalManager",
  initialState: initialState,
  reducers: {
    setGeneralManager: (state, action) => {
      state.generalManager = action.payload;
    },
  },
});

export const { setGeneralManager } = generalManagerSlice.actions;
export default generalManagerSlice.reducer;
