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
    selectField: (state, action) => {
      const slug = action.payload;
      state.selectedField = state.fields.find((field) => field.slug === slug);
    },
    setFieldInitialState: (state) => {
      state = initialState;
    },
  },
});

export const { setFields, setFieldInitialState } = fieldSlice.actions;
export default fieldSlice.reducer;
