export const plCvColor = ({ plCvs, cell }) => {
  const plCv = plCvs.find((plCv) => plCv.relativeCoords === cell);
  if (!plCv) return "";

  const color = plCv.cropVariety?.cropType?.color;
  const shade = plCv.cropVariety?.shade;
  if (color && shade) {
    return `bg-${color}-${shade}`;
  }
  return "bg-green-700";
};
