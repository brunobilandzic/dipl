import { productMachineNameMap } from "@/seed/data/constants";

export const process = ({ productName }) => {};

export const getMachineName = ({ productName }) => {
  const productNameWords = productName.split(" ");
  let machineName = null;
  for (const [productNames, mapMachineName] of productMachineNameMap) {
    const productNamesWords = productNames.split(" ");
    for (const word in productNameWords) {
      if (word in productNameWords) {
        machineName = mapMachineName;
      }
    }
  }
  return machineName || `Stroj za proizvod ${productName}`;
};
