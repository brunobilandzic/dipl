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
  max_ca_dim: 100,
  gap: 1,
  cultivationAreas: [],
  location: {
    latitude: 43.67028,
    longitude: 16.70472,
  },
};

export const planInfo = ({ fieldId, cropVarietyId, productionManagerId }) => {
  return {
    plantingPlan: {
      field: fieldId, // Postavit ćemo ovo kasnije
      name: `Plan sadnje ${new Date().toLocaleTimeString()}`,
      description: "Plan sadnje za testiranje",
      items: [
        {
          cropVariety: cropVarietyId, // Postavit ćemo ovo kasnije
          quantity: 1000,
        },
      ],
    },
    harvestingPlan: {
      field: fieldId, // Postavit ćemo ovo kasnije
      name: `Plan berbe ${new Date().toLocaleTimeString()}`,
      description: "Plan berbe za testiranje",
      items: [
        {
          cropVariety: cropVarietyId, // Postavit ćemo ovo kasnije
          quantity: 1000,
        },
      ],
      productionManager: productionManagerId,
    },
  };
};

export const optimizedCultivation = ({ caId }) => {
  return {
    cultivationArea: caId,
    name: "SEEDED CULTIVATION",
    description: "Cultivation optimized for seeders testing",
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    relativeCoords: ["0,0", "0,1", "1,0", "1,1"],
  };
};

const optimizedParams2 = {
  name: "SEEDED FIELD 2",
  description: "Field optimized for seeders testing",
  width: 100,
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

export const optimizedParamsArray = [optimizedParams];

const createFieldTimeSeconds = 5;

export const createFieldTimeMs = createFieldTimeSeconds * 1000;

export const cultivationAreaNamesConstant = [
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
  { name: "Polje Toni", description: "hladno polje za mrkvu" },
  { name: "Polje Milena", description: "sunčano polje za papriku" },
  { name: "Polje Jela", description: "vlažno polje za borovnice" },
  { name: "Polje Zlatko", description: "pješčano polje za smokve" },
  { name: "Polje Dino", description: "plodno polje za jagode" },
  { name: "Polje Maja", description: "toplo polje za limun" },
  { name: "Polje Stefan", description: "sunčano polje za maslinu" },
  { name: "Polje Vesna", description: "vlažno polje za pirinač" },
  { name: "Polje Dragan", description: "pješčano polje za jagnje" },
  { name: "Polje Petra", description: "stjenovito polje za kapuciniju" },
  { name: "Polje Goran", description: "hladno polje za ciklamu" },
  { name: "Polje Ema", description: "plodno polje za blitvu" },
  { name: "Polje Marija", description: "sunčano polje za rozmarin" },
  { name: "Polje Filip", description: "vlažno polje za zelenu salaticu" },
  { name: "Polje Katarina", description: "toplo polje za batat" },
];
