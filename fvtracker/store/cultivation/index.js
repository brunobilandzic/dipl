import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fields: null,
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
    deleteField: (state, action) => {
      const slug = action.payload;
      state.fields = state.fields.filter((field) => field.slug !== slug);
      if (state.selectedField?.slug === slug) {
        state.selectedField = null;
      }
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
    deleteCultivation: (state, action) => {
      const cultivationId = action.payload;

      if (!cultivationId) return;

      if (state.selectedField?.cultivationAreas) {
        state.selectedField.cultivationAreas =
          state.selectedField.cultivationAreas.map((ca) => ({
            ...ca,
            cultivations: (ca.cultivations || []).filter(
              (cultivation) =>
                cultivation._id?.toString() !== cultivationId?.toString(),
            ),
          }));
      }

      state.fields = state.fields?.map((field) => ({
        ...field,
        cultivationAreas: (field.cultivationAreas || []).map((ca) => ({
          ...ca,
          cultivations: (ca.cultivations || []).filter(
            (cultivation) =>
              cultivation._id?.toString() !== cultivationId?.toString(),
          ),
        })),
      }));
    },
    createPlantage: (state, action) => {
      const { cultivationId, newPlantage } = action.payload;

      if (!state.selectedField) return;
      for (const ca of state.selectedField.cultivationAreas) {
        const cultivation = ca.cultivations.find(
          (c) => c._id === cultivationId,
        );
        if (!cultivation) continue;

        for (const plantage of newPlantage) {
          const idx = cultivation.plantedCropVarieties?.findIndex(
            (pcv) => pcv._id === plantage._id,
          );
          if (idx !== -1 && idx !== undefined) {
            if (!cultivation.plantedCropVarieties[idx].plantingPlanItem) {
              cultivation.plantedCropVarieties[idx].plantingPlanItem = {};
            }
            cultivation.plantedCropVarieties[idx].plantingPlanItem = {
              ...cultivation.plantedCropVarieties[idx].plantingPlanItem,
              ...plantage.plantingPlanItem,
            };
          }
        }
      }
    },
    createPlantingPlan: (state, action) => {
      const newPlan = action.payload;
      const fieldId = newPlan.field._id;

      const field = state.fields.find((f) => f._id === fieldId);
      if (field) {
        field.plantingPlans = [...(field.plantingPlans || []), newPlan];
      }
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
  createCultivation,
  updateCultivation,
  deleteCultivation,
  createPlantage,
  createPlantingPlan,
  deleteField,
} = cultivationSlice.actions;

export default cultivationSlice.reducer;
