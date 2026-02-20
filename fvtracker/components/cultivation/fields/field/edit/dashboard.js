import CreateCA from "./createCA";

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
    <div className="w-full flex justify-center items-center">
      <CreateCA
        getNewCOCoordinates={getNewCOCoordinates}
        cultivationAreaDimensions={cultivationAreaDimensions}
        fieldId={fieldId}
        emptyCACoordinates={emptyCACoordinates}
        setField={setField}
        setPlantedCells={setPlantedCells}
        setIsBeginSelected={setIsBeginSelected}
      />
    </div>
  );
}


