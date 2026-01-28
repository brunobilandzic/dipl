const gap = 4;
const min_ca_dim = 4;
const max_ca_dim = 20;
const CELL_ACTIVE = "active";
const CELL_INACTIVE = "inactive";
const CELL_UNASSIGNED = "unassigned";
const CELL_PENDING = "pending";
import lodash from "lodash";

const startRandomDecision = () => Math.random() < 0.7; // 70% chance to start a new cultivation area

const fieldBasicValid = (field, x, y, processedCells) => {
  processedCells = processedCells.map((pc) => {
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
};

const initField = () => {
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
};

const foo = (field, x, y, processedCells, start, active) => {
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
};

const getRowBefore = (cultivationAreas) =>
  cultivationAreas[cultivationAreas.length - 1]
    ? cultivationAreas[cultivationAreas.length - 1]
    : [];

export const createFieldCells = async (field_width, field_length) => {
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
        let lastCa = cai === row_before.length - 1; // last ca in the row, cannot continue next iteration
        console.log(ca?.length, " cells in ca index ", cai);

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
          begin_x = ca_min_x;
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
};

const drawGrid = (width, length, cultivationAreas) => {
  console.log("drawing grid:");
  for (let y = 0; y < length; y++) {
    let rowStr = "";
    for (let x = 0; x < width; x++) {
      if (
        cultivationAreas.some((caRow) =>
          caRow.some((ca) =>
            ca.some((cell) => cell.row === x && cell.col === y),
          ),
        )
      ) {
        rowStr += "+";
      } else {
        rowStr += "-";
      }
    }
    console.log(rowStr);
  }
  console.log("Cultivation areas has", cultivationAreas.length, "rows.");
  cultivationAreas.forEach((caRow, rowIndex) => {
    console.log(
      `Cultivation Area Row ${rowIndex + 1} has ${caRow.length} cultivation areas:`,
    );
  });
};

const existsInCareas = (cultivationAreas, val) => {
  for (const caRow of cultivationAreas) {
    for (const ca of caRow) {
      if (ca.some((cell) => lodash.isEqual(cell, val))) {
        return true;
      }
    }
  }
  return false;
};

const existInRow = (row, val) => {
  return row.some((cell) => lodash.isEqual(cell, val));
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
  const ca_min_x = min_dim(ca, "row");
  const ca_max_x = max_dim(ca, "row");
  const ca_max_y = max_dim(ca, "col");
  const ca_min_y = min_dim(ca, "col");
  return { ca_max_y, ca_min_x, ca_max_x, ca_min_y };
}

createFieldCells(100, 100);
