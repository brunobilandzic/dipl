import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fields: [],
  loaded: false,
};

const fieldSlice = createSlice({
  name: "field",
  initialState: initialState,
  reducers: {
    setFields: (state, action) => {
      state.fields = action.payload;
      state.loaded = true;
    },
    setFieldInitialState: (state) => {
      state = initialState;
    },
  },
});

export const { setFields, setFieldInitialState } = fieldSlice.actions;
export default fieldSlice.reduc;
