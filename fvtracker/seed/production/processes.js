import { productMachineNameMap } from "@/seed/data/constants";

export const process = ({ productName }) => {};

export const getMachineName = ({ productName }) => {
  const productNameWords = productName.split(" ");
  let machineName = null;
  for (const [productNamesKey, mapMachineName] of productMachineNameMap) {
    const productNamesKeys = productNamesKey.split(" ");
    for (const word of productNameWords) {
      if (word in productNamesKeys) {
        machineName = mapMachineName;
      }
    }
  }
  return machineName || `Stroj za proizvod ${productName}`;
};
