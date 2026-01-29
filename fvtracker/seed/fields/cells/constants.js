const gap = 4;
const min_ca_dim = 4;
const max_ca_dim = 20;

const length_options = [];
for (let i = min_ca_dim; i <= max_ca_dim; i++) {
  length_options.push(i);
}

const max_dim = (d, dim) => {
  return d.reduce(
    (max, cell) => (cell[dim] > max ? cell[dim] : max),
    d[0][dim],
  );
};

const min_dim = (d, dim) => {
  return d.reduce(
    (min, cell) => (cell[dim] < min ? cell[dim] : min),
    d[0][dim],
  );
};
function get_ca_min_max(ca) {
  if (ca.length === 0) {
    return { ca_max_y: 0, ca_min_x: 0, ca_max_x: 0, ca_min_y: 0 };
  }
  const ca_min_x = min_dim(ca, "row");
  const ca_max_x = max_dim(ca, "row");
  const ca_max_y = max_dim(ca, "col");
  const ca_min_y = min_dim(ca, "col");
  return { ca_max_y, ca_min_x, ca_max_x, ca_min_y };
}

const casExample = [
  { row: 0, col: 0 },
  { row: 0, col: 1 },
  { row: 0, col: 2 },

  { row: 1, col: 0 },
  { row: 1, col: 1 },
  { row: 1, col: 2 },

  { row: 2, col: 0 },
  { row: 2, col: 1 },
  { row: 2, col: 2 },
];

const fieldExample = {
  f_width: 30,
  f_length: 30,
  cultivationAreas: [casExample],
};

export {
  get_ca_min_max,
  fieldExample,
  length_options,
  max_ca_dim,
  min_ca_dim,
  gap,
};
