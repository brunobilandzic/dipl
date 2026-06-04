import { ReportItem, ReportsDashboard, ReportSection } from "../dashboard";

export const FieldStats = ({ fields }) => {
  return (
    <>
      <div className="text-2xl font-bold mb-4">Statistika polja</div>
      <ReportSection title="Polja">
        <FieldCount title="Broj polja" count={fields.length} />
      </ReportSection>
    </>
  );
};

const FieldCount = ({ count, title }) => {
  return <ReportItem title={title} count={count} />;
};
