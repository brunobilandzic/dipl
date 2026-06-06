import { LoadingFullScreen } from "@/components/layout/loading";
import { ReportItem, ReportSection } from "../dashboard";
import { CultivationCount } from "./cultivation";
import { flatFieldsCultivations } from "@/lib/utils/cultivation/fields/cultivation";

export const FieldStats = ({ fields }) => {
  if (!fields) return <LoadingFullScreen />;

  const cultivationAreas = fields?.flatMap((field) => field.cultivationAreas);
  const cultivations = flatFieldsCultivations(fields);

  const plantageHours = cultivations.reduce((sum, cul) => {
    const plantageWorksHours = cul.plantageWorks.reduce(
      (hoursSum, work) => hoursSum + work.hoursWorked,
      0,
    );
    return sum + plantageWorksHours;
  }, 0);

  const harvestingHours = cultivations.reduce((sum, cul) => {
    const harvestingWorksHours = cul.harvestWorks.reduce(
      (hoursSum, work) => hoursSum + work.hoursWorked,
      0,
    );
    return sum + harvestingWorksHours;
  }, 0);

  return (
    <>
      <ReportSection title="Statistika Polja">
        <FieldCount description="Broj polja" count={fields?.length} />
        <CultivationCount cultivationAreas={cultivationAreas} />
        <WorhHoursCount
          count={plantageHours}
          description="Sati radova na sadnji"
        />
        <WorhHoursCount
          count={harvestingHours}
          description="Sati radova na berbi"
        />
      </ReportSection>
    </>
  );
};

const WorhHoursCount = ({ count, description }) => {
  return <ReportItem description={description} count={count} />;
};

const FieldCount = ({ count, description }) => {
  return <ReportItem description={description} count={count} />;
};
