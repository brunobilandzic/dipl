import { ProductionFacility } from "@/models/sectors/production/Facility";

export const getFacilities = async () => {
  return ProductionFacility.find({}).populate([
    {
      path: "stocks",
      populate: [
        {
          path: "product",
          select: "name ingredients stockVolume",
          populate: {
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
        },
        {
          path: "productionProcesses",
          select: "quantity",
        },
      ],
    },
  ]);
};
