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

export const locationInputs = {
  longitude: {
    label: "Geografska dužina",
    name: "longitude",
    type: "number",
    min: -180,
    max: 180,
  },
  latitude: {
    label: "Geografska širina",
    name: "latitude",
    type: "number",
    min: -90,
    max: 90,
  },
};

export const cultivationAreaDimensionsInputs = {
  min_ca_dim: {
    label: "Minimalna dimenzija područja za sadnju (m)",
    name: "min_ca_dim",
    type: "number",
    min: 1,
    max: 100,
  },
  max_ca_dim: {
    label: "Maksimalna dimenzija područja za sadnju (m)",
    name: "max_ca_dim",
    type: "number",
    min: 1,
    max: 100,
  },
  gap: {
    label: `Rastojanje između područja (m)`,
    name: "gap",
    type: "number",
    min: 0,
    max: 20,
  },
};
