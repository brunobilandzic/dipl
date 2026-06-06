import { LoadingFullScreen } from "@/components/layout/loading";
import { ReportItem, ReportSection } from "../dashboard";
import { CultivationCount } from "./cultivation";
import { flatFieldsCultivations } from "@/lib/utils/cultivation/fields/cultivation";

export const FieldStats = ({ fields }) => {
  if (!fields) return <LoadingFullScreen />;

  const cultivationAreas = fields?.flatMap((field) => field.cultivationAreas);
  const cultivations = flatFieldsCultivations(fields);

  return (
    <>
      <ReportSection title="Statistika Polja">
        <FieldCount description="Broj polja" count={fields?.length} />
        <CultivationCount cultivationAreas={cultivationAreas} />
      </ReportSection>
    </>
  );
};

const FieldCount = ({ count, description }) => {
  return <ReportItem description={description} count={count} />;
};
