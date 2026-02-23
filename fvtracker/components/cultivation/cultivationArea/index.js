"use client";

import { handleApiError } from "@/lib/constants/errors/client/api";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectField, setFields } from "@/store/cultivation";
import handleError from "@/lib/constants/errors/client/handleError";

export function CultivationAreaPageComponent({ fieldSlug, caSlug }) {
  const selectedField = useSelector((state) => state.cultivation.selectedField);
  const fields = useSelector((state) => state.cultivation.fields);

  const cultivationArea = useMemo(() => {
    return selectedField?.cultivationAreas?.find((ca) => ca.slug === caSlug);
  }, [selectedField, caSlug, fields]);

  useEffect(() => {
    const fillCultivationArea = async () => {
      if (!selectedField && fields && fields.length > 0) {
        try {
          console.log(
            "slected field is null, but fields are in store, finding field...",
          );
          const foundField = fields.find((f) => f.slug === fieldSlug);
          if (foundField) {
            dispatch(selectField(foundField));
            return;
          } else {
            throw new Error("Field not found in store but fields in store");
          }
        } catch (error) {
          handleError({
            ...error,
            generalMessage: "Failed to load cultivation area",
          });
        }
        }
      }
    };
    fillCultivationArea();
  });

  return (
    <>
      ca page
      <div className="">{JSON.stringify(cultivationArea, null, 2)}</div>
    </>
  );
}
