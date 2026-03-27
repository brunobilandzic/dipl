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

  if (!plCv || plCv.harvestedAt) return { cropVariety: null, color: "" };

  const color = plCv.plantingPlanItem?.cropVariety?.cropType?.color;
  const shade = plCv.plantingPlanItem?.cropVariety?.shade;
  if (color && shade) {
    return {
      cropVariety: plCv.plantingPlanItem?.cropVariety,
      color: `bg-${color}-${shade}`,
    };
  }
  return {
    cropVariety: null,
    color: colors.cultivation.defaultPlCvColor,
  };
};

export const showDate = (date) => {
  if (!date) return "N/A";
  return format(new Date(date), "PPP");
};
