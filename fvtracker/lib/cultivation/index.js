import cultivation from "@/models/sectors/cultivation";
import { fieldsList, fetchFieldBySlug } from "./fields";
import { createCultivationArea } from "./cultivationArea";

export default {
  fields: {
    fieldsList,
    fetchFieldBySlug,
  },
  cultivationManager: {
  },
  cultivationArea: {
    create: createCultivationArea,
  },
};
