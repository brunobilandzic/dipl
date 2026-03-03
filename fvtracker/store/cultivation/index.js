import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fields: [],
  selectedField: null,
  crops: null,
  selectedCultivationArea: null,
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
      });
    },
    updateCultivationArea: (state, action) => {
      const updatedCA = action.payload;
      state.selectedField.cultivationAreas =
        state.selectedField.cultivationAreas.map((ca) =>
          ca._id === updatedCA._id ? updatedCA : ca,
        );
      state.fields = state.fields?.map((field) => {
        if (field._id === state.selectedField._id) {
          return {
            ...field,
            cultivationAreas: field.cultivationAreas.map((ca) =>
              ca._id === updatedCA._id ? updatedCA : ca,
            ),
          };
        }
        return field;
      });
    },
    deleteCultivationArea: (state, action) => {
      console.log("redux state deleting ca", action.payload);
      const id = action.payload;
      state.selectedField.cultivationAreas =
        state.selectedField.cultivationAreas.filter(
          (ca) => ca._id.toString() !== id,
        );
      state.fields = state.fields?.map((field) => {
        if (field._id === state.selectedField._id) {
          return {
            ...field,
            cultivationAreas: field.cultivationAreas.filter(
              (ca) => ca._id.toString() !== id,
            ),
          };
        }
        return field;
      });
    },
    setCrops: (state, action) => {
      state.crops = action.payload;
    },
    selectCultivationArea: (state, action) => {
      state.selectedCultivationArea = action.payload;
    },
    createCultivation: (state, action) => {
      const newCultivation = action.payload;
      const cultivationAreaId = newCultivation?.cultivationArea;

      if (!cultivationAreaId) return;

      if (state.selectedField?.cultivationAreas) {
        state.selectedField.cultivationAreas =
          state.selectedField.cultivationAreas.map((ca) => {
            if (ca._id?.toString() === cultivationAreaId?.toString()) {
              return {
                ...ca,
                cultivations: [...(ca.cultivations || []), newCultivation],
              };
            }
            return ca;
          });
      }

      state.fields = state.fields?.map((field) => ({
        ...field,
        cultivationAreas: (field.cultivationAreas || []).map((ca) => {
          if (ca._id?.toString() === cultivationAreaId?.toString()) {
            return {
              ...ca,
              cultivations: [...(ca.cultivations || []), newCultivation],
            };
          }
          return ca;
        }),
      }));
    },
    updateCultivation: (state, action) => {
      const updatedCultivation = action.payload;
      const cultivationId = updatedCultivation?._id;
      console.log("redux state updating cultivation", updatedCultivation);
      if (!cultivationId) return;

      if (state.selectedField?.cultivationAreas) {
        state.selectedField.cultivationAreas =
          state.selectedField.cultivationAreas.map((ca) => ({
            ...ca,
            cultivations: (ca.cultivations || []).map((cultivation) =>
              cultivation._id?.toString() === cultivationId?.toString()
                ? updatedCultivation
                : cultivation,
            ),
          }));
      }

      state.fields = state.fields?.map((field) => ({
        ...field,
        cultivationAreas: (field.cultivationAreas || []).map((ca) => ({
          ...ca,
          cultivations: (ca.cultivations || []).map((cultivation) =>
            cultivation._id?.toString() === cultivationId?.toString()
              ? updatedCultivation
              : cultivation,
          ),
        })),
      }));
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
  setCrops,
  selectCultivationArea,
  updateCultivationArea,
  updateCultivation,
  
} = cultivationSlice.actions;

export default cultivationSlice.reducer;
