import { LoadingFullScreen } from "../layout/loading";

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
      <div>
        Plaće:{" "}
        {workers.reduce(
          (total, worker) =>
            total +
            (worker.plantageWorks.length + worker.harvestWorks.length) *
              worker.hourlyRate,
          0,
        )}
      </div>
      <div>
        Isplaćeno:{" "}
        {workers.reduce((total, worker) => total + worker.payedAmount, 0)}
      </div>
    </div>
  );
};
