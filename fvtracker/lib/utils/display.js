import { format } from "date-fns";
import colors from "../constants/cultivation/colors";

export const cvAndColor = ({ plCvs, cell, fieldView }) => {
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
    return { cropVariety: plCv.cropVariety, className: `bg-${color}-${shade}` };
  }
  return colors.cultivation.defaultPlCvColor;
};

export const showDate = (date) => {
  if (!date) return "N/A";
  return format(new Date(date), "PPP");
};
