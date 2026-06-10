const numberInRange = (value, min, max) => {
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

export const checkValue = (value) => {
  if (value === "" || value === null || value === undefined) {
    return { value: "", error: null };
  }
  if (isNaN(value)) {
    return { value: "", error: null };
  }
  if (Number(value) < 0) {
    return { value: "", error: "Vrijednost ne može biti negativna." };
  }
  return { value: Number(value), error: null };
};
