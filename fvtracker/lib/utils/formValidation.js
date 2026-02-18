export const numberInRange = (value, min, max) => {
  const numberValue = parseFloat(value);
  if (isNaN(numberValue)) {
    return false;
  }
  return numberValue >= min && numberValue <= max;
};
