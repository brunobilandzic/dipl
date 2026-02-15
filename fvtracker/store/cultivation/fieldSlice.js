import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fields: [],
};

const fieldSlice = createSlice({
  name: "fields",
  initialState: initialState,
  reducers: {
    setFields: (state, action) => {
      state.fields = action.payload;
    },
    setFieldInitialState: (state) => {
      state = initialState;
    },
  },
});

export const { setFields, setFieldInitialState } = fieldSlice.actions;
export default fieldSlice.reducer;
