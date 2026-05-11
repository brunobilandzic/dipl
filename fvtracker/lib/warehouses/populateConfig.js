import { populateIngredientsConfig } from "../production/product/ingredients";

const warehousePopulateConfig = [
  {
    path: "stocks",
    populate: [
      {
        path: "product",
        populate: populateIngredientsConfig,
      },
      {
        path: "warehouseAcceptanceProcesses",
      },
    ],
  },
];

export default warehousePopulateConfig;
