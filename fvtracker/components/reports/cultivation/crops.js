import { useSelector } from "react-redux";
import { ReportItem, ReportSection } from "../dashboard";

export const CropsReportSection = ({ fields }) => {
  const cultivationAreas = fields?.flatMap((field) => field.cultivationAreas);
  const cultivations = cultivationAreas?.flatMap((area) => area.cultivations);

  const crops = useSelector((state) => state.cultivation.crops);

  const plantedCrops = cultivations?.flatMap((cultivation) =>
    cultivation.plantedCropVarieties.filter((plcv) => plcv.plantingPlanItem),
  );
  const harvestedCrops = cultivations?.flatMap((cultivation) =>
    cultivation.plantedCropVarieties.filter((plcv) => plcv.harvestingPlanItem),
  );

  return (
    <>
      <ReportSection title="Plodovi">
        <CropsCount
          generalTypesLength={crops?.generalTypes?.length}
          cropTypesLength={crops?.types?.length}
          cropVarietiesLength={crops?.varieties?.length}
        />
        <PlantedCropsCount plantedCropsLength={plantedCrops?.length} />
        <HarvestedCropsCount harvestedCropsLength={harvestedCrops?.length} />
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

const PlantedCropsCount = ({ plantedCropsLength }) => {
  return (
    <>
      <ReportItem description={"Zasađenih sorti"} count={plantedCropsLength} />
    </>
  );
};

const HarvestedCropsCount = ({ harvestedCropsLength }) => {
  return (
    <>
      <ReportItem description={"Ubranih sorti "} count={harvestedCropsLength} />
    </>
  );
};
