import { PRODUCTION_MANAGER } from "../constants/users/managerTypes";

export const fetchProductionManager = async () => {
  const { specificManager: productionManager } = await fetchManager({
    managerNames: [PRODUCTION_MANAGER],
  });
  await productionManager.populate([
    {
      path: "products",
      populate: [
        {
          path: "ingredients",
          populate: [
            {
              path: "cropVariety",
              select: "name",
            },
          ],
        },
        {
          path: "stocks",
        },
      ],
    },
  ]);

  return productionManager;
};
