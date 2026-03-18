"use client";

import { Loading } from "@/components/layout/loading";
import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import utils from "@/lib/utils";
import { setFields } from "@/store/cultivation";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import { PlantingPlanListItem } from "./planItem";

const PlantingPlanList = () => {
  const fields = useSelector((state) => state.cultivation.fields);
  const dispatch = useDispatch();

  const refreshFields = async () => {
    try {
      const res = await api.get("/cultivation/fields");
      if (res.data && res.data.fields) {
        dispatch(setFields(res.data.fields));
      }
    } catch (error) {
      console.log("Error fetching fields:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      alert(`Error fetching fields: ${errorMessage}`);
    }
  };

  useEffect(() => {
    if (fields && fields.length > 0) return;

    refreshFields();
  }, [fields]);

  const deletePlans = async () => {
    try {
      const res = await api.delete("/cultivation/plant/plan", {});
      refreshFields();
    } catch (error) {
      handleError({
        ...error,
        generalMessage: "Error deleting planting plans",
      });
    }
  };

  if (!fields || fields.length === 0)
    return (
      <div className="w-full py-4 flex items-center justify-center">
        <Loading />
      </div>
    );

  const fieldsPlans = utils.plant.getFieldsPlans(fields);
  return (
    <>
      <div>
        <div>
          {fieldsPlans.map((fieldPlans, index) => (
            <div key={uuid()}>
              <FieldPlansItem fieldPlans={fieldPlans} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <button
          onClick={deletePlans}
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Delete Plans
        </button>
      </div>
    </>
  );
};

function FieldPlansItem({ fieldPlans }) {
  const { fieldName, plantingPlans } = fieldPlans;
  return (
    <div>
      <div className="font-bold text-lg mb-4">{fieldName}:</div>
      {plantingPlans?.length > 0 ? (
        <div className="flex flex-col">
          {plantingPlans.map((plan) => (
            <div key={uuid()} className="mb-2">
              <PlantingPlanListItem plan={plan} />
            </div>
          ))}
        </div>
      ) : (
        "No planting plans for this field."
      )}
    </div>
  );
}

export default PlantingPlanList;
