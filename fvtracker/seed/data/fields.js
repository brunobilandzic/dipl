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
  min_ca_dim: 10,
  max_ca_dim: 60,
  gap: 2,
  cultivationAreas: [],
  location: {
    latitude: 43.67028,
    longitude: 16.70472,
  },
};

const optimizedParams2 = {
  name: "SEEDED FIELD 2",
  description: "Field optimized for seeders testing",
  width: 75,
  length: 80,
  min_ca_dim: 10,
  max_ca_dim: 60,
  gap: 2,
  cultivationAreas: [],
  location: {
    latitude: 43.67028,
    longitude: 16.70472,
  },
};

const optimizedParams3 = {
  name: "SEEDED FIELD 3",
  description: "Field optimized for seeders testing",
  width: 90,
  length: 120,
  min_ca_dim: 10,
  max_ca_dim: 60,
  gap: 2,
  cultivationAreas: [],
  location: {
    latitude: 44.5,
    longitude: 15.5,
  },
};

const optimizedParams4 = {
  name: "SEEDED FIELD 4",
  description: "Field optimized for seeders testing",
  width: 75,
  length: 150,
  min_ca_dim: 10,
  max_ca_dim: 60,
  gap: 2,
  cultivationAreas: [],
  location: {
    latitude: 45.0,
    longitude: 14.0,
  },
};

export const optimizedParamsArray = [
  optimizedParams,
  optimizedParams2,
  optimizedParams3,
  optimizedParams4, 
                   
];

const createFieldTimeSeconds = 5;

export const createFieldTimeMs = createFieldTimeSeconds * 1000;

const cultivationAreaNamesConstant = [
  {
    name: "Polje Anita",
    description: "natkriveno polje pogodno za sadanju voca",
  },
  { name: "Polje Marko", description: "otvoreno polje idealno za povrće" },
  { name: "Polje Ivana", description: "sunčano polje za cvijeće" },
  { name: "Polje Jure", description: "plodno polje za žitarice" },
  { name: "Polje Lucija", description: "vlažno polje za jagode" },
  { name: "Polje Petar", description: "pješčano polje za lavandu" },
  { name: "Polje Ana", description: "stjenovito polje za masline" },
  { name: "Polje Tomislav", description: "hladno polje za kupus" },
  { name: "Polje Dora", description: "toplo polje za rajčice" },
  { name: "Polje Luka", description: "plodno polje za krumpir" },
  { name: "Polje Nika", description: "sunčano polje za bundeve" },
  { name: "Polje Ivan", description: "vlažno polje za salatu" },
  { name: "Polje Zora", description: "stjenovito polje za začinsko bilje" },
  { name: "Polje Marko", description: "otvoreno polje za grah" },
  { name: "Polje Toni", description: "hladno polje za mrkvu" },
  { name: "Polje Milena", description: "sunčano polje za papriku" },
  { name: "Polje Luka", description: "plodno polje za krastavce" },
  {
    name: "Polje Anita",
    description: "natkriveno polje pogodno za sadanju voća",
  },
  { name: "Polje Jela", description: "vlažno polje za borovnice" },
  { name: "Polje Zlatko", description: "pješčano polje za smokve" },
  { name: "Polje Dino", description: "plodno polje za jagode" },
];

export function randomCultivationAreaName() {
  const cultivationAreaNames = [...cultivationAreaNamesConstant];
  const datapoint = cultivationAreaNames.splice(
    Math.floor(Math.random() * cultivationAreaNames.length),
    1,
  )[0];
  return datapoint;
}
