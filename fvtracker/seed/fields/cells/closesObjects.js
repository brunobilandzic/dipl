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
    /* 
    
    svaki x od x, do točke u kojoj postoji objekt u polju (field) na koordinati (x, y)
     provjeri da li je udaljenost veća od min_distance plus razmaka
     ako je veća, udaljenost postaje dimenzija objekta
     ako nije, pronadi kraj objekta i izracunaj udaljenost od kraja polja
     ako je udaljenost veća od min_distance plus razmaka, udaljenost postaje dimenzija objekta

    
    */
}