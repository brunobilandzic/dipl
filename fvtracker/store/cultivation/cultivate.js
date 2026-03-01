import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cultivationPressed: false,
  promptDelete: false,
  cellPressed: null,
};

export const cultivateSlice = createSlice({
  name: "cultivate",
  initialState,
  reducers: {
    setCultivationPressed: (state, action) => {
      state.cultivationPressed = action.payload;
    },
    setPromptDelete: (state, action) => {
      state.promptDelete = action.payload;
    },
    setCellPressed: (state, action) => {
      state.cellPressed = action.payload;
    },
  },
});

export const { setCultivationPressed, setPromptDelete, setCellPressed } = cultivateSlice.actions;

export default cultivateSlice.reducer;