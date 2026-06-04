import { ReportItem, ReportsDashboard, ReportSection } from "../dashboard";

export const FieldStats = ({ fields }) => {
  return (
    <>
      <ReportSection title="Statistika Polja">
        <FieldCount description="Broj polja" count={fields?.length} />
      </ReportSection>
    </>
  );
};

const FieldCount = ({ count, description }) => {
  return <ReportItem description={description} count={count} />;
};
