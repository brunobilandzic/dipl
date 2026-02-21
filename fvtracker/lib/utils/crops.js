export function getCropDimensions(cultivationArea, planted) {
  const { length, width } = cultivationArea;
  const plantedEmpty = Object.keys(planted).reduce((acc, key) => {
    if (planted[key] === null) acc += 1;
    return acc;
  }, 0);
}