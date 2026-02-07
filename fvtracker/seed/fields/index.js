import createField from "./createField";
import { createFields } from "./createFields";

export default {
  create: (fieldsParams, msWindow) => createFields(fieldsParams, msWindow),
  FIELD_TIME_WINDOW: 1000 * 10,
};
