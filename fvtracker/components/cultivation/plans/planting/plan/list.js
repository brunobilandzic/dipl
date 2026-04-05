"use client";

import { Loading } from "@/components/layout/loading";
import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import utils from "@/lib/utils";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import { PlantingPlanListItem } from "@/components/cultivation/plans/planting/plan/planItem";
import { refreshFields } from "@/lib/utils/cultivation/fields";
import { useRouter } from "next/navigation";
import { List } from "@/components/layout/preview/list";

const PlantingPlanList = () => {
  const fields = useSelector((state) => state.cultivation.fields);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (fields) return;

    refreshFields({ dispatch, router });
  }, [fields]);

  const deletePlans = async () => {
    try {
      const res = await api.delete("/cultivation/plant/plan", {});
      refreshFields({ dispatch, router });
    } catch (error) {
      handleError({
        ...error,
        generalMessage: "Greška pri brisanju planova sadnje",
      });
    }
  };

  if (!fields)
    return (
      <div className="w-full py-4 flex items-center justify-center">
        <Loading />
      </div>
    );

  const fieldsPlans = utils.plans.getFieldsPlantingPlans(fields);
  return (
    <>
      <div>
        <List
          title="Planovi sadnje"
          onCreateItem={() => router.push("/plan-sadnje/izradi")}
          onDeleteList={deletePlans}
        >
          {fieldsPlans.map((fieldPlan, index) => (
            <div key={uuid()}>
              <FieldPlansItem fieldPlans={fieldPlan} />
            </div>
          ))}
        </List>
      </div>
    </>
  );
};

export function FieldPlansItem({ fieldPlans, plant = true }) {
  let fieldName, plantingPlans, harvestingPlans;
  if (plant) {
    ({ fieldName, plantingPlans } = fieldPlans);
  } else {
    ({ fieldName, harvestingPlans } = fieldPlans);
  }

  const getPlans = () => {
    console.log("fieldPlans:", fieldPlans);
    if (plant) {
      return plantingPlans?.map((plan) => (
        <div key={uuid()} className="mb-2">
          <PlantingPlanListItem plan={plan} plant={true} />
        </div>
      ));
    } else {
      return harvestingPlans?.map((plan) => (
        <div key={uuid()} className="mb-2">
          <PlantingPlanListItem plan={plan} plant={false} />
        </div>
      ));
    }
  };

  return (
    <div>
      <div className="font-bold text-lg mb-4">{fieldName}:</div>
      <div className="pl-4 my-4 flex flex-col gap-4">{getPlans()}</div>
    </div>
  );
}

export default PlantingPlanList;
