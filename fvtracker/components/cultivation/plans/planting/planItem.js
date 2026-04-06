import { ListItem } from "@/components/layout/preview/list";
import utils from "@/lib/utils";
import { getCANameFromPlantedCropVarietiesInCultivation } from "@/lib/utils/cultivation/cultivationAreas";
import { v4 as uuid } from "uuid";

export const PlantingPlanListItem = ({ plan, plant = true, onDelete }) => {
  const actionOptions = [
    {
      label: "Obriši",
      onClick: onDelete,
      className: "btn cancelButton btnSm",
    },
  ];
  return (
    <>
      <ListItem actionOptions={actionOptions}>
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold ">{plan.name}</div>
        </div>

        <PlantingPlanItems items={plan.items} />
      </ListItem>
    </>
  );
};

export const PlantingPlanItems = ({ items }) => {
  return (
    <div className="mt-2 flex flex-col gap-2">
      <div>Items:</div>
      <div className="">
        {items.map((item) => (
          <div key={uuid()} className="">
            <PlantingPlanItem item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

const PlantingPlanItem = ({ item }) => {
  const plcvs = 0
  return (
    <div className="border p-4 rounded w-full">
      <div>
        <span className="font-semibold">Vrsta: </span>
        {item.cropVariety?.name}
      </div>
      <div>
        <span className="font-semibold">Količina: </span>
        {item.quantity}
      </div>
      <div>
        <span className="font-semibold">Planted Crop Varieties: </span>
        <PlantedCropVarietiesPlan
          plantedCropVarieties={item.plantedCropVarieties}
        />
      </div>
    </div>
  );
};

const PlantedCropVarietiesPlan = ({ plantedCropVarieties }) => {
  const plantedCropVarietiesPerCultivation =
    utils.plans.getPlantedCropVarietesPerCultivation({
      plantedCropVarieties,
    });

  return (
    <div>
      {plantedCropVarieties && plantedCropVarieties.length > 0 ? (
        Object.entries(plantedCropVarietiesPerCultivation).map(
          ([cultivationName, plantedCropVarieties]) => (
            <div key={cultivationName}>
              <div className="font-semibold">
                {getCANameFromPlantedCropVarietiesInCultivation({
                  plantedCropVariety: plantedCropVarieties[0],
                })}{" "}
                - {cultivationName}: {plantedCropVarieties?.length || 0} planted
                crop varieties
              </div>
              {/* <ul className="list-disc list-inside">
                {plantedCropVarieties.map((plantedCropVariety) => {
                  console.log(
                    "Rendering plantedCropVariety:",
                    plantedCropVariety,
                  );
                  return (
                    <li key={plantedCropVariety._id}>
                      {plantedCropVariety.cultivation?.cultivationArea?.name} -{" "}
                      {plantedCropVariety.cultivation?.name} -{" "}
                      {plantedCropVariety.plantedAt}
                    </li>
                  );
                })}
              </ul> */}
            </div>
          ),
        )
      ) : (
        <div>No planted crop varieties</div>
      )}
    </div>
  );
};
