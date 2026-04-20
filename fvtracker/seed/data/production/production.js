import { getRandomString, onlyLetters } from "@/lib/utils/strings";
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

export const getProductionProcessInfo = ({ productName }) => {
  const name = getProcessName({ productName });
  console.log("creating process for product:", productName, "with name:", name);

  return {
    name,
    description: "Proizvodnja gotovih proizvoda na osnovu usjeva",
  };
};

export const productMachineNameMap = new Map([
  ["pakiranje paket vrećica kg", "stroj za pakiranje"],
  ["konzerva konzerve", "stroj za konzerviranje"],
  ["sok", "stroj za cijeđenje"],
]);

export const productProcessNameMap = new Map([
  ["pakiranje paket vrećica kg", "Pakiranje"],
  ["konzerva konzerve", "Konzerviranje"],
  ["sok", "Cijeđenje"],
]);

export const processMachineMap = new Map([
  ["pakiranje paket vrećica kg", "stroj za pakiranje"],
  ["konzerva konzerve", "stroj za konzerviranje"],
  ["sok", "stroj za cijeđenje"],
]);

export const getMachineName = ({ productName }) => {
  const productNameWords = productName
    .split(" ")
    .map((word) => onlyLetters(word).toLowerCase());
  let machineName = null;
  for (const [productNamesKey, mapMachineName] of productMachineNameMap) {
    const productNamesKeys = productNamesKey.split(" ");
    for (const word of productNameWords) {
      if (productNamesKeys.includes(word)) {
        machineName = mapMachineName;
        break;
      }
    }
  }
  return machineName || `Stroj za proizvod ${productName}`;
};

export const getProcessName = ({ productName }) => {
  const productNameWords = productName
    .split(" ")
    .map((word) => onlyLetters(word).toLowerCase());
  let processName = null;
  for (const [productNamesKey, mapProcessName] of productProcessNameMap) {
    const productNamesKeys = productNamesKey.split(" ");
    for (const word of productNameWords) {
      if (productNamesKeys.includes(word)) {
        processName = mapProcessName;
        break;
      } else {
        processName = `Proizvodnja ${productName}`;
      }
    }
  }
  return processName;
};
