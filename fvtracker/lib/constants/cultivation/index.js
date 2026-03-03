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
    CULTIVATE_CELLS: "Kultiviraj ćelije",
    MANAGE_SEEDING: "Upravljaj sadnjom",
  },
  menuModes: {
    EDIT: "EDIT",
    EDIT_CULTVATIONS: "EDIT_CULTIVATIONS",
  }
};
