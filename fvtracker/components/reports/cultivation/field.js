import { ReportItem, ReportsDashboard, ReportSection } from "../dashboard";
import { CultivationAreasStats } from "./cultivation";

export const FieldStats = ({ fields }) => {
  const cultivationAreas = fields.flatMap((field) => field.cultivationAreas);
  return (
    <>
      <ReportSection title="Statistika Polja">
        <FieldCount description="Broj polja" count={fields?.length} />
        <CultivationAreasStats cultivationAreas={cultivationAreas} />
      </ReportSection>
    </>
  );
};

const FieldCount = ({ count, description }) => {
  return <ReportItem description={description} count={count} />;
};
