import {
  cultivatedVarieties,
  worksCoordsSum,
} from "@/lib/utils/workers/cultivation";

export const CultivationWorkerInfo = ({ plantageWorks, harvestWorks }) => {
  console.log({
    plantageWorks,
    harvestWorks,
  });

  const plantedVarieties = cultivatedVarieties({
    works: plantageWorks,
    plant: true,
  });
  const harvestedVarieties = cultivatedVarieties({
    works: harvestWorks,
    plant: false,
  });

  console.log({
    plantedVarieties,
    harvestedVarieties,
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

const VarietiesList = ({ cultivation }) => {
  return <div className="list"></div>;
};
