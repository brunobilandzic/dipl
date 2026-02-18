const numberInRange = (value, min, max) => {
  console.log(value, min, max);
  const numberValue = parseFloat(value);
  if (isNaN(numberValue)) {
    return false;
  }
  const valid = numberValue >= min && numberValue <= max;
  console.log("Valid:", valid);
  return valid;
};

export const numbersInRanges = (conditions) => {
  for (let condition of conditions) {
    const { value, min, max } = condition;
    if (!numberInRange(value, min, max)) {
      return false;
    }
  }
  return true;
};
