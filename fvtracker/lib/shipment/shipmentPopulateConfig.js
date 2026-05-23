export default [
  {
    path: "warehouseRequest",
    populate: [
      {
        path: "order",
        populate: {
          path: "items",
          populate: "product",
        },
      },
    ],
  },
  {
    path: "shipmentItems",
    populate: [
      {
        path: "sources",
        populate: [
          {
            path: "warehouseStock",
            populate: "warehouse",
          },
          {
            path: "product",
          },
        ],
      },
      {
        path: "receipt",
      },
    ],
  },
];
