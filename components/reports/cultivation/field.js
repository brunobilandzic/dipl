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

  const plantingPlans = fields.flatMap((field) => field.plantingPlans || []);
  const harvestingPlans = fields.flatMap(
    (field) => field.harvestingPlans || [],
  );
  const plantingPlanItems = plantingPlans.reduce(
    (sum, plan) => sum + (plan.items?.length || 0),
    0,
  );
  const harvestingPlanItems = harvestingPlans.reduce(
    (sum, plan) => sum + (plan.items?.length || 0),
    0,
  );

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
        <ReportItem description="Planovi sadnje" count={plantingPlans.length} />
        <ReportItem
          description="Stavke planova sadnje"
          count={plantingPlanItems}
        />
        <ReportItem
          description="Planovi berbe"
          count={harvestingPlans.length}
        />
        <ReportItem
          description="Stavke planova berbe"
          count={harvestingPlanItems}
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
