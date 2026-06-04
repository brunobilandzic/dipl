import { ReportItem } from "../dashboard";

export const CultivationCount = ({ cultivationAreas }) => {
  console.log({ cultivationAreas });
  const cultivationsCount = cultivationAreas?.reduce(
    (count, ca) => count + ca.cultivations?.length,
    0,
  );
  console.log({ cultivationsCount });
  return (
    <>
      <CultivationAreasCount count={cultivationAreas?.length} />
      <CultivationsCount count={cultivationsCount} />
    </>
  );
};

const CultivationAreasCount = ({ count }) => {
  return (
    <>
      <ReportItem description="Površina za gredice" count={count} />
    </>
  );
};

const CultivationsCount = ({ count }) => {
  return (
    <>
      <ReportItem description="Gredica" count={count} />
    </>
  );
};
