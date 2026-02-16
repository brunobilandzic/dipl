import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fields: [],
};

const cultivationSlice = createSlice({
  name: "cultivation",
  initialState: initialState,
  reducers: {
    setFields: (state, action) => {
      state.fields = action.payload;
    },
    setInitialState: (state) => {
      state = initialState;
    },
    selectField: (state, action) => {
      state.selectedField = action.payload;
    }
  },
});

export const { setFields, setInitialState, selectField } = cultivationSlice.actions;
export default cultivationSlice.reducer;