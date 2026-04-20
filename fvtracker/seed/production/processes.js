import {
  CANNING_MACHINE,
  PACKAGING_MACHINE,
} from "../data/production/machines";

export const productionProcessesSeedData = [
  {
    name: "Konzerviranje",
    description: "Proces pakiranja konzerviranih proizvoda u pakete",
    machines: [PACKAGING_MACHINE, CANNING_MACHINE],
  },
];
