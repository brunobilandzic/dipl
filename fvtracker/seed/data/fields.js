export const fieldParams = [
  {
    name: "Small CAS",
    width: 100,
    length: 100,
    min_ca_dim: 10,
    max_ca_dim: 50,
    gap: 4,
  },
  {
    name: "Medium CAS",
    width: 500,
    length: 500,
    min_ca_dim: 25,
    max_ca_dim: 90,
    gap: 4,
  },
  {
    name: "Large CAS",
    width: 1000,
    length: 1000,
    min_ca_dim: 50,
    max_ca_dim: 180,
    gap: 6,
  },
];

export const optimizedParams = {
  name: "SEEDED FIELD",
  description: "Field optimized for seeders testing",
  width: 100,
  length: 100,
  min_ca_dim: 15,
  max_ca_dim: 50,
  gap: 2,
  location: {
    latitude: 43.67028,
    longitude: 16.70472,
  },
};

 const createFieldTimeSeconds = 5

 export const createFieldTimeMs = createFieldTimeSeconds * 1000;