export const procurmentValue = (proc) => {
  return proc.items.reduce((acc, item) => {
    return acc + item.quantity * item.price;
  }, 0);
};
