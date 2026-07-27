import CreateCA from "./createCA";
import { EditCA } from "./editCA";

export function FieldEditDashboard({
  getNewCOCoordinates,
  emptyCACoordinates,
  cultivationAreaDimensions,
  fieldId,
  setField,
  /* setPlantedCells, */
  setIsBeginSelected,
  cultivationAreaMenu,
  setCultivationAreaMenu,
  newCACoordinates,
  setNewCACoordinates,
}) {
  return (
    <div className="w-full flex justify-center items-center gap-4">
      <DashboardItem>
        <CreateCA
          getNewCOCoordinates={getNewCOCoordinates}
          cultivationAreaDimensions={cultivationAreaDimensions}
          fieldId={fieldId}
          emptyCACoordinates={emptyCACoordinates}
          setField={setField}
          /*  setPlantedCells={setPlantedCells} */
          setIsBeginSelected={setIsBeginSelected}
          newCACoordinates={newCACoordinates}
          setNewCACoordinates={setNewCACoordinates}
        />
      </DashboardItem>
      <DashboardItem>
        <EditCA
          cultivationAreaMenu={cultivationAreaMenu}
          setCultivationAreaMenu={setCultivationAreaMenu}
          /*  setPlantedCells={setPlantedCells} */
          setNewCACoordinates={setNewCACoordinates}
        />
      </DashboardItem>
    </div>
  );
}

function DashboardItem({ children }) {
  return (
    <div className="flex flex-col gap-4 align-middle justify-center relative">
      {children}
    </div>
  );
}
