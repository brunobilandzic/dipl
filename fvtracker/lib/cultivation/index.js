import { fieldsList, fetchFieldBySlug, createField } from "./fields";
import {
  createCultivationArea,
  deleteCultivationArea,
  updateCultivationArea,
} from "./cultivationArea";
import { cropsData } from "./crops";

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
  },
};
