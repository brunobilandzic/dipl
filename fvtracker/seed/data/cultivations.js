export const numberOfCultivations = ({ dimensions }) => {
  const { width, length } = dimensions;
  const numCells = width * length;

  switch (true) {
    case numCells < 10:
      return 1;
    case numCells < 50:
      return 2;
    case numCells < 100:
      return 3;
    case numCells < 200:
      return 4;
    default:
      return 0;
  }
};


