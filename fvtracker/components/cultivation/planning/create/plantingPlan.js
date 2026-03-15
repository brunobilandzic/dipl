"use client";

import api from "@/lib/api";
import { setFields } from "@/store/cultivation";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function CreatePlantingPlanPageComonent() {
  return (
    <>
      <SelectField />
    </>
  );
}

export default CreatePlantingPlanPageComonent;

export const CreatePlantagePlan = ({}) => {
  return (
    <>
      <Link href={"/plan-sadnje/izradi"}>
        <div className="btn">Izradi plan sadnje</div>
      </Link>
    </>
  );
};

const SelectField = ({ selectedField, setSelectedField }) => {
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

  return <>{fields?.length}</>;
};
