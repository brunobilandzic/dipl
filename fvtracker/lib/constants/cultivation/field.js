export const fieldDimensions = {
  MIN_FIELD_DIMENSION: 20,
  MAX_FIELD_DIMENSION: 200,
};

export const formInputs = [
  {
    label: "Ime parcele",
    name: "name",
    type: "text",
    placeholder: "Unesi ime parcele",
  },
  {
    label: "Opis parcele",
    name: "description",
    type: "textarea",
    placeholder: "Unesi opis parcele",
  },
  {
    label: `Širina (m) ${fieldDimensions.MIN_FIELD_DIMENSION} - ${fieldDimensions.MAX_FIELD_DIMENSION}`,
    name: "width",
    type: "number",
    min: fieldDimensions.MIN_FIELD_DIMENSION,
    max: fieldDimensions.MAX_FIELD_DIMENSION,
  },
  {
    label: `Dužina (m) ${fieldDimensions.MIN_FIELD_DIMENSION} - ${fieldDimensions.MAX_FIELD_DIMENSION}`,
    name: "length",
    type: "number",
    min: fieldDimensions.MIN_FIELD_DIMENSION,
    max: fieldDimensions.MAX_FIELD_DIMENSION,
  },
];

export const locationInputs = [
  {
    label: "Geografska dužina",
    name: "longitude",
    type: "number",
    min: -180,
    max: 180,
  },
  {
    label: "Geografska širina",
    name: "latitude",
    type: "number",
    min: -90,
    max: 90,
  },
];
