import { useSelector } from "react-redux";
import { ReportItem, ReportSection } from "../dashboard";

export const CropsReportSection = ({}) => {
  const crops = useSelector((state) => state.cultivation.crops);

  return (
    <>
      <ReportSection title="Plodovi">
        <CropsCount
          generalTypesLength={crops?.generalTypes?.length}
          cropTypesLength={crops?.types?.length}
          cropVarietiesLength={crops?.varieties?.length}
        />
      </ReportSection>
    </>
  );
};

const CropsCount = ({
  generalTypesLength,
  cropTypesLength,
  cropVarietiesLength,
}) => {
  return (
    <>
      <ReportItem description={"Generalnih vrsta"} count={generalTypesLength} />
      <ReportItem description={"Vrsta plodova"} count={cropTypesLength} />
      <ReportItem description={"Sorta plodova"} count={cropVarietiesLength} />
    </>
  );
};
