export const ChoosePlan = ({
  availablePlans,
  onChoosePlan,
  onCancel,
  selectedPlan,
  cropVarietyId,
}) => {
  console.log("selectedPlan:", selectedPlan);

  if (!availablePlantingPlans || availablePlantingPlans.length === 0) {
    return (
      <div className="p-4">
        <p>Nema dostupnih planova sadnje za odabranu sortu.</p>
      </div>
    );
  }

  console.log(
    "Rendering ChoosePlan with availablePlantingPlans:",
    availablePlantingPlans,
  );
  return (
    <div className="flex flex-wrap p-4 border">
      {availablePlantingPlans.map((avPlan) => {
        console.log("Rendering available plan:", avPlan);
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
