export const ChoosePlan = ({
  availablePlantingPlans,
  onChoosePlan,
  onCancel,
}) => {
  if (!availablePlantingPlans || availablePlantingPlans.length === 0) {
    return (
      <div className="p-4">
        <p>Nema dostupnih planova sadnje za odabranu sortu.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap p-4 border">
      {availablePlantingPlans.map((avPlan) => (
        <div
          key={avPlan._id}
          className="p-2 border rounded cursor-pointer"
          onClick={() => onChoosePlan(avPlan)}
        >
          <p>Plan sadnje: {avPlan.plantingPlanName}</p>
          <p>Količina: {avPlan.quantity}</p>
        </div>
      ))}
    </div>
  );
};
