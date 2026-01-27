const gap = 4;
const min_ca_dim = 4;

const startRandomDecision = () => Math.random() < 0.7; // 70% chance to start a new cultivation area

const fieldBasicValid= (field, x, y, processedCells) => {
  if (
    { row: x, col: y } in field.cultivationAreas ||
    { row: x, col: y } in processedCells ||
    x >= field.width ||
    y >= field.length
  )
    return false;
  return true;
};



const foo = (field, x, y, processedCells,  start, active) => {
  if (
   !fieldBasicValid(field, x, y, processedCells)
  ) {
    console.log("Cell already processed:", x, y);
    return;
  }

  if(start || startRandomDecision()) {
    processedCells.add({row: x, col: y, active: true});
    const nextCell = {row: x + 1, col: y};
    foo(field, nextCell.row, nextCell.col, processedCells, false, true);
  }



};

export const createFieldCells = async (field_width, field_length) => {
  // Placeholder function for creating field cells

  // Random length between 5 and 15
  console.log(`Creating field cells with width: ${width}, length: ${length}`);

  const cultivationAreas = [
    // rows with cultivation areas
    // every row contains cultivation areas that are in that row
    [[firstCa]],
  ];

  // next x,y is 4,0

  let endOfRow = false;

  while (true) {
    if (endOfRow) {
      cultivationAreas.push([]); // new row
      const row_before = cultivationAreas[cultivationAreas.length - 2];

      for (ca in row_before) {
        const ca_min_x = min_dim(ca, "row");
        const ca_max_x = max_dim(ca, "row");
        const ca_max_y = max_dim(ca, "col");
        if (ca_max_y + gap + min_ca_dim >= field_length) {
          console.log("ca_col too big, continuing to next ca");
          continue;
        }

        let need_new_row = false;

        for (let x = ca_min_x; x + min_ca_dim < field_width; x++) {
          // finding the beginning of new ca

          if (existsInCareas(cultivationAreas, x + min_ca_dim + gap, "row")) {
            console.log("found existing ca at x:", x, " continuing to next ca");
            need_new_row = true;
            break;
          }
          if (!startRandomDecision()) {
            console.log("random decision to not create new ca at x:", x);
            continue;
          }
          let new_ca = [];

          let dim_x;
          while (x + dim_x + min_ca_dim >= field_width || dim_x < min_ca_dim) {
            dim_x = Math.floor(Math.random() * field_width - x - gap);
          }
          let dim_y = Mathfloor(Math.random() * field_length - ca_max_y - gap);
          for (xi = x; xi < x + dim_x; xi++) {
            for (yi = ca_max_y + gap; yi < ca_max_y + gap + min_ca_dim; yi++) {
              new_ca.push({ row: xi, col: yi });
              await proccessCell(cultivationAreas, xi, yi);
            }
          }
        }

        if (look_new_ca) continue;
      }
      const new_ca_start_y = ca_max_y + gap;
      const new_ca_start_x = min_dim(ca, "row");
      let new_ca = [];
    }
    endOfRow = false;
  }

  const row = cultivationAreas[cultivationAreas.length - 1];
  const lastCa = row[row.length - 1];

  const max_x = max_dim(lastCa, "row");
  if (max_x + 1 >= field_width) {
    console.log(
      "Reached the end of field width. Beginnig new row of cultivation areas.",
    );
    endOfRow = true;
  }

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
};

const existsInCareas = (cultivationAreas, val, dim) => {
  for (const caRow of cultivationAreas) {
    for (const ca of caRow) {
      for (const cell of ca) {
        if (cell[dim] === val) return true;
      }
    }
  }
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
