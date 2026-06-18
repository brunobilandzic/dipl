import {
  cultivatedVarieties,
  worksCoordsSum,
} from "@/lib/utils/workers/cultivation";

export const CultivationWorkerInfo = ({ plantageWorks, harvestWorks }) => {
  console.log({
    plantageWorks,
    harvestWorks,
  });

  const cultivatedVarietiesPlanted = cultivatedVarieties({
    works: plantageWorks,
    plant: true,
  });
  const cultivatedVarietiesHarvested = cultivatedVarieties({
    works: harvestWorks,
    plant: false,
  });

  console.log({
    cultivatedVarietiesPlanted,
    cultivatedVarietiesHarvested,
  });

  return (
    <div>
      <div>Obavljeno sadnji: {plantageWorks.length}</div>
      <div>Obavljeno žetvi: {harvestWorks.length}</div>
      <div>
        Ukupno posađeno ćelija:{" "}
        {worksCoordsSum({ works: plantageWorks, plant: true })}
      </div>
      <div>
        Ukupno požnjeveno ćelija: {worksCoordsSum({ works: harvestWorks })}
      </div>
    </div>
  );
};
