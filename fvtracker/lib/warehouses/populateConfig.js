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
        populate: {
          path: "productionStock",
          populate: {
            path: "facility",
          },
        },
      },
    ],
  },
];

export default warehousePopulateConfig;
