import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fields: [],
  selectedField:null,
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
    addField: (state, action) => {
      state.fields.push(action.payload);
    },
    emptyCultivation: () => ({ ...initialState }),
    createCultivationArea: (state, action) => {
      state.selectedField?.cultivationAreas.push(action.payload);
      state.fields = state.fields?.map((field) => {
        if (field._id === action.payload.field) {
          return {
            ...field,
            cultivationAreas: [...field.cultivationAreas, action.payload],
          };
        }
        return field;
      })
    },
    deleteCultivationArea: (state, action) => {
      console.log("redux state deleting ca", action.payload);
      const id  = action.payload;
      state.selectedField.cultivationAreas = state.selectedField.cultivationAreas.filter(
        (ca) => ca._id.toString() !== id
      );
      state.fields = state.fields?.map((field) => {
        if (field._id === state.selectedField._id) {
          return {
            ...field,
            cultivationAreas: field.cultivationAreas.filter((ca) => ca._id.toString() !== id),
          };
        }
        return field;
      });
    },
  },
});

export const {
  setFields,
  setInitialState,
  selectField,
  addField,
  emptyCultivation,
  createCultivationArea,
  deleteCultivationArea,
} = cultivationSlice.actions;
export default cultivationSlice.reducer;
