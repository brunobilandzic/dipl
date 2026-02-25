export const extractCoords = (cell) => {
  const [x, y] = cell.split(",").map(Number);
  return { x, y };
};