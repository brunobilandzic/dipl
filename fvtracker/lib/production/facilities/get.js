import { ProductionFacility } from "@/models/sectors/production/Facility";

export const getFacilities = async ({ slug }) => {
  if (slug) {
    const facility = await ProductionFacility.findOne({ slug });
    await populateFacilities(facility);
    return facility;
  }
  const facilities = await ProductionFacility.find({});
  await populateFacilities(facilities);
  return facilities;
};

export const populateFacilities = async (facilities) => {
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
