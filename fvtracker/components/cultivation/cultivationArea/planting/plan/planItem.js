export const PlantingPlanListItem = ({ plan }) => {
  return (
    <>
      <div>
        <div className="text-lg font-bold ">{plan.name}</div>
        <PlanDates
          plannedPlantingDate={plan.plannedPlantingDate}
          plannedHarvestingDate={plan.plannedHarvestingDate}
        />
        <PlantingPlanItems items={plan.items} />
      </div>
    </>
  );
};

const PlanDates = ({ plannedPlantingDate, plannedHarvestingDate }) => {
  return (
    <div className="text-sm text-gray-500">
      {plannedPlantingDate && (
        <div>
          <span className="font-semibold">Planned Planting Date: </span>
          {new Date(plannedPlantingDate).toLocaleDateString()}
        </div>
      )}
      {plannedHarvestingDate && (
        <div>
          <span className="font-semibold">Planned Harvesting Date: </span>
          {new Date(plannedHarvestingDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

const PlantingPlanItems = ({ items }) => {
  return (
    <div className="mt-2">
      <div>Items:</div>
      <div className="flex flex-wrap gap-4 mt-1">
        {items.map((item) => (
          <div key={item._id} className="">
            <PlantingPlanItem item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

