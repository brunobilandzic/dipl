export const populateProductsConfig = [
  {
    path: "ingredients",
    select: "cropVariety quantity",
    populate: {
      path: "cropVariety",
      select: "name cropType",
      populate: {
        path: "cropType",
        select: "name",
      },
    },
  },
  {
    path: "productionStocks",
    populate: [
      {
        path: "facility",
      },
    ],
  },
  {
    path: "warehouseStocks",
    populate: [
      {
        path: "warehouse",
      },
      {
        path: "warehouseAcceptanceProcesses",
      },
    ],
  },
];
