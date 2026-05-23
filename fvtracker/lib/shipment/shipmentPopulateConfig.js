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
];
