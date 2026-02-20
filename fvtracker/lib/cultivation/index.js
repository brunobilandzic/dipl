import { fieldsList, fetchFieldBySlug, createField } from "./fields";
import { createCultivationArea, updateCultivationArea } from "./cultivationArea";

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
  },
};
