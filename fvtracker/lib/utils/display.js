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

  if (!plCv) return { cropVariety: null, color: "" };

  const color = plCv.cropVariety?.cropType?.color;
  const shade = plCv.cropVariety?.shade;
  if (color && shade) {
    return { cropVariety: plCv.cropVariety, color: `bg-${color}-${shade}` };
  }
  return {
    cropVariety: plCv.cropVariety,
    color: colors.cultivation.defaultPlCvColor,
  };
};

export const showDate = (date) => {
  if (!date) return "N/A";
  return format(new Date(date), "PPP");
};
