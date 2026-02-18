export const numberInRange = (value, min, max) => {
  console.log(value, min, max);
  const numberValue = parseFloat(value);
  if (isNaN(numberValue)) {
    return false;
  }
  const valid =  numberValue >= min && numberValue <= max;
  console.log("Valid:", valid);
  return valid;
};
