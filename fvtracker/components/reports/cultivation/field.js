import { useSelector } from "react-redux";
import { ReportItem, ReportsDashboard } from "../dashboard";

export const FieldStats = ({}) => {
  const fields = useSelector((state) => state.cultivation.fields);

  return (
    <ReportsDashboard>
      <FieldCount title="Broj polja" count={fields.length} />
    </ReportsDashboard>
  );
};

const FieldCount = ({ count, title }) => {
  return <ReportItem title={title} count={count} />;
};
