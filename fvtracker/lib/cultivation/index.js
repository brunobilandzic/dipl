import { fieldsList, fetchFieldBySlug, createField } from "./fields";
import { createCultivationArea } from "./cultivationArea";

export default {
  fields: {
    fieldsList,
    fetchFieldBySlug,
    create: createField,
  },
  cultivationManager: {},
  cultivationArea: {
    create: createCultivationArea,
  },
};
