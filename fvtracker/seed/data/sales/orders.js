export const ordersSeedData = Array.from({ length: 10 }).map((_, i) => ({
  number: String(i + 1).padStart(6, "0"),
  date: new Date(),
}));
