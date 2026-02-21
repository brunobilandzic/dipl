import { fieldsList, fetchFieldBySlug, createField } from "./fields";
import {
  createCultivationArea,
  deleteCultivationArea,
  updateCultivationArea,
} from "./cultivationArea";
import { cropsData } from "./plant";

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
  },
  crops: {
    data: cropsData,
    fieldCropData: getFieldAndCropData,
    cropVariety: getCropVarietyById,
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
