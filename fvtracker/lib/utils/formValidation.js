const numberInRange = (value, min, max) => {
  console.log(value, min, max);
  const numberValue = parseFloat(value);
  if (isNaN(numberValue)) {
    return false;
  }
  const valid = numberValue >= min && numberValue <= max;
  
  return valid;
};

export const numbersInRanges = (checks) => {
  for (let check of checks) {
    const { name, value, min, max } = check;
    if (!numberInRange(value, min, max)) {
      return {
        valid: false,
        message: `${name} mora biti između ${min} i ${max}`,
      };
    }
  }
  return { valid: true };
};
