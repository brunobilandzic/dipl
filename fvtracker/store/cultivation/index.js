import { SORT_INIT_VALUE } from "@/lib/constants/others";
import { filterItems, sortItems } from "@/lib/utils/list";
import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  fields: null,
  filteredFields: null,
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
      state.filteredFields = sortItems({
        items: action.payload,
        sortBy: SORT_INIT_VALUE,
      });
    },
    deleteField: (state, action) => {
      const slug = action.payload;
      state.fields = state.fields.filter((field) => field.slug !== slug);
      state.filteredFields = state.filteredFields.filter(
        (field) => field.slug !== slug,
      );
      if (state.selectedField?.slug === slug) {
        state.selectedField = null;
      }
    },
    setFieldUpdated: (state, action) => {
      const { fieldId } = action.payload;
      const fields = setUpdatedField({ fields: state.fields, fieldId });
      state.fields = fields;
      state.filteredFields = fields;
    },
    sortFields: (state, action) => {
      const sortBy = action.payload;
      state.filteredFields = sortItems({ items: state.filteredFields, sortBy });
    },
    filterFields: (state, action) => {
      state.filteredFields = filterItems({
        _items: state.fields,
        itemModelName: "Field",
        filters: action.payload,
      });
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
    addMainType: (state, action) => {
      if (!state.crops) return;
      state.crops.mainTypes.push(action.payload.mainType);
    },
    addGeneralType: (state, action) => {
      if (!state.crops) return;
      state.crops.generalTypes.push(action.payload.generalType);
    },
    addCropType: (state, action) => {
      const { type, varieties } = action.payload;
      if (!state.crops) return;
      state.crops.types.push(type);
      state.crops.varieties.push(...varieties);
    },
    addCropVariety: (state, action) => {
      if (!state.crops) return;
      state.crops.varieties.push(action.payload.variety);
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
            if (ca._id?.toString() === cultivationAreaId.toString()) {
              const cultivationExists = (ca.cultivations || []).some(
                (cul) => cul._id === newCultivation._id,
              );

              let updatedCultivations = ca.cultivations || [];

              if (!cultivationExists) {
                updatedCultivations = [...updatedCultivations, newCultivation];
              } else {
                updatedCultivations = updatedCultivations.map((cul) =>
                  cul._id === newCultivation._id ? newCultivation : cul,
                );
              }

              return {
                ...ca,
                cultivations: updatedCultivations,
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
      const { cultivationId, newPlantage, cropVarietyId, plantageWork } =
        action.payload;
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

        break;
      }

      //available plans come from fields not selected field
      const fieldName = state.selectedField.name;
      const fid = state.fields.findIndex((f) => f.name === fieldName);

      for (const plantingPlan of state.fields[fid].plantingPlans) {
        const pItemId = plantingPlan.items.findIndex(
          (item) => item.cropVariety._id === cropVarietyId,
        );

        if (pItemId !== -1 && pItemId !== undefined) {
          plantingPlan.items[pItemId].quantity -=
            newPlantage.length *
            plantingPlan.items[pItemId].cropVariety.quantityPerCell;
          if (!plantingPlan.items[pItemId].plantedCropVarieties) {
            plantingPlan.items[pItemId].plantedCropVarieties = [];
          }
          plantingPlan.items[pItemId].plantedCropVarieties.push(...newPlantage);
        }
      }

      // sati radova na sadnji (report čita radove iz state.fields kultivacija)
      if (plantageWork) {
        for (const ca of state.fields[fid].cultivationAreas || []) {
          const cult = ca.cultivations?.find((c) => c._id === cultivationId);
          if (cult) {
            if (!cult.plantageWorks) cult.plantageWorks = [];
            cult.plantageWorks.push(plantageWork);
            break;
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
    createHarvestingPlan: (state, action) => {
      const newPlan = action.payload;
      const fieldId = newPlan.field._id;

      const field = state.fields.find((f) => f._id === fieldId);
      if (field) {
        field.harvestingPlans = [...(field.harvestingPlans || []), newPlan];
      }
    },
    harvestCells: (state, action) => {
      // reverce createPlantage logic
      const {
        cultivationId,
        harvestedCropVarieties,
        cropVarietyId,
        quality,
        quantity,
        harvestWork,
      } = action.payload;
      if (!state.selectedField) return;

      for (const ca of state.selectedField.cultivationAreas) {
        const cultivation = ca.cultivations.find(
          (c) => c._id === cultivationId,
        );
        if (!cultivation) continue;

        for (const harvested of harvestedCropVarieties) {
          for (const pcv of cultivation.plantedCropVarieties) {
            if (pcv._id === harvested._id) {
              pcv.plantingPlanItem = null;
              pcv.harvestedAt = harvested.harvestedAt;
              pcv.harvestingPlanItem = harvested.harvestingPlanItem;
            }
          }
        }
      }

      //available plans come from fields not selected field
      const fieldName = state.selectedField.name;
      const fid = state.fields.findIndex((f) => f.name === fieldName);
      const field = state.fields[fid];

      if (harvestWork) {
        for (const ca of field.cultivationAreas || []) {
          const cult = ca.cultivations?.find((c) => c._id === cultivationId);
          if (cult) {
            if (!cult.harvestWorks) cult.harvestWorks = [];
            cult.harvestWorks.push(harvestWork);
            break;
          }
        }
      }

      for (const harvestingPlan of field.harvestingPlans) {
        const pItemId = harvestingPlan.items.findIndex(
          (item) => item.cropVariety._id === cropVarietyId,
        );

        if (pItemId !== -1 && pItemId !== undefined) {
          harvestingPlan.items[pItemId].quantity -=
            harvestedCropVarieties.length *
            harvestingPlan.items[pItemId].cropVariety.quantityPerCell;
          if (!harvestingPlan.items[pItemId].plantedCropVarieties) {
            harvestingPlan.items[pItemId].plantedCropVarieties = [];
          }
          harvestingPlan.items[pItemId].plantedCropVarieties.push(
            ...harvestedCropVarieties,
          );
        }
      }

      // update batch items
      field.harvestingPlans.map((hp) => {
        const harvestingBatch = hp.harvestingBatch;
        const batchItemId = harvestingBatch.harvestingBatchItems.findIndex(
          (item) =>
            item.cropVariety._id === cropVarietyId && item.quality === quality,
        );
        if (batchItemId !== -1 && batchItemId !== undefined) {
          harvestingBatch.harvestingBatchItems[
            batchItemId
          ].plantedCropVarieties.push(...harvestedCropVarieties);
          harvestingBatch.harvestingBatchItems[batchItemId].batchQuantity +=
            quantity;
        }
      });
    },
  },
});

export const {
  setFields,
  setInitialState,
  selectField,
  addField,
  sortFields,
  emptyCultivation,
  createCultivationArea,
  deleteCultivationArea,
  setCrops,
  addMainType,
  addGeneralType,
  addCropType,
  addCropVariety,
  selectCultivationArea,
  updateCultivationArea,
  createCultivation,
  updateCultivation,
  deleteCultivation,
  createPlantage,
  createPlantingPlan,
  createHarvestingPlan,
  deleteField,
  harvestCells,
  filterFields,
  setFieldUpdated,
} = cultivationSlice.actions;

export default cultivationSlice.reducer;
