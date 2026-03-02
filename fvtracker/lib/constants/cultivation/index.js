import colors from "./colors";
import {
  fieldDimensions,
  formInputs,
  locationInputs,
  cultivationAreaDimensionsInputs,
  dimensionsInputs,
  cultivationAreaDimensions,
  locationRanges,
} from "./field";

export default {
  colors: {
    selectedCABackGround: colors.selectedCABackGround,
  },
  field: {
    fieldDimensions,
    formInputs,
    locationInputs,
    cultivationAreaDimensionsInputs,
    dimensionsInputs,
    cultivationAreaDimensions,
    locationRanges,
  },
  names: {
    NEW_CULTIVATION: "Napravi novu kultivaciju",
    CHOOSE_CULTIVATION: "Odaberi kultivaciju",
  },
  menuModes: {
    EDIT: "EDIT",
    EDIT_CULTVATIONS: "EDIT_CULTIVATIONS",
  }
};
