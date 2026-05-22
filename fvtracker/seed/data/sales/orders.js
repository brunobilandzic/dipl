export const ordersSeedData = Array.from({ length: 5 }).map((_, i) => ({
  number: `00000${i + 1}`,
  date: new Date(),
}));
