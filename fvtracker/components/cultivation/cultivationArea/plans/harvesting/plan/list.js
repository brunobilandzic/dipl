"use client";

import { Loading } from "@/components/layout/loading";
import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import utils from "@/lib/utils";
import { setFields } from "@/store/cultivation";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import { FieldPlansItem } from "@/components/cultivationArea/plans/planting/plan/list";

const HarvestingPlanList = () => {
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
        error.response?.data?.message || error.message || "Nepoznata greška";
      alert(`Greška pri dohvaćanju polja: ${errorMessage}`);
    }
  };

  useEffect(() => {
    if (fields && fields.length > 0) return;

    refreshFields();
  }, [fields]);

  const deletePlans = async () => {
    try {
      const res = await api.delete("/cultivation/harvest/plan", {});
      refreshFields();
    } catch (error) {
      handleError({
        ...error,
        generalMessage: "Greška pri brisanju planova berbe",
      });
    }
  };

  if (!fields || fields.length === 0)
    return (
      <div className="w-full py-4 flex items-center justify-center">
        <Loading />
      </div>
    );
  console.log("fields:", fields);
  const fieldsPlans = utils.plans.getFieldsHarvestingPlans(fields);
  return (
    <>
      <div>
        <div>
          {fieldsPlans.map((fieldPlan, index) => (
            <div key={uuid()}>
              <FieldPlansItem fieldPlans={fieldPlan} plant={false} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <button
          onClick={deletePlans}
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Obriši planove
        </button>
      </div>
    </>
  );
};

export default HarvestingPlanList;
