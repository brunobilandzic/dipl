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

  const uniqueVarietiesSet = new Set();
  batchItems.forEach((item) => {
    if (item.cropVariety) {
      uniqueVarietiesSet.add(item.cropVariety.name);
    }
  });
  const uniqueVarietiesLength = uniqueVarietiesSet.size;

  console.log({ uniqueVarieties: Array.from(uniqueVarietiesSet) });
  console.log({ batchItems });

  const plCvQuantity = plantedCrops.reduce(
    (sum, plcv) => plcv.plantingPlanItem.cropVariety.quantityPerCell + sum,
    0,
  );

  const hvCvQuantity = batchItems.reduce(
    (sum, item) => sum + item.batchQuantity,
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
          uniqueVarietiesLength={uniqueVarietiesLength}
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

const HarvestedCropsCount = ({
  harvestedCropsLength,
  cvQuantity,
  uniqueVarietiesLength,
}) => {
  return (
    <>
      <ReportItem
        description={"Različitih sorti ubranih"}
        count={uniqueVarietiesLength}
      />
      <ReportItem description={"Ubranih ćelija"} count={harvestedCropsLength}>
        Količina {cvQuantity}
      </ReportItem>
    </>
  );
};
