import { getRandomString } from "@/lib/utils/strings";

export const optimizedParams = {
  name: "Testno generalno polje",
  description:
    "Opis testnog generalnog polja. Ovo polje je namijenjeno za testiranje funkcionalnosti i prezentaciju aplikacije.",
  width: 75,
  length: 75,
  min_ca_dim: 10,
  max_ca_dim: 50,
  gap: 1,
  cultivationAreas: [],
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
  {
    name: "Polje za sadnju Marko",
    description: "otvoreno polje idealno za povrće",
  },
  { name: "Polje za sadnju Ivana", description: "sunčano polje za cvijeće" },
  { name: "Polje za sadnju Jure", description: "plodno polje za žitarice" },
  { name: "Polje za sadnju Lucija", description: "vlažno polje za jagode" },
  { name: "Polje za sadnju Petar", description: "pješčano polje za lavandu" },
  { name: "Polje za sadnju Ana", description: "stjenovito polje za masline" },
  { name: "Polje za sadnju Tomislav", description: "hladno polje za kupus" },
  { name: "Polje za sadnju Dora", description: "toplo polje za rajčice" },
  { name: "Polje za sadnju Luka", description: "plodno polje za krumpir" },
  { name: "Polje za sadnju Nika", description: "sunčano polje za bundeve" },
  { name: "Polje za sadnju Ivan", description: "vlažno polje za salatu" },
  {
    name: "Polje za sadnju Zora",
    description: "stjenovito polje za začinsko bilje",
  },
  { name: "Polje za sadnju Toni", description: "hladno polje za mrkvu" },
  { name: "Polje za sadnju Milena", description: "sunčano polje za papriku" },
  { name: "Polje za sadnju Jela", description: "vlažno polje za borovnice" },
  { name: "Polje za sadnju Zlatko", description: "pješčano polje za smokve" },
  { name: "Polje za sadnju Dino", description: "plodno polje za jagode" },
  { name: "Polje za sadnju Maja", description: "toplo polje za limun" },
  { name: "Polje za sadnju Stefan", description: "sunčano polje za maslinu" },
  { name: "Polje za sadnju Vesna", description: "vlažno polje za pirinač" },
  { name: "Polje za sadnju Dragan", description: "pješčano polje za jagnje" },
  {
    name: "Polje za sadnju Petra",
    description: "stjenovito polje za kapuciniju",
  },
  { name: "Polje za sadnju Goran", description: "hladno polje za ciklamu" },
  { name: "Polje za sadnju Ema", description: "plodno polje za blitvu" },
  { name: "Polje za sadnju Marija", description: "sunčano polje za rozmarin" },
  {
    name: "Polje za sadnju Filip",
    description: "vlažno polje za zelenu salaticu",
  },
  { name: "Polje za sadnju Katarina", description: "toplo polje za batat" },
];
