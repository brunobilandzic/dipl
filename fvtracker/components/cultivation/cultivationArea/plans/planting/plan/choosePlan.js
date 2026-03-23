import { checkPlansEmpty } from "@/lib/utils/plans";

export const ChoosePlan = ({
  availablePlans,
  onChoosePlan,
  onCancel,
  selectedPlan,
  cropVarietyId,
  plant,
}) => {
  console.log("selectedPlan:", selectedPlan);
  console.log("availablePlans in ChoosePlan:", availablePlans);

  if (!availablePlans) {
    return (
      <div className="p-4">
        <p>Nema dostupnih planova sadnje za odabranu sortu.</p>
      </div>
    );
  }

  const getAvailablePlans = () => {
    checkPlansEmpty(availablePlans);
    return plant
      ? availablePlans.plantingPlans
      : availablePlans.harvestingPlans;
  };

  console.log("Rendering ChoosePlan with availablePlans:", availablePlans);
  return (
    <div className="flex flex-wrap p-4 border">
      <div className="w-full mb-4">
        <p className="font-bold">
          Odaberite plan {plant ? "sadnje" : "berbe"} za odabranu sortu:
        </p>
      </div>
      {getAvailablePlans().map((avPlan) => {
        const plantingPlanItem = avPlan.items.find(
          (item) => item.cropVariety?._id === cropVarietyId,
        );
        console.log(
          "Found planting plan item for cultivation:",
          plantingPlanItem,
        );
        console.log("item:", plantingPlanItem);
        return (
          <div
            key={avPlan._id}
            className={`  p-2 m-2 border rounded cursor-pointer ${selectedPlan?._id === avPlan._id ? "border-green-200 ring-green-500 ring-2" : ""}`}
            onClick={() => onChoosePlan(avPlan)}
          >
            <p>Plan sadnje: {avPlan.name}</p>
            <p>Varijanta: {plantingPlanItem?.cropVariety?.name}</p>
            <p>Planirana količina: {plantingPlanItem?.quantity}</p>
          </div>
        );
      })}
    </div>
  );
};
