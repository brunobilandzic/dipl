import { ListItem } from "@/components/layout/preview/list";
import utils from "@/lib/utils";
import { getCANameFromPlantedCropVarietiesInCultivation } from "@/lib/utils/cultivation/fields/cultivationAreas";
import { v4 as uuid } from "uuid";

export const PlantingPlanListItem = ({ plan, plant = true, onDelete }) => {
  const actionOptions = [
    {
      label: "Obriši",
      onClick: onDelete,
      className: "btn cancelButton btnSm",
    },
  ];
  console.log({ plan });
  return (
    <>
      <ListItem actionOptions={actionOptions}>
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="text-lg font-bold ">{plan.name}</div>
          <div className="text-sm text-gray-500 flex flex-col gap-1">
            <div className="flex gap-1">
              <div>kreirano:</div>{" "}
              {new Date(plan.createdAt).toLocaleDateString("hr-HR")}
            </div>
          </div>
        </div>

        <PlantingPlanItems items={plan.items} plant={plant} />
      </ListItem>
    </>
  );
};

export const PlantingPlanItems = ({ items, plant }) => {
  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="font-bold text-green-900">Stavke plana:</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
        {items.map((item) => (
          <div key={uuid()} className="">
            <PlantingPlanItem item={item} plant={plant} />
          </div>
        ))}
      </div>
    </div>
  );
};

const PlantingPlanItem = ({ item, plant }) => {
  const plcvs = 0;
  return (
    <div className="border h-full p-4 rounded w-full">
      <div>
        <span className="font-semibold">Vrsta: </span>
        {item.cropVariety?.name}
      </div>
      <div>
        <span className="font-semibold">Količina: </span>
        {item.quantity}
      </div>
      {plant && item.plannedHarvestingDate ? (
        <div>
          <span className="font-semibold">Berba: </span>
          {new Date(item.plannedHarvestingDate).toLocaleDateString("hr-HR")}
        </div>
      ) : null}
      <div>
        <span className="font-semibold">{plant ? "Zasađene" : "Ubrane"} vrste: </span>
        <PlantedCropVarietiesPlan
          plantedCropVarieties={item.plantedCropVarieties}
          plant={plant}
        />
      </div>
    </div>
  );
};

const PlantedCropVarietiesPlan = ({ plantedCropVarieties, plant }) => {
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
                - {cultivationName}: {plantedCropVarieties?.length || 0}{" "}
                {plant ? "zasađenih " : "ubranih "}
                zasada.
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
