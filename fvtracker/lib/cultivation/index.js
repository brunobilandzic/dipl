import { fieldsList, fetchFieldBySlug, createField } from "./fields";
import { createCultivationArea } from "./cultivationArea";

export default {
  fields: {
    list: fieldsList,
    findBySlug: fetchFieldBySlug,
    create: createField,
  },
  cultivationManager: {},
  cultivationArea: {
    create: createCultivationArea,
  },
};
