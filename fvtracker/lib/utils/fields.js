export const extractCoords = (cell) => {
  const [width, length] = cell.split(",").map(Number);
  return { width, length };
};