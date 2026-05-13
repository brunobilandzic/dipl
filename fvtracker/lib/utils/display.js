import { format } from "date-fns";
import { hr } from "date-fns/locale";
import colors from "../constants/cultivation/colors";
import { titleCaseString } from "./strings";

export const cvAndColor = ({ plCvs, cell, fieldView }) => {
  const plCv = plCvs.find((plCv) => {
    if (fieldView) {
      return plCv.fieldCoords === cell;
    } else {
      return plCv.relativeCoords === cell;
    }
  });

  if (!plCv) return { cropVariety: null, color: "" };

  const color = plCv.plantingPlanItem?.cropVariety?.cropType?.color;
  const shade = plCv.plantingPlanItem?.cropVariety?.shade;
  if (color && shade && !plCv.harvestedAt) {
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
  return format(new Date(date), "PPP", { locale: hr });
};

export const showDateTime = (date) => {
  if (!date) return "N/A";
  return format(new Date(date), "PPP p", { locale: hr });
};

export const getName = ({ name, surname }) => {
  return titleCaseString(`${name} ${surname}`);
};
