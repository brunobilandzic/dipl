import { ProductionFacility } from "@/models/sectors/production/Facility";

export const getFacilities = async () => {
  return populateFacilities(ProductionFacility.find({}));
};

export const populateFacilities = async (facilities) => {
  console.log(typeof facilities, Array.isArray(facilities));
  await facilities.populate([
    {
      path: "stocks",
      populate: [
        {
          path: "product",
          select: "name ingredients",
          populate: {
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
        },
      ],
    },
  ]);
};
