import { createFieldTimeMs, optimizedParamsArray } from "@/seed/data/fields";
import { createFields } from "./create/createFields";

export default {
  create: (fieldsParams = optimizedParamsArray, msWindow = createFieldTimeMs) =>
    createFields(fieldsParams, msWindow),
  FIELD_TIME_WINDOW: 1000 * 10,
};
