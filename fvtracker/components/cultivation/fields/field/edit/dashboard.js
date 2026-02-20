import CreateCA from "./createCA";
import { EditCA } from "./editCA";

export function FieldEditDashboard({
  getNewCOCoordinates,
  emptyCACoordinates,
  cultivationAreaDimensions,
  fieldId,
  setField,
  setPlantedCells,
  setIsBeginSelected,
}) {
  return (
    <div className="w-full flex justify-center items-center gap-4">
      <CreateCA
        getNewCOCoordinates={getNewCOCoordinates}
        cultivationAreaDimensions={cultivationAreaDimensions}
        fieldId={fieldId}
        emptyCACoordinates={emptyCACoordinates}
        setField={setField}
        setPlantedCells={setPlantedCells}
        setIsBeginSelected={setIsBeginSelected}
      />
      <EditCA />
    </div>
  );
}


