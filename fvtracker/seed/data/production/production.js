import { getRandomString, onlyLetters } from "@/lib/utils/strings";


// ing qant must be reduced from batch

export const productionFacilitiyInfo = {
  name: getRandomString({ beginning: "Proizvodni pogon", length: 5 }),
  description: "Pogon za proizvodnju gotovih proizvoda",
};

export const getProductionProcessInfo = ({ productName }) => {
  const name = getProcessName({ productName });

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
