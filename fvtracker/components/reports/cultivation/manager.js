import { ReportSector } from "../dashboard";
import { FieldStats } from "./field";

export const CultivationManagerReports = ({}) => {
  const fields = useSelector((state) => state.cultivation.fields);
  return (
    <ReportSector title="Kultivacija">
      <FieldStats fields={fields} />
    </ReportSector>
  );
};
