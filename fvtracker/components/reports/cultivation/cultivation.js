import { ReportItem } from "../dashboard";

export const CultivationAreasStats = ({ cultivationAreas }) => {
  return (
    <>
      <ReportItem
        description="Broj površina za gredice"
        count={cultivationAreas?.length}
      />
    </>
  );
};
