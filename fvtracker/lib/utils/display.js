export const plCvColor = ({ plCvs, cell, fieldView }) => {
  const plCv = plCvs.find((plCv) => {
    if (fieldView) {
      return plCv.fieldCoords === cell;
    } else {
      return plCv.relativeCoords === cell;
    }
  });
  if (!plCv) return "";

  const color = plCv.cropVariety?.cropType?.color;
  const shade = plCv.cropVariety?.shade;
  if (color && shade) {
    return `bg-${color}-${shade}`;
  }
  return "bg-green-700";
};
