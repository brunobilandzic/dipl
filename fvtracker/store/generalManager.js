import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  manager: null,
};

export const generalManagerSlice = createSlice({
  name: "generalManager",
  initialState: initialState,
  reducers: {
    setGeneralManager: (state, action) => {
      state.manager = action.payload;
    },
  },
});

export const { setGeneralManager } = generalManagerSlice.actions;
export default generalManagerSlice.reducer;
