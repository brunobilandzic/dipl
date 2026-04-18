import { onlyLetters } from "@/lib/utils/strings";
import { productMachineNameMap } from "@/seed/data/constants";

export const process = ({ productName }) => {};

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
