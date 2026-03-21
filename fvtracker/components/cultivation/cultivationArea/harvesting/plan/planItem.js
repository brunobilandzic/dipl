import Link from "next/link";
import { v4 as uuid } from "uuid";

export const HarvestPlanListItem = ({ plan }) => {
  return (
    <>
      <Link href={`/plan-berbe/${plan.slug}`} className="block p-4 border rounded">
        <div>
          <div className="text-lg font-bold">{plan.name}</div>
          {plan.plannedHarvestingDate && (
            <div className="text-sm text-gray-500">
              <span className="font-semibold">Planirani datum berbe: </span>
              {new Date(plan.plannedHarvestingDate).toLocaleDateString()}
            </div>
          )}
          <HarvestPlanItems items={plan.items} />
        </div>
      </Link>
    </>
  );
};

const HarvestPlanItems = ({ items }) => {
  return (
    <div className="mt-2">
      <div>Stavke:</div>
      <div className="flex flex-wrap gap-4 mt-1">
        {items.map((item) => (
          <div key={uuid()}>
            <HarvestPlanItem item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

const HarvestPlanItem = ({ item }) => {
  return (
    <div className="border p-4 rounded w-[300px]">
      <div>
        <span className="font-semibold">Varijanta: </span>
        {item.cropVariety?.name}
      </div>
      <div>
        <span className="font-semibold">Planirana količina: </span>
        {item.quantity}
      </div>
    </div>
  );
};
