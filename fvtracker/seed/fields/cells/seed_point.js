const gap = 4;
const min_ca_dim = 4;
const max_ca_dim = 20;

const FILL_LAST = "FILL_LAST";
import lodash from "lodash";

function startRandomDecision() {
  return Math.random() < 0.7; // 70% chance to start a new cultivation area
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

function sum_points(field) {
  const { f_width, f_length } = field;
  return f_width * f_length;
}

function fieldCultivationAreaPoints(field) {
  return field.cultivationAreas.reduce(function (sum, ca) {
    return sum + ca.length;
  }, 0);
}

function cultivationAreaPoints(ca) {
  return ca.length;
}

function furthestPoint(field) {
  const { cultivationAreas } = field;
  let max_row = 0;
  let max_col = 0;

  for (const ca of cultivationAreas) {
    for (const cell of ca) {
      if (cell.row > max_row) {
        max_row = cell.row;
      }
      if (cell.col > max_col) {
        max_col = cell.col;
      }
    }
  }
  console.log("Furthest point in field:", max_row, max_col);
  return { row: max_row, col: max_col };
}

function checkFieldEnd(field) {
  const { f_width, f_length } = field;
  const furthest = furthestPoint(field);
  console.log("test1", f_width - gap - min_ca_dim >= furthest.row);
  console.log("test2", f_length - gap - min_ca_dim >= furthest.col);
  if (!endOfRow(field) && !endOfColumn(field)) return false;
  return false;
}

function spaceLeftRow(field) {
  const { f_width } = field;
  const furthest = furthestPoint(field);

  return f_width - furthest.row;
}

function spaceLeftColumn(field) {
  const { f_length } = field;
  const furthest = furthestPoint(field);
  return f_length - furthest.col;
}

function endOfRow(field) {
  const furthest = furthestPoint(field);
  console.log("space left row:", spaceLeftRow(field));
  if (spaceLeftRow(field) >= min_ca_dim + gap) return false;
  return true;
}

function endOfColumn(field) {
  const furthest = furthestPoint(field);
  if (spaceLeftColumn(field) >= min_ca_dim + gap) return true;
  return false;
}

function getLastCultivationArea(field) {
  const { cultivationAreas } = field;
  if (cultivationAreas.length === 0) return null;
  return cultivationAreas[cultivationAreas.length - 1];
}

function getStartPoint(field) {
  const { ca_max_x, ca_min_y } = lastCultivationAreaPoints(field);
  return { start_row: ca_max_x + gap, start_col: ca_min_y };
}

function lastCultivationAreaPoints(field) {
  const lastCA = getLastCultivationArea(field);
  if (!lastCA)
    return {
      ca_max_y: 0,
      ca_min_x: 0,
      ca_max_x: 0,
      ca_min_y: 0,
    };
  return get_ca_min_max(lastCA);
}

console.log("Field example total points:", sum_points(fieldExample));
console.log(
  "Field example cultivation area points:",
  fieldCultivationAreaPoints(fieldExample),
);

// man AI function
function fillFieldAI(field, isEndOfRow) {
  if (checkFieldEnd(field)) {
    console.log("Field is completely filled.");
    return field;
  }

  if (endOfRow(field)) {
    console.log("End of row reached, moving to next row.");
    return fillFieldAI(field, true);
  }

  const { start_row, start_col } = getStartPoint(field);
  console.log("Starting point for new cultivation area:", start_row, start_col);

  let x = start_row;
  let y = start_col;

  for (x; x <= field.f_width - min_ca_dim; x++) {
    for (y; y >= 0; y--) {
      console.log("Trying to place cultivation area at:", x, y);
    }
  }

  drawGridPlainer(field.f_width, field.f_length, field.cultivationAreas);
}

fillFieldAI(fieldExample, false);

function fieldBasicValid(field, x, y, processedCells) {
  processedCells = processedCells.map(function (pc) {
    const { row, col } = pc;
    return { row: row, col: col };
  });
  if (
    { row: x, col: y } in field.cultivationAreas ||
    { row: x, col: y } in processedCells ||
    x >= field.width ||
    y >= field.length
  )
    return false;
  return true;
}

function initField() {
  const cultivationAreas = [];
  for (let i = 0; i < min_ca_dim; i++) {
    for (let j = 0; j < min_ca_dim; j++) {
      cultivationAreas.push({ row: i, col: j, active: CELL_ACTIVE });
    }
  }

  const field = {
    width: 100,
    length: 100,
    cultivationAreas,
  };
  return field;
}

function foo(field, x, y, processedCells, start, active) {
  console.log("Processing cell:", x, y, " start:", start, " active:", active);
  if (!fieldBasicValid(field, x, y, processedCells)) {
    console.log("Cell already processed:", x, y);
    return;
  }

  if (start || startRandomDecision()) {
    processedCells.add({ row: x, col: y, active: CELL_ACTIVE });
    // if +min_dim isnt valid, stop
    let notValidStart = false;
    for (let i = 0; i < min_ca_dim; i++) {
      if (!fieldBasicValid(field, x + i, y, processedCells)) {
        notValidStart = true;
        break;
      }
      const nextCell = { row: x + i, col: y };
      foo(field, nextCell.row, nextCell.col, processedCells, false, true);
    }
    if (notValidStart) return;
    for (let j = 0; j < min_ca_dim; j++) {
      if (!fieldBasicValid(field, x, y + j, processedCells)) {
        return;
      }
      const nextCell = { row: x, col: y + j };
      foo(field, nextCell.row, nextCell.col, processedCells, false, true);
    }
  }
}

function getRowBefore(cultivationAreas) {
  return cultivationAreas[cultivationAreas.length - 1]
    ? cultivationAreas[cultivationAreas.length - 1]
    : [];
}

export async function createFieldCells(field_width, field_length) {
  const cultivationAreas = [];

  let hasLastRow = false;

  while (true) {
    console.log("Cultivation areas has", cultivationAreas.length, "rows.");

    if (hasLastRow) {
      console.log("\n\nCreating new row of cultivation areas.\n\n");
      const newRow = []; // new row
      const row_before = getRowBefore(cultivationAreas);

      for (let cai = 0; cai < row_before.length; cai++) {
        const ca = row_before[cai];
        // ca is cultivation area from the row before
        //let lastCa = cai === row_before.length - 1; // last ca in the row, cannot continue next iteration
        console.log(ca?.length, " cells in ca index ", cai);
        const lastCa = newRow.length > 1 ? newRow[newRow.length - 1] : null;
        const {
          ca_max_y: l_ca_max_y,
          ca_min_x: l_ca_min_x,
          ca_max_x: l_ca_max_x,
          ca_min_y: l_ca_min_y,
        } = get_ca_min_max(lastCa ? lastCa : []);
        if (ca.length <= 1) {
          continue;
        }
        let { ca_max_y, ca_min_x, ca_max_x, ca_min_y } = get_ca_min_max(ca);

        console.log(
          `Cultivation row ${cultivationAreas.length}, ca index ${cai} : min_x=${ca_min_x}, max_x=${ca_max_x}, min_y=${ca_min_y}, max_y=${ca_max_y}`,
        );

        let begin_y = ca_max_y + gap;

        if (begin_y + min_ca_dim >= field_length) {
          console.log("ca_col too big, continuing to next");
          continue;
        }

        if (ca_max_x + min_ca_dim > field_width) {
          console.log("ca_row too big, continuing to new blank row");
          break;
        }

        // found suitable ca

        let begin_x;
        if (cai === 0) {
          begin_x = 0;
        } else {
          begin_x = l_ca_max_x + gap;
        }

        for (let x = begin_x; x + min_ca_dim <= field_width; x++) {
          if (!startRandomDecision()) {
            continue;
          }
          if (
            existsInCareas(cultivationAreas, {
              row: x + min_ca_dim + gap,
              col: begin_y,
            }) ||
            existsInCareas(cultivationAreas, {
              row: x - gap,
              col: begin_y,
            }) ||
            existsInCareas(cultivationAreas, {
              row: x + min_ca_dim,
              col: begin_y,
            }) ||
            existsInCareas(cultivationAreas, {
              row: x,
              col: begin_y,
            })
          ) {
            continue;
          }
          if (existsInCareas(cultivationAreas, { row: x, col: begin_y })) {
            continue;
          }

          if (
            existsInCareas(cultivationAreas, { row: x - gap, col: begin_y })
          ) {
            continue;
          }

          // creatibng new ca
          let new_ca = [];

          let dim_x = Math.floor(Math.random() * (field_width - x - gap));
          if (x + min_ca_dim + gap >= field_width) {
            dim_x = min_ca_dim;
          } else {
            console.log(
              "\n before dim_x while loop x=",
              x,
              "dim_x=",
              dim_x,
              "\n",
            );

            let tryCount = 0;

            while (
              x + dim_x >= field_width ||
              existsInCareas(cultivationAreas, {
                row: x + dim_x + gap + 1,
                col: begin_y,
              }) ||
              existsInCareas(cultivationAreas, {
                row: x + dim_x + gap,
                col: begin_y,
              }) ||
              existsInCareas(cultivationAreas, {
                row: x + dim_x,
                col: begin_y,
              }) ||
              dim_x < min_ca_dim ||
              dim_x > max_ca_dim
            ) {
              dim_x = Math.floor(Math.random() * (field_width - x - gap));
              console.log("in dim_x while loop x=", x, "dim_x=", dim_x);
              tryCount++;
              console.log("tryCount for dim_x:", tryCount);
              if (tryCount > 30) {
                console.log(
                  "Too many attempts to find suitable dim_x, breaking loop. Setting x to start:",
                );
                x = begin_x;
                break;
              }
            }
          }

          let dim_y;
          let y = begin_y;
          for (y; y + min_ca_dim <= field_length; y++) {
            if (y + min_ca_dim > field_length) {
              y = begin_y;
              continue;
            }

            dim_y = Math.floor(Math.random() * (field_length - y - gap));
            if (y + min_ca_dim == field_length && !(dim_y > max_ca_dim)) {
              dim_y = min_ca_dim;
            } else {
              while (
                ca_max_y + gap + dim_y >= field_length ||
                dim_y < min_ca_dim ||
                dim_y > max_ca_dim ||
                existsInCareas(cultivationAreas, {
                  row: x,
                  col: y + dim_y + gap,
                }) ||
                existsInCareas(cultivationAreas, { row: x, col: y + dim_y }) ||
                existsInCareas(cultivationAreas, { row: x, col: y + dim_y - 1 })
              ) {
                dim_y = Math.floor(
                  Math.random() * (field_length - ca_max_y - gap),
                );
              }
              break;
            }
          }

          let stop = false;
          for (let xi = x; xi < x + dim_x; xi++) {
            for (let yi = y; yi < y + dim_y; yi++) {
              new_ca.push({ row: xi, col: yi });
            }
            if (stop) break;
          }

          newRow.push(new_ca);
          console.log(
            "Created new cultivation area at x:",
            x,
            " y:",
            y,
            "with dim_x:",
            dim_x,
            " dim_y:",
            dim_y,
          );
          hasLastRow = true;
          break;
        }
      }
      if (newRow.length === 0) {
        console.log(
          "No cultivation areas created in this row, ending cultivation area creation.",
        );
        break;
      }
      console.log(
        "\n\nadding new row with",
        newRow.length,
        " cultivation areas.\n\n",
      );
      cultivationAreas.push(newRow);
    }
    if (!hasLastRow) {
      // beginning of field
      console.log("Creating first row of cultivation areas.");
      const firstRow = [];
      let x, y;
      while (true) {
        const lastCa = firstRow[firstRow.length - 1]
          ? firstRow[firstRow.length - 1]
          : null;

        if (lastCa && firstRow.length > 0) {
          const max_x = max_dim(lastCa, "row");
          x = max_x + gap;
        } else {
          x = 0;
        }

        if (x + min_ca_dim >= field_width) {
          hasLastRow = true;
          break;
        }
        while (!startRandomDecision()) {
          x += 1;
          if (x + min_ca_dim >= field_width) {
            if (lastCa && firstRow.length > 0) {
              const max_x = max_dim(lastCa, "row");
              x = max_x + gap;
            } else {
              x = 0;
            }
            /* x=0 */
          }
          continue;
        }

        // x to start ca is found. y=0
        //determining dim_x and dim_y
        let dim_x =
          Math.floor(Math.random() * (field_width - x - min_ca_dim)) +
          min_ca_dim;

        while (
          x + dim_x >= field_width ||
          dim_x > max_ca_dim ||
          dim_x < min_ca_dim ||
          existsInCareas(cultivationAreas, { row: x + dim_x, col: 0 }) ||
          existsInCareas(cultivationAreas, { row: x + dim_x + gap, col: 0 }) ||
          existsInCareas(cultivationAreas, {
            row: x + dim_x + gap + 1,
            col: 0,
          })
        ) {
          dim_x =
            Math.floor(Math.random() * (field_width - x - min_ca_dim)) +
            min_ca_dim;
        }
        // determined
        let y = 0;
        let dim_y =
          Math.floor(Math.random() * (field_length - min_ca_dim)) + min_ca_dim;
        while (
          y + dim_y >= field_length ||
          dim_y > max_ca_dim ||
          dim_y < min_ca_dim
        ) {
          dim_y =
            Math.floor(Math.random() * (field_length - min_ca_dim)) +
            min_ca_dim;
        }

        let new_ca = [];
        for (let xi = x; xi <= x + dim_x; xi++) {
          for (let yi = y; yi <= y + dim_y; yi++) {
            new_ca.push({ row: xi, col: yi });
          }
        }
        firstRow.push(new_ca);
      }

      cultivationAreas.push(firstRow);
      console.log(
        "\n\nFirst row created with",
        firstRow.length,
        " cultivation areas.\n\n",
        "cas length",
        cultivationAreas.length,
        cultivationAreas[0].length,
      );
      hasLastRow = true;
    }
    // drawGrid(field_width, field_length, cultivationAreas);
  }
  console.log(cultivationAreas.length, " rows of cultivation areas created.");
  drawGrid(field_width, field_length, cultivationAreas);
}

function drawGridPlainer(width, length, cultivationAreas) {
  console.log("drawing grid:");

  console.log("drawing grid:");
  for (let y = 0; y < length; y++) {
    let rowStr = "";
    for (let x = 0; x < width; x++) {
      if (
        cultivationAreas.some((ca) => {
          return ca.some((cell) => {
            return cell.row === x && cell.col === y;
          });
        })
      ) {
        rowStr += "+";
      } else {
        rowStr += "-";
      }
    }
    console.log(rowStr);
  }
  console.log("Cultivation areas has", cultivationAreas.length, "rows.");
  cultivationAreas.forEach(function (caRow, rowIndex) {
    console.log(
      `Cultivation Area Row ${rowIndex + 1} has ${caRow.length} cultivation areas:`,
    );
  });
}

function drawGrid(width, length, cultivationAreas) {
  console.log("drawing grid:");
  for (let y = 0; y < length; y++) {
    let rowStr = "";
    for (let x = 0; x < width; x++) {
      if (
        cultivationAreas.some(function (caRow) {
          return caRow.some(function (ca) {
            return ca.some(function (cell) {
              return cell.row === x && cell.col === y;
            });
          });
        })
      ) {
        rowStr += "+";
      } else {
        rowStr += "-";
      }
    }
    console.log(rowStr);
  }
  console.log("Cultivation areas has", cultivationAreas.length, "rows.");
  cultivationAreas.forEach(function (caRow, rowIndex) {
    console.log(
      `Cultivation Area Row ${rowIndex + 1} has ${caRow.length} cultivation areas:`,
    );
  });
}

function existsInCareas(cultivationAreas, val) {
  for (const caRow of cultivationAreas) {
    for (const ca of caRow) {
      if (
        ca.some(function (cell) {
          return lodash.isEqual(cell, val);
        })
      ) {
        return true;
      }
    }
  }
  return false;
}

function existInRow(row, val) {
  return row.some(function (cell) {
    return lodash.isEqual(cell, val);
  });
}

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
  return { ca_max_y, ca_min_x, ca_max_x, ca_min_y };
}

// createFieldCells(100, 100);
