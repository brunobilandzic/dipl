import { fieldsList, fetchFieldBySlug, createField } from "./fields";
import {
  createCultivationArea,
  deleteCultivationArea,
  updateCultivationArea,
  getCultivationArea,
} from "./cultivationArea";
import { cropsData, getCropVarietyById, plantCropVariety } from "./plant";
import {
  createCultivation,
  getCultivationByProperty,
  updateCultivation,
  deleteCultivation,
} from "./cultivation";

export default {
  fields: {
    list: fieldsList,
    findBySlug: fetchFieldBySlug,
    create: createField,
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
    plant: plantCropVariety,
  },
  cultivations: {
    create: createCultivation,
    getByProperty: getCultivationByProperty,
    update: updateCultivation,
    delete: deleteCultivation,
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
