function max_dim(d, dim) {
  return d.reduce(
    (max, cell) => (cell[dim] > max ? cell[dim] : max),
    d[0][dim],
  );
}

function min_dim(d, dim) {
  return d.reduce(
    (min, cell) => (cell[dim] < min ? cell[dim] : min),
    d[0][dim],
  );
}

function get_ca_min_max(ca) {
  if (ca.length === 0) {
    return { ca_max_y: 0, ca_min_x: 0, ca_max_x: 0, ca_min_y: 0 };
  }
  const ca_min_x = min_dim(ca, "row");
  const ca_max_x = max_dim(ca, "row");
  const ca_max_y = max_dim(ca, "col");
  const ca_min_y = min_dim(ca, "col");
  return { ca_min_x, ca_max_x, ca_min_y, ca_max_y };
}

function drawField(field) {
  const { width, length, cultivationAreas } = field;

  console.log("drawing grid:");
  for (let y = 0; y < length; y++) {
    let rowStr = "";
    for (let x = 0; x < width; x++) {
      if (
        cultivationAreas.some((ca) =>
          ca.some((point) => point.row === x && point.col === y),
        )
      ) {
        rowStr += "+";
      } else {
        rowStr += "-";
      }
    }
    console.log(rowStr);
  }
  console.log("Cultivation areas has", cultivationAreas.length, "cas");
  fieldFilledRatio(field);  
  console.log("CA coordinates:", allCoordinates(field));
}

function sum_points(field) {
  const { width, length } = field;
  return width * length;
}

function fieldCultivationAreaPoints(field) {
  return field.cultivationAreas.reduce(function (sum, ca) {
    return sum + ca.length;
  }, 0);
}

function allCoordinates(field) {
  const ca_coordinates = {};
  for (let i = 0; i < field.cultivationAreas.length; i++) {
    const ca = field.cultivationAreas[i];
    const dimensions = get_ca_min_max(ca);
    ca_coordinates[`cultivation area ${i}`] = dimensions;
  }

  return ca_coordinates;
}


function fieldFilledRatio(field) {
  const fieldPoints = sum_points(field);
  const caPoints = fieldCultivationAreaPoints(field);
  const ratio = caPoints / fieldPoints;
  console.log(
    `\n\tField points: ${fieldPoints}, CA points: ${caPoints}, Ratio: ${ratio}\n`,
  );
  return ratio;
}

export {
    drawField,
    get_ca_min_max,
    fieldFilledRatio
}
