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
    },
    emptyCultivation: () => ({ ...initialState }),
    createCultivationArea: (state, action) => {
      state.selectedField.cultivationAreas.push(action.payload);
      state.fields = state.fields.map((field) => {
        if (field._id === action.payload.field) {
          return {
            ...field,
            cultivationAreas: [...field.cultivationAreas, action.payload],
          };
        }
        return field;
      })
    },
  },
});

export const {
  setFields,
  setInitialState,
  selectField,
  emptyCultivation,
  createCultivationArea,
} = cultivationSlice.actions;
export default cultivationSlice.reducer;
