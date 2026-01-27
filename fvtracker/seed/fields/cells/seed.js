const gap = 4;
const min_ca_dim = 4;
const max_ca_dim = 20;
const CELL_ACTIVE = "active";
const CELL_INACTIVE = "inactive";
const CELL_UNASSIGNED = "unassigned";
const CELL_PENDING = "pending";

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

export const createFieldCells = async (field_width, field_length) => {
  // Placeholder function for creating field cells

  // Random length between 5 and 15
  console.log(
    `Creating field cells with width: ${field_width}, length: ${field_length}\n\n`,
  );

  const cultivationAreas = [];

  // next x,y is 4,0

  let hasLastRow = false;

  while (true) {
    console.log("Cultivation areas has", cultivationAreas.length, "rows.");
    if (hasLastRow) {
      console.log("\n\nCreating new row of cultivation areas.\n\n");
      cultivationAreas.push([]); // new row
      const row_before = cultivationAreas[cultivationAreas.length - 2]
        ? cultivationAreas[cultivationAreas.length - 2]
        : [];
      if (row_before.length === 0) break; // no more rows before, ending

      for (let cai = 0; cai < row_before.length; cai++) {
        const ca = row_before[cai];
        let lastCa = cai === row_before.length - 1; // last ca in the row, cannot continue next iteration
        const { ca_max_y, ca_min_x, ca_max_x, ca_min_y } = get_ca_min_max(ca);
        console.log(`processin ca ${cai + 1} in row before`);
        console.log(
          `it has min_x:${ca_min_x}, max_x:${ca_max_x}, min_y:${ca_min_y}, max_y:${ca_max_y}`,
        );

        let y = ca_max_y + gap;
        console.log(`starting x:${ca_min_x}, y:${y} for new ca creation`);

        if (y + min_ca_dim >= field_length) {
          console.log("ca_col too big, continuing to next");
          continue;
        }

        //dont forget to look left also later
        if (ca_min_x + min_ca_dim >= field_width) {
          console.log("ca_row too big, continuing to new blank row");
          break;
        }

        for (let x = ca_min_x; x + min_ca_dim <= field_width; x++) {
          // finding the beginning of new ca
          if (!startRandomDecision()) {
            // moving to the next x
            console.log("random decision to not create new ca at x:", x);
            continue;
          }
          if (
            existsInCareas(cultivationAreas, {
              row: x + min_ca_dim + gap,
              col: y,
            })
          ) {
            console.log(
              "found existing ca at x:",
              x,
              y,
              " continuing to next ca",
            );
            break;
          }

          // creatibng new ca
          let new_ca = [];
          let dim_x = Math.floor(Math.random() * (field_width - x));
          if (x + min_ca_dim == field_width) {
            dim_x = min_ca_dim;
          } else {
            while (
              x + dim_x >= field_width ||
              existsInCareas(cultivationAreas, x + dim_x + gap + 1, "row") ||
              dim_x < min_ca_dim || dim_x > max_ca_dim
            ) {
              dim_x = Math.floor(Math.random() * (field_width - x));
            }
          }

          console.log(`creating new ca at x:${x} with dim_x:${dim_x}`);

          if (y > field_length - min_ca_dim) {
            console.log("y exceeded field length, continuing to next ca");
            break;
          }
          let dim_y;
          for (y; y + min_ca_dim <= field_length; y++) {
            console.log(`determining dim_y at y:${y}`);
            dim_y = Math.floor(Math.random() * (field_length - y));
            if (y + min_ca_dim == field_length) {
              dim_y = min_ca_dim;
            } else {
              while (
                ca_max_y + gap + dim_y >= field_length ||
                dim_y < min_ca_dim || dim_y > max_ca_dim
              ) {
                dim_y = Math.floor(
                  Math.random() * (field_length - ca_max_y - gap),
                );
              }
              break;
            }
          }

          for (let xi = x; xi < x + dim_x; xi++) {
            for (let yi = y; yi < y + dim_y; yi++) {
              new_ca.push({ row: xi, col: yi });
            }
          }

          const { ca_max_x } = get_ca_min_max(new_ca);
          if (ca_max_x + gap + min_ca_dim >= field_width) {
          }

          cultivationAreas[cultivationAreas.length - 1].push(new_ca);
          console.log("Created new cultivation area at x:", x, " y:", y);
          hasLastRow = true;
          break;
        }
      }
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
          console.log(
            "Reached field width limit, ending row creation.",
            x,
            "\n\n\n",
          );
          break;
        }
        while (!startRandomDecision()) {
          console.log("random decision to not create new ca at x:", x);
          x += 1;
          if (x + min_ca_dim >= field_width) x = 0;
          continue;
        }

        //determining dim_x and dim_y
        let dim_x =
          Math.floor(Math.random() * (field_width - x - min_ca_dim)) +
          min_ca_dim;

        while (
          x + dim_x >= field_width ||
          dim_x > max_ca_dim ||
          dim_x < min_ca_dim
        ) {
          dim_x =
            Math.floor(Math.random() * (field_width - x - min_ca_dim)) +
            min_ca_dim;
        }
        console.log("Determined dim_x:", dim_x);
        // determined
        let y = 0;
        let dim_y =
          Math.floor(Math.random() * (field_length - y - min_ca_dim)) +
          min_ca_dim;
        while (
          y + dim_y >= field_length ||
          dim_y > max_ca_dim ||
          dim_y < min_ca_dim
        ) {
          dim_y =
            Math.floor(Math.random() * (field_length - y - min_ca_dim)) +
            min_ca_dim;
        }
        console.log("Determined dim_y:", dim_y);
        // determined

        let new_ca = [];
        for (let xi = x; xi <= x + dim_x; xi++) {
          for (let yi = y; yi <= y + dim_y; yi++) {
            new_ca.push({ row: xi, col: yi });
          }
        }
        firstRow.push(new_ca);
        console.log(
          "Created new cultivation area at x:",
          x,
          " y:",
          y,
          " dim_x:",
          dim_x,
          " dim_y:",
          dim_y,
        );
      }

      cultivationAreas.push(firstRow);
      hasLastRow = true;
    }
    // drawGrid(field_width, field_length, cultivationAreas);
  }
  console.log(cultivationAreas.length, " rows of cultivation areas created.");
  drawGrid(field_width, field_length, cultivationAreas);
};

/* 
    // determine if continuing or new
    check if (x-1) on careas exists, if yes, continuuation, else new row
    const max_x = max_dim(lastCa, "row");

    if(continuation)
        // adduing ca to the lastca in last row
        const max_y = max_dim(lastCa, "col");

        if(randomcacontinue)
        
        for (let i=0; i<width; i++)
            next_x = max_x + i
            if(next_x >= width) break && break row creation (someflag);
            
            if (randomcell)
            if(find next_x+gap in all cultivation areas) break
            for (let j=0; j<max_y && j<length; j++)
                lastCa.push({row: next_x, col: j});
            else break
    else (not continuation)
        // new ca in row
        next_x = max_x + gap
        if(next_x + gap >= width) break && break row creation (someflag);
        let caheight = random between min_height and field_height
        for (let x=next_x +gap; x++)
        for (let j=0; j<caheight; j++)
            lastCa.push({row: next_x, col: j});
        continue while loop to determine will it cnitnue or not
        */

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
      if (ca.some((cell) => cell == val)) {
        return true;
      }
    }
  }
  return false;
};

const proccessCell = async (cultivationAreas, x, y) => {
  // Placeholder function for processing a cell
  // determine if cell is active and perform necessary actions
};

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

const fieldCell = {
  row: Number,
  column: Number,
  turnedOn: Boolean,
};
/* 

row of cultivation areas along x axis
carow1 -> begin (x,y,len_x,len_y), ca2 (x,y,len_x,len_y),.... end(x,y, len_x,len_y)


second row,.. 
determine first element's in row before y, add gap, then continue, by chance to add, and add min_w x's, if they with gap enter another row from row before, 
go left (before)  to the needed length, and add min_w from there

determine y random, min y+min_len, if it goes over field, continue to the next element in the previous row, until all rows are filled, find cell that cell + y_len fits in the field, draw that x y square 
carow2 -> ca21 (x,y,len_x,len_y), ca22 (x,y,len_x,len_y),....
*/

const firstCa = [
  { row: 0, col: 0 },
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
  { row: 0, col: 2 },
  { row: 0, col: 3 },
  { row: 1, col: 2 },
  { row: 1, col: 3 },
  { row: 2, col: 0 },
  { row: 2, col: 1 },
  { row: 2, col: 2 },
  { row: 2, col: 3 },
  { row: 3, col: 0 },
  { row: 3, col: 1 },
  { row: 3, col: 2 },
  { row: 3, col: 3 },
];

createFieldCells(100, 100);
