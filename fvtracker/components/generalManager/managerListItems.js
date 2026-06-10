import { useSelector } from "react-redux";
import { LoadingFullScreen } from "../layout/loading";
import { ManagerWorkers } from "./managerWorkers";

export const CultivationManagerListItem = ({ workers }) => {
  const fields = useSelector((state) => state.cultivation.fields);
  if (!fields) return <LoadingFullScreen />;
  return (
    <div className="listitemDescription">
      <div> Kreirano polja: {fields.length}</div>
      <div>
        Kreirano polja za gredice:{" "}
        {fields.flatMap((field) => field.cultivationAreas).length}
      </div>
      <div>
        Kreirano gredica:{" "}
        {
          fields
            .flatMap((field) => field.cultivationAreas)
            .flatMap((area) => area.cultivations).length
        }
      </div>
      <div>Zaposleno radnika: {workers.length}</div>
      <ManagerWorkers workers={workers} />
    </div>
  );
};
