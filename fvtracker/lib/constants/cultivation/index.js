import colors from "./colors";
import {
  fieldDimensions,
  formInputs,
  cultivationAreaDimensionsInputs,
  dimensionsInputs,
  cultivationAreaDimensions,
} from "./field";

export default {
  colors: {
    ...colors,
  },
  field: {
    fieldDimensions,
    formInputs,
    cultivationAreaDimensionsInputs,
    dimensionsInputs,
    cultivationAreaDimensions,
  },
  names: {
    NEW_CULTIVATION: "Napravi novu kultivaciju",
    CHOOSE_CULTIVATION: "Odaberi kultivaciju",
    CULTIVATE_CELLS: "Kultiviraj ćelije",
    MANAGE_SEEDING: "Sadnja",
    EDIT_INFO: "Uredi",
    DELETE_CULTIVATION: "Obriši kultivaciju",
    HARVEST_CELLS: "Berba",
  },
  menuModes: {
    EDIT: "EDIT",
    EDIT_CULTVATIONS: "EDIT_CULTIVATIONS",
  }
};
