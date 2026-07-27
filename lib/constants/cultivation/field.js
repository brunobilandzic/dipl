export const fieldDimensions = {
  MIN_FIELD_DIMENSION: 20,
  MAX_FIELD_DIMENSION: 200,
};

export const cultivationAreaDimensions = {
  MIN_CA_DIMENSION: 10,
  MAX_CA_DIMENSION: 1000,
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
];

export const dimensionsInputs = {
  width: {
    label: `Širina (m) ${fieldDimensions.MIN_FIELD_DIMENSION} - ${fieldDimensions.MAX_FIELD_DIMENSION}`,
    name: "width",
    type: "number",
    min: fieldDimensions.MIN_FIELD_DIMENSION,
    max: fieldDimensions.MAX_FIELD_DIMENSION,
  },
  length: {
    label: `Dužina (m) ${fieldDimensions.MIN_FIELD_DIMENSION} - ${fieldDimensions.MAX_FIELD_DIMENSION}`,
    name: "length",
    type: "number",
    min: fieldDimensions.MIN_FIELD_DIMENSION,
    max: fieldDimensions.MAX_FIELD_DIMENSION,
  },
};

export const cultivationAreaDimensionsInputs = {
  min_ca_dim: {
    label: "Minimalna dimenzija područja za sadnju (m)",
    name: "min_ca_dim",
    type: "number",
    min: cultivationAreaDimensions.MIN_CA_DIMENSION,
    max: cultivationAreaDimensions.MAX_CA_DIMENSION,
  },
  max_ca_dim: {
    label: "Maksimalna dimenzija područja za sadnju (m)",
    name: "max_ca_dim",
    type: "number",
    min: cultivationAreaDimensions.MIN_CA_DIMENSION,
    max: cultivationAreaDimensions.MAX_CA_DIMENSION,
  },
  gap: {
    label: `Rastojanje između područja (m)`,
    name: "gap",
    type: "number",
    min: 0,
    max: 20,
  },
};

export const MAX_CULTIVATION_SIZE = 15;
