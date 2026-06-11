import { getRandomString } from "@/lib/utils/strings";

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

export const planInfo = ({ fieldId, cropVarietyIds, productionManagerId }) => {
  return {
    plantingPlan: {
      field: fieldId, // Postavit ćemo ovo kasnije
      name: `Plan sadnje ${getRandomString(5)}`,
      description: "Plan sadnje za testiranje",
      items: cropVarietyIds.map((cropVarietyId) => ({
        cropVariety: cropVarietyId, // Postavit ćemo ovo kasnije
        quantity: 100000,
      })),
      productionManager: productionManagerId,
    },
    harvestingPlan: {
      field: fieldId, // Postavit ćemo ovo kasnije
      name: `Plan berbe ${getRandomString(5)}`,
      description: "Plan berbe za testiranje",
      items: cropVarietyIds.map((cropVarietyId) => ({
        cropVariety: cropVarietyId, // Postavit ćemo ovo kasnije
        quantity: 100000,
      })),
      productionManager: productionManagerId,
    },
  };
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
