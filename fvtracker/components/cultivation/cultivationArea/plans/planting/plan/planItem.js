import utils from "@/lib/utils";
import { getCANameFromPlantedCropVarietiesInCultivation } from "@/lib/utils/cultivation/cultivationAreas";
import Link from "next/link";
import { v4 as uuid } from "uuid";

export const PlantingPlanListItem = ({ plan, plant = true }) => {
  return (
    <>
      <div className="border p-4 rounded">
        <div className="text-lg font-bold ">{plan.name}</div>
        <PlantingPlanItems items={plan.items} />
      </div>
    </>
  );
};

export const PlanDates = ({ plannedPlantingDate, plannedHarvestingDate }) => {
  return (
    <div className="text-sm text-gray-500">
      {plannedPlantingDate && (
        <div>
          <span className="font-semibold">Planned Planting Date: </span>
          {new Date(plannedPlantingDate).toLocaleDateString()}
        </div>
      )}
      {plannedHarvestingDate && (
        <div>
          <span className="font-semibold">Planned Harvesting Date: </span>
          {new Date(plannedHarvestingDate).toLocaleDateString()}
        </div>
      )}
    </div>
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
  return (
    <div className="border p-4 rounded w-full">
      <div>
        <span className="font-semibold">Crop Variety: </span>
        {item.cropVariety?.name}
      </div>
      <div>
        <span className="font-semibold">Quantity: </span>
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
