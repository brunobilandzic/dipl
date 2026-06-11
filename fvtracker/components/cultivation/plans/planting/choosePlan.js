import { checkPlansEmpty } from "@/lib/utils/cultivation/plant/plans";

export const ChoosePlan = ({
  availablePlans,
  onChoosePlan,
  onCancel,
  selectedPlan,
  cropVarietyId,
  plant,
}) => {
  if (!availablePlans) {
    return (
      <div className="p-4">
        <p>
          Nema dostupnih planova {plant ? "sadnje" : "berbe"} za odabranu sortu
          ili količinu.
        </p>
      </div>
    );
  }

  const getAvailablePlans = () => {
    return plant
      ? availablePlans.plantingPlans
      : availablePlans.harvestingPlans;
  };

  if (getAvailablePlans() === undefined) {
    return (
      <div className="p-4">
        <p>
          Nema dostupnih planova {plant ? "sadnje" : "berbe"} za odabranu sortu
          ili količinu.
        </p>
      </div>
    );
  }

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
        return (
          <div
            key={avPlan._id}
            className={`  p-2 m-2 border rounded cursor-pointer ${selectedPlan?._id === avPlan._id ? "border-green-200 ring-green-500 ring-2" : ""}`}
            onClick={() => onChoosePlan(avPlan)}
          >
            <p>
              Plan {plant ? "sadnje" : "berbe"}: {avPlan.name}
            </p>
            <p>Varijanta: {plantingPlanItem?.cropVariety?.name}</p>
            <p>Planirana količina: {plantingPlanItem?.quantity}</p>
          </div>
        );
      })}
    </div>
  );
};
