import createField from "./createField";

export default {
  create: (fieldParams, msWindow) => createField(fieldParams, msWindow),
  FIELD_TIME_WINDOW: 1000 * 10,
};
