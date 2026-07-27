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
        populate: [
          {
            path: "productionStock",
            populate: {
              path: "facility",
            },
          },
          {
            path: "worker",
            select: "appUser",
            populate: {
              path: "appUser",
              select: "name surname",
            },
          },
        ],
      },
    ],
  },
];

export default warehousePopulateConfig;
