"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { setFields } from "@/store/cultivation";

import React from "react";
import { getPlantingPlanFromFields } from "@/lib/utils/plans";

const PlantiPlanPageComponent = ({ slug }) => {
  const fields = useSelector((state) => state.cultivation.fields);
  const [plantingPlan, setPlantingPlan] = useState(null);
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

  useEffect(() => {
    console.log("Fields updated:", fields);
    if (!fields || fields.length === 0) return;

    setPlantingPlan(
      getPlantingPlanFromFields({
        fields,
        slug,
      }),
    );
  }, [fields, slug]);

  useEffect(() => {
    console.log("Planting Plan:", plantingPlan);
  }, [plantingPlan, fields]);

  return <div>{slug}</div>;
};

export default PlantiPlanPageComponent;
