import { getRandomString } from "@/lib/utils/strings";
import { getMachineName, getProcessName } from "@/seed/production/processes";

export const productsData = [
  /* {
    name: "Cherry rajčica Paket 10 komada",
    description: "Paket od 10 komada cherry rajčice",
    price: 5,
    ingredients: [
      {
        cropVarietyName: "Cherry rajčica",
        quantity: 10,
      },
    ],
  },
  {
    name: "Kuhani špinat konzerva 400g",
    description: "Konzerva od kuhanih špinata",
    price: 2,
    ingredients: [
      {
        cropVarietyName: "Obični špinat",
        quantity: 5,
      },
    ],
  },
  {
    name: "Salata mix",
    description: "Mješavina različitih salata",
    price: 4,
    ingredients: [
      {
        cropVarietyName: "Iceberg",
        quantity: 5,
      },
      {
        cropVarietyName: "Kristalka",
        quantity: 5,
      },
    ],
  }, */
  {
    name: "Jabuka Idared 1kg",
    description: "1 kilogram jabuka sorte Idared",
    price: 3,
    ingredients: [
      {
        cropVarietyName: "Idared",
        quantity: 20,
      },
    ],
  },
];

// ing qant must be reduced from batch

export const productionFacilitiyInfo = {
  name: getRandomString({ beginning: "Proizvodni pogon 1", length: 5 }),
  description: "Pogon za proizvodnju gotovih proizvoda",
};

export const productionProcessInfo = {
  name: "Proizvodnja 1",
  description: "Proizvodnja gotovih proizvoda na osnovu usjeva",
};

export const getProductionProcessInfo = ({ productName }) => {
  const name = getProcessName({ productName });
  console.log({ productName }, name);

  return {
    name,
    description: "Proizvodnja gotovih proizvoda na osnovu usjeva",
  };
};

export const getProductionFacilityInfos = (n) => {
  const facilities = [];
  for (let i = 0; i < n; i++) {
    facilities.push({
      name: `Proizvodni pogon ${i + 1} ${new Date().toLocaleString()}`,
      description: "Pogon za proizvodnju gotovih proizvoda",
    });
  }
  return facilities;
};
