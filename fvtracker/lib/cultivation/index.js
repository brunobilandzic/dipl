import {
  fieldsList,
  fetchFieldBySlug,
  createField,
  fetchFieldById,
  deletePlansFromFields,
} from "./fields";
import {
  createCultivationArea,
  deleteCultivationArea,
  updateCultivationArea,
  getCultivationArea,
} from "./cultivationArea";
import { createPlantage, cropsData, getCropVarietyById } from "./plant";
import {
  createCultivation,
  getCultivationByProperty,
  updateCultivation,
  deleteCultivation,
  getCultivationById,
} from "./cultivation";
import {
  createPlantingPlan,
  deletePlantingPlans,
  getPlantingPlanItemById,
  getPlantingPlanItemRecord,
} from "./plans";

export default {
  fields: {
    list: fieldsList,
    findBySlug: fetchFieldBySlug,
    create: createField,
    findById: fetchFieldById,
    deletePlans: deletePlansFromFields,
  },
  cultivationManager: {},
  cultivationArea: {
    create: createCultivationArea,
    update: updateCultivationArea,
    delete: deleteCultivationArea,
    get: getCultivationArea,
  },
  plants: {
    data: cropsData,
    fieldCropData: getFieldAndCropData,
    cropVariety: getCropVarietyById,
    create: createPlantage,
  },
  cultivations: {
    getById: getCultivationById,
    create: createCultivation,
    getByProperty: getCultivationByProperty,
    update: updateCultivation,
    delete: deleteCultivation,
  },
  plans: {
    deletePlantingPlans,
    createPlantingPlan,
    getPlantingPlanItemRecord,
    getPlantingPlanItemById,
  },
};

async function getFieldAndCropData() {
  const fields = await fieldsList();
  fields.forEach(async (field) => {
    await field.populate({ path: "cultivationAreas" });
  });
  const cropData = await cropsData();
  return { fields, cropData };
}
