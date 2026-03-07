import { format } from "date-fns";

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

export const showDate = (date) => {
  console.log("showDate called with:", date);
  if (!date) return "N/A";
  return format(new Date(date), "PPP");
};
