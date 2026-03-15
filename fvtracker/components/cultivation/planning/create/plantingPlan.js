"use client";

import api from "@/lib/api";
import { setFields } from "@/store/cultivation";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FieldGrid } from "@/components/cultivation/fields/preview/grid";
import utils from "@/lib/utils";

export default function CreatePlantingPlanPageComonent() {
  const [selectedField, setSelectedField] = useState(null);
  return (
    <>
      <SelectField
        selectedField={selectedField}
        setSelectedField={setSelectedField}
      />
    </>
  );
}

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
    console.log("fields in select field component", fields);
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

  return (
    <>
      <div>{fields?.length}</div>
      <div className="flex w-full gap-4">
        {fields &&
          fields.map((field) => {
            const cultivationCells = utils.cultivation.cultivations.getPlCvs(
              utils.cultivation.cultivations.getCASCultivations(
                field.cultivationAreas,
              ),
            );

            return (
              <FieldGrid
                small={true}
                width={field.dimensions.width}
                length={field.dimensions.length}
                plantedCells={utils.cultivation.cultivationAreas.getCASCells(
                  field.cultivationAreas,
                )}
                cultivationCells={cultivationCells}
                cuCellsFieldCoords={true}
              />
            );
          })}
      </div>
    </>
  );
};
