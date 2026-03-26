"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "@/components/layout/loading";
import {
  PlanDates,
  PlantingPlanItems,
} from "@/components/cultivation/cultivationArea/plans/planting/plan/planItem";
import { FillPlanInfo } from "@/components/cultivation/cultivationArea/plans/planting/plan/create";
import { refreshFields } from "@/lib/utils/fields";

const findPlanFromFields = ({ fields, slug, plant = true }) => {
  if (!fields || fields.length === 0) return null;

  for (const field of fields) {
    const plans = plant ? field.plantingPlans : field.harvestingPlans;
    if (!plans || plans.length === 0) continue;

    const found = plans.find((plan) => plan.slug === slug);
    if (found) {
      return {
        plan: found,
        field,
      };
    }
  }

  return null;
};

export default function PlanPageComponent({ slug, plant = true }) {
  const fields = useSelector((state) => state.cultivation.fields);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (fields) return;
    refreshFields({ dispatch });
  }, [fields]);

  const foundData = useMemo(() => {
    return findPlanFromFields({ fields, slug, plant });
  }, [fields, slug, plant]);

  const plan = foundData?.plan || null;
  const selectedField = foundData?.field || plan?.field || null;

  if (!fields) {
    return (
      <div className="w-full py-6 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!plan) {
    return <div>Plan nije pronađen.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xl font-bold">{plan.name}</div>
            <div className="text-sm text-gray-600">
              Polje: {selectedField?.name || "Nepoznato"}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/${plant ? "plan-sadnje" : "plan-berbe"}`}>
              <div className="btn">Natrag na popis</div>
            </Link>
            <button
              className="btn"
              onClick={() => setIsEditing((prev) => !prev)}
              type="button"
            >
              {isEditing ? "Odustani" : "Uredi plan"}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <PlanDates
            plannedPlantingDate={plan.plannedPlantingDate}
            plannedHarvestingDate={plan.plannedHarvestingDate}
          />
          <PlantingPlanItems items={plan.items || []} />
        </div>
      </div>

      {isEditing ? (
        <div className="rounded-lg border p-4">
          <FillPlanInfo
            selectedField={selectedField}
            setSelectedField={() => null}
            plant={plant}
            initialPlan={plan}
            submitButtonLabel="Spremi promjene"
            onSaved={async () => {
              await refreshFields({ dispatch });
              setIsEditing(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
