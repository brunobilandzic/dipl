"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import api from "@/lib/api";
import { Loading } from "@/components/layout/loading";
import { setFields } from "@/store/cultivation";
import {
  PlanDates,
  PlantingPlanItems,
} from "@/components/cultivation/cultivationArea/plans/planting/plan/planItem";
import { FillPlanInfo } from "@/components/cultivation/cultivationArea/plans/planting/plan/create";

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

  const refreshFields = async () => {
    try {
      const res = await api.get("/cultivation/fields");
      if (res.data?.fields && Array.isArray(res.data.fields) && res.data.fields.length > 0) {
        dispatch(setFields(res.data.fields));
      }
    } catch (error) {
      console.log("Error fetching fields:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Nepoznata greška";
      alert(`Greška pri dohvaćanju polja: ${errorMessage}`);
    }
  };

  useEffect(() => {
    if (fields && fields.length > 0) return;
    refreshFields();
  }, [fields]);

  const foundData = useMemo(() => {
    return findPlanFromFields({ fields, slug, plant });
  }, [fields, slug, plant]);

  const plan = foundData?.plan || null;
  const selectedField = foundData?.field || plan?.field || null;

  if (!fields || fields.length === 0) {
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
              await refreshFields();
              setIsEditing(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
