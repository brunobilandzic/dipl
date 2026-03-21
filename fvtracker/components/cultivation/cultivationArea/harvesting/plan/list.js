"use client";

import { Loading } from "@/components/layout/loading";
import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { setFields } from "@/store/cultivation";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import { HarvestPlanListItem } from "./planItem";

const HarvestPlanList = () => {
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
      await api.delete("/cultivation/harvest/plan", {});
      refreshFields();
    } catch (error) {
      handleError({ ...error, generalMessage: "Error deleting harvest plans" });
    }
  };

  if (!fields || fields.length === 0)
    return (
      <div className="w-full py-4 flex items-center justify-center">
        <Loading />
      </div>
    );

  const fieldsHarvestPlans = getFieldsHarvestPlans(fields);
  return (
    <>
      <div>
        {fieldsHarvestPlans.map((fieldPlans) => (
          <div key={uuid()}>
            <FieldHarvestPlansItem fieldPlans={fieldPlans} />
          </div>
        ))}
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

function FieldHarvestPlansItem({ fieldPlans }) {
  const { fieldName, harvestPlans } = fieldPlans;
  return (
    <div>
      <div className="font-bold text-lg mb-4">{fieldName}:</div>
      {harvestPlans?.length > 0 ? (
        <div className="flex flex-col">
          {harvestPlans.map((plan) => (
            <div key={uuid()} className="mb-2">
              <HarvestPlanListItem plan={plan} />
            </div>
          ))}
        </div>
      ) : (
        "Nema planova berbe za ovo polje."
      )}
    </div>
  );
}

function getFieldsHarvestPlans(fields) {
  const result = [];
  fields.forEach((field) => {
    if (!field.harvestPlans) return;
    result.push({ fieldName: field.name, harvestPlans: field.harvestPlans });
  });
  return result;
}

export default HarvestPlanList;
