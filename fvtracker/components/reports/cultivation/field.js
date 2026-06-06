import { LoadingFullScreen } from "@/components/layout/loading";
import { ReportItem, ReportSection } from "../dashboard";
import { CultivationCount } from "./cultivation";

export const FieldStats = ({ fields }) => {
  const cultivationAreas = fields?.flatMap((field) => field.cultivationAreas);
  if (!fields) return <LoadingFullScreen />;
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
