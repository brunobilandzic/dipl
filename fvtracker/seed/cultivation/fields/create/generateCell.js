export function randomPoint(field) {
  const { width, length, min_ca_dim, max_ca_dim } = field;

  const length_options = [];
  for (let i = min_ca_dim; i <= max_ca_dim; i++) {
    length_options.push(i);
  }

  let x = Math.floor(Math.random() * width) + 1;
  let y = Math.floor(Math.random() * length) + 1;
  let dim_x = length_options[Math.floor(Math.random() * length_options.length)];
  let dim_y = length_options[Math.floor(Math.random() * length_options.length)];

  return { x, y, dim_x, dim_y };
}

export function notValidPoint(field, x, y, dim_x, dim_y) {
  let { width, length, cultivationAreas, gap } = field;
  const plantedCells = cultivationAreas.reduce(
    (arr, ca) => (arr = arr.concat(ca.planted)),
    [],
  );

  if (x < 0 || y < 0 || x + dim_x > width || y + dim_y > length) {
    return true;
  }

  for (let xi = x; xi <= x + dim_x + gap; xi++) {
    for (let yi = y; yi <= y + dim_y + gap; yi++) {
      for (let plantedCell of plantedCells) {
        if (plantedCell === `${xi},${yi}`) {
          return true;
        }
      }
    }
    for (let yi = y; yi >= y - gap; yi--) {
      for (let plantedCell of plantedCells) {
        if (plantedCell === `${xi},${yi}`) {
          return true;
        }
      }
    }
  }

  for (let xi = x; xi >= x - gap; xi--) {
    for (let yi = y; yi <= y + dim_y + gap; yi++) {
      for (let plantedCell of plantedCells) {
        if (plantedCell === `${xi},${yi}`) {
          return true;
        }
      }
    }
  }

  return false;
}
