export const fieldDimensions = {
  MIN_FIELD_DIMENSION: 20,
  MAX_FIELD_DIMENSION: 200,
};

(label,
  name,
  (type = "text"),
  value,
  onChange,
  placeholder,
  (wrapStyle = ""),
  (inputStyle = ""),
  min,
  max);

export const formInputs = (onChange) => [
  {
    label: "Ime parcele",
    name: "name",
    type: "text",
    placeholder: "Unesi ime parcele",
    onChange,
  },
  {
    label: "Opis parcele",
    name: "description",
    type: "text",
    placeholder: "Unesi opis parcele",
    onChange,
  },
];
