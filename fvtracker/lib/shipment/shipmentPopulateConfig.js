export default [
  {
    path: "warehouseRequest",
    populate: [
      {
        path: "order",
        populate: "items",
        populate: "product shipmentSources",
      },
    ],
  },
];
