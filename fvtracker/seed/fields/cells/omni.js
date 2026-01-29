import cells from "./constants.js";

function allCoordinates(field) {
  const ca_coordinates = {};
  console.log("Field cultivation areas:", field.cultivationAreas);
  for (let i = 0; i < field.cultivationAreas.length; i++) {
    console.log("ca:", field.cultivationAreas[i]);  
    const ca = field.cultivationAreas[i];
    const dimensions = cells.get_ca_min_max(ca);
    ca_coordinates[`cultivation area ${i}`] = dimensions;
  }

  console.log("CA coordinates:", ca_coordinates);
  return ca_coordinates;
}

const field = cells.fieldExample
console.log(field)
allCoordinates(cells.fieldExample);