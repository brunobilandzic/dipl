import utils from "@/lib/utils";
import Link from "next/link";
import { v4 as uuid } from "uuid";

export const PlantingPlanListItem = ({ plan }) => {
  return (
    <>
      <Link
        href={`/cultivation/plan/${plan.slug}`}
        className="block p-4 border rounded"
      >
        <div>
          <div className="text-lg font-bold ">{plan.name}</div>
          <PlanDates
            plannedPlantingDate={plan.plannedPlantingDate}
            plannedHarvestingDate={plan.plannedHarvestingDate}
          />
          <PlantingPlanItems items={plan.items} />
        </div>
      </Link>
    </>
  );
};

const PlanDates = ({ plannedPlantingDate, plannedHarvestingDate }) => {
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

const PlantingPlanItems = ({ items }) => {
  return (
    <div className="mt-2">
      <div>Items:</div>
      <div className="flex flex-wrap gap-4 mt-1">
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
    <div className="border p-4 rounded w-[300px]">
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
  console.log(
    "PlantedCropVarietiesPlan - input plantedCropVarieties:",
    plantedCropVarieties,
  );
  const plantedCropVarietiesPerCultivation =
    utils.plans.getPlantedCropVarietesPerCultivation({
      plantedCropVarieties,
    });

  console.log(
    "plantedCropVarietiesPerCultivation:",
    plantedCropVarietiesPerCultivation,
  );

  return (
    <div>
      {JSON.stringify(plantedCropVarietiesPerCultivation, null, 2)}
      {plantedCropVarieties && plantedCropVarieties.length > 0 ? (
        Object.entries(plantedCropVarietiesPerCultivation).map(
          ([cultivationName, plantedCropVarieties]) => (
            <div key={cultivationName}>
              <div className="font-semibold">{cultivationName}:</div>
              <ul className="list-disc list-inside">
                {plantedCropVarieties.map((plantedCropVariety) => (
                  <li key={plantedCropVariety._id}>
                    {plantedCropVariety.plantingPlanItem.cropVariety?.name} -{" "}
                    {plantedCropVariety.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ),
        )
      ) : (
        <div>No planted crop varieties</div>
      )}
    </div>
  );
};
