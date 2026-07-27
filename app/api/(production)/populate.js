export const populateProductsConfig = {
  path: "products",
  populate: [
    {
      path: "ingredients",
      select: "cropVariety quantity quality",
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
    {
      path: "shipmentSources",
    },
  ],
};
