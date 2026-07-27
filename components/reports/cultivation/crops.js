import { useSelector } from "react-redux";
import { ReportItem, ReportSection } from "../dashboard";
import { LoadingFullScreen } from "@/components/layout/loading";
import {
  getFieldsHarvestingPlans,
  getFieldsPlantingPlans,
} from "@/lib/utils/cultivation/plant/plans";

export const CropsReportSection = ({ fields }) => {
  const fieldsHarvestingPlans = getFieldsHarvestingPlans(fields);
  const fieldsPlantingPlans = getFieldsPlantingPlans(fields);

  const harvestingPlanItems = fieldsHarvestingPlans?.flatMap((fieldPlan) =>
    fieldPlan.harvestingPlans.flatMap((plan) => plan.items),
  );
  const plantingPlanItems = fieldsPlantingPlans?.flatMap((fieldPlan) =>
    fieldPlan.plantingPlans.flatMap((plan) => plan.items),
  );

  const crops = useSelector((state) => state.cultivation.crops);
  const harvestingBatches = useSelector(
    (state) => state.production.harvestingBatches.items,
  );

  if (!crops || !harvestingBatches) {
    console.log("crops or harvestingBatches not loaded yet", {
      crops,
      harvestingBatches,
    });
    return <LoadingFullScreen />;
  }

  const plantedCropsLength = plantingPlanItems?.reduce(
    (sum, hpi) => hpi.plantedCropVarieties.length + sum,
    0,
  );
  const harvestedCropsLength = harvestingPlanItems?.reduce(
    (sum, hpi) => hpi.plantedCropVarieties.length + sum,
    0,
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

  const plCvQuantity = plantingPlanItems?.reduce(
    (sum, hpi) =>
      sum + hpi.plantedCropVarieties.length * hpi.cropVariety.quantityPerCell,
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
          plantedCropsLength={plantedCropsLength}
          cvQuantity={plCvQuantity}
        />
        <HarvestedCropsCount
          harvestedCropsLength={harvestedCropsLength}
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
