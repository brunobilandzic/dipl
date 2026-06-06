import { useSelector } from "react-redux";
import { ReportItem, ReportSection } from "../dashboard";
import { LoadingFullScreen } from "@/components/layout/loading";

export const CropsReportSection = ({ fields }) => {
  const cultivationAreas = fields?.flatMap((field) => field.cultivationAreas);
  const cultivations = cultivationAreas?.flatMap((area) => area.cultivations);

  const crops = useSelector((state) => state.cultivation.crops);
  const harvestingBatches = useSelector(
    (state) => state.production.harvestingBatches.items,
  );

  if (!crops || !harvestingBatches) return <LoadingFullScreen />;

  const plantedCrops = cultivations?.flatMap((cultivation) =>
    cultivation.plantedCropVarieties.filter((plcv) => plcv.plantingPlanItem),
  );
  const harvestedCrops = cultivations?.flatMap((cultivation) =>
    cultivation.plantedCropVarieties.filter((plcv) => plcv.harvestingPlanItem),
  );
  const batchItems = harvestingBatches?.flatMap(
    (batch) => batch.harvestingBatchItems,
  );

  const plCvQuantity = plantedCrops.reduce(
    (sum, plcv) => plcv.plantingPlanItem.cropVariety.quantityPerCell + sum,
    0,
  );

  const hvCvQuantity = harvestedCrops.reduce(
    (sum, plcv) => plcv.harvestingPlanItem.cropVariety.quantityPerCell + sum,
    0,
  );

  return (
    <>
      <ReportSection title="Plodovi">
        <CropsCount
          generalTypesLength={crops?.generalTypes?.length}
          cropTypesLength={crops?.types?.length}
          cropVarietiesLength={crops?.varieties?.length}
        />
        <PlantedCropsCount
          plantedCropsLength={plantedCrops?.length}
          cvQuantity={plCvQuantity}
        />
        <HarvestedCropsCount
          harvestedCropsLength={harvestedCrops?.length}
          cvQuantity={hvCvQuantity}
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

const PlantedCropsCount = ({ plantedCropsLength, cvQuantity }) => {
  return (
    <>
      <ReportItem description={"Zasađenih ćelija"} count={plantedCropsLength}>
        Količina {cvQuantity}
      </ReportItem>
    </>
  );
};

const HarvestedCropsCount = ({ harvestedCropsLength, cvQuantity }) => {
  return (
    <>
      <ReportItem description={"Ubranih ćelija"} count={harvestedCropsLength}>
        Količina {cvQuantity}
      </ReportItem>
    </>
  );
};
