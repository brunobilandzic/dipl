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
      <div className="info-group-title">Podaci o radu</div>
      <div className="info-group">
        <div>Obavljeno sadnji: {plantageWorks.length}</div>
        <div>
          Ukupno posađeno ćelija:{" "}
          {worksCoordsSum({ works: plantageWorks, plant: true })}
        </div>
      </div>
      <div className="info-group">
        <div>Obavljeno žetvi: {harvestWorks.length}</div>
        <div>
          Ukupno požnjeveno ćelija: {worksCoordsSum({ works: harvestWorks })}
        </div>
      </div>
      <VarietiesList varietiesMap={plantedVarieties} plant={true} />
      <VarietiesList varietiesMap={harvestedVarieties} plant={false} />
    </div>
  );
};

const VarietiesList = ({ varietiesMap, plant = true }) => {
  return (
    <div className="list-wrap">
      <div className="list-wrap-title">
        {plant ? "Zasađeni plodovi" : "Ubrani plodovi"}
      </div>
      <ul className="list-wrap-list list-disc list-inside">
        {varietiesMap.map((variety) => (
          <li key={`${variety.name}-${variety.quantity}`}>
            {variety.name}: {variety.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};
