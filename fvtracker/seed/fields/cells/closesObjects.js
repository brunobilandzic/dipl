const gap = 2;
const min_ca_dim = 4;
const max_ca_dim = 20;
const length_options = [];
import lodash from "lodash";

for (let i = min_ca_dim; i <= max_ca_dim; i++) {
  length_options.push(i);
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

function findNextRight(field, x, y) {
  const { f_width, f_height } = field;
  /* 
    
    svaki x od x, do točke u kojoj postoji objekt u polju (field) na koordinati (x, y)
     provjeri da li je udaljenost veća od min_distance plus razmaka
     ako je veća, udaljenost postaje dimenzija objekta
     ako nije, pronadi kraj objekta i izracunaj udaljenost od kraja polja
     ako je udaljenost veća od min_distance plus razmaka, udaljenost postaje dimenzija objekta

    
    */

  for (y; y <= f_height - min_ca_dim; y++) {
    let neighbour = null;
    
    for (x; x <= f_width - min_ca_dim; x++) {
      if (pointExists(field, x, y)) {
        neighbour = {
          neighbour_start_x: x,
          neighbour_start_y: y,
        };
        break;
      }
    }
  }
}

function find_y (field, x, start_y) {
    const { f_height } = field;
    for (let y = start_y; y <= f_height; y++) {
        if (pointExists(field, x, y)) {
            return y;
        } 
    }
    return null;
}

function find_x (field, start_x, y) {
    const { f_width } = field;
    for (let x = start_x; x <= f_width; x++) {
        if (pointExists(field, x, y)) {
            return x;
        }
    }
    return null;
}

function findAllColumn(field, x, y) {
    const occupied_ys = [];
    const { f_height } = field;
    for (let yi = y; yi <= f_height; yi++) {
        if (pointExists(field, x, yi)) {
            occupied_ys.push(yi);
        }
    }
    return occupied_ys;
}

function findAllInRow(field, x, y) {
    const occupied_xs = [];
    const { f_width } = field;

    for (let xi = x; xi <= f_width; xi++) {
        if (pointExists(field, xi, y)) {
            occupied_xs.push(xi);
        }
    }

}

function findObjectAnd(field, min_x, y) {
    const { f_width } = field;

    for (let x = min_x; x <= f_width; x++) {
        if (pointExists(field, x, y)) {

    }

}

function pointExists(field, x, y) {
  let exists = false;
  for (let ca of field.cultivation_areas) {
    for (let point of ca) {
      if (lodash.isEqual(point, { row: x, col: y })) {
        exists = true;
        break;
      }
    }
  }
  return exists;
}
