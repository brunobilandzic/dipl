import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const cultivateSlice = createSlice({
  name: "cultivate",
  initialState,
  reducers: {
    createPlantage: (state, action) => {
      // action contains cultivation Id and plantage
      if (state.selectedField) {
        state.selectedField.cultivationAreas =
          state.selectedField?.cultivationAreas.map((ca) => {
            const cultivation = ca.cultivations.find(
              (cul) => cul._id === action.payload.cultivationId,
            );
            if (!cultivation) return ca;
            return {
              ...ca,
              plantedCropVarieties: cultivation.plantedCropVarieties.push(
                action.payload.newPlantage,
              ),
            };
          });
      }
      state.fields = state.fields?.map((field) => {
        if (field._id === state.selectedField._id) {
          return {
            ...field,
            cultivationAreas: field.cultivationAreas.map((ca) => {
              if (ca._id === state.selectedCultivationArea._id) {
                return {
                  ...ca,
                  cultivations: ca.cultivations.map((cul) => {
                    if (cul._id === action.payload.cultivationId) {
                      return {
                        ...cul,
                        plantedCropVarieties: cul.plantedCropVarieties.push(
                          action.payload.newPlantage,
                        ),
                      };
                    }
                    return cul;
                  }),
                };
              }
              return ca;
            }),
          };
        }
        return field;
      });
    },
  },
});

export const { createPlantage } = cultivateSlice.actions;

export default cultivateSlice.reducer;
