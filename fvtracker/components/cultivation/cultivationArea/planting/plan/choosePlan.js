export const ChoosePlan = ({ availablePlantingPlans, onChoose, onCancel }) => {
  if (!availablePlantingPlans || availablePlantingPlans.length === 0) {
    return (
      <div className="p-4">
        <p>Nema dostupnih planova sadnje za odabranu sortu.</p>
      </div>
    );
  }
  return <div className="flex flex-wrap"></div>;
};
