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
  },
});

export const { setFields, setInitialState } = cultivationSlice.actions;
export default cultivationSlice.reducer;