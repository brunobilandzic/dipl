"use client";

import { Loading } from "@/components/layout/loading";
import api from "@/lib/api";
import { setFields } from "@/store/cultivation";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const PlantingPlanList = () => {
  const fields = useSelector((state) => state.cultivation.fields);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fields && fields.length > 0) return;

    (async () => {
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
    })();
  }, [fields]);

  if (!fields || fields.length === 0)
    return (
      <div className="w-full py-4 flex items-center justify-center">
        <Loading />
      </div>
    );
  return <div>{fields?.length}</div>;
};

export default PlantingPlanList;
