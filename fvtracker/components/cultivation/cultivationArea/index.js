"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectField, setFields } from "@/store/cultivation";
import handleError from "@/lib/constants/errors/client/handleError";
import api from "@/lib/api";
import { Loading } from "@/components/layout/loading";
import CAOptions from "./caOptions";
import { FieldGrid } from "../fields/preview/grid";
import { useRouter } from "next/navigation";
import utils from "@/lib/utils";
import Modals from "@/components/layout/modals";
import { Cultivate } from "./cultivate";

export function CultivationAreaPageComponent({ fieldSlug, caSlug }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const selectedField = useSelector((state) => state.cultivation.selectedField);
  const fields = useSelector((state) => state.cultivation.fields);
  const [cultivationOpen, setCultivationOpen] = useState(false);
  const [newCUCoordinates, setNewCUCoordinates] = useState({});

  useEffect(() => {
    console.log("new cuc coordinates:", newCUCoordinates);
  }, [newCUCoordinates]);

  const [isBeginSelected, setIsBeginSelected] = useState(false);

  useEffect(() => {
    console.log("isBeginSelected changed:", isBeginSelected);
  }, [isBeginSelected]);

  const cultivationArea = useMemo(() => {
    return selectedField?.cultivationAreas?.find((ca) => ca.slug === caSlug);
  }, [selectedField, caSlug, fields]);

  useEffect(() => {
    console.log("cultivationArea changed:", cultivationArea);
  }, [cultivationArea]);

  const cultvations = useMemo(() => {
    return cultivationArea?.cultivations || [];
  }, [cultivationArea]);

  useEffect(() => {
    console.log("cultivations:", cultvations);
  }, [cultvations]);

  useEffect(() => {
    const fillSelectedField = async () => {
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
        console.log("selected field is null, fetching field...");
      }
      if (!selectedField) {
        console.log("selected field is null, fetching field...");
        try {
          const res = await api.get(`/cultivation/fields`, {
            params: {
              slug: fieldSlug,
            },
          });
          dispatch(selectField(res.data.field));
        } catch (error) {
          handleError({
            ...error,
            generalMessage: "Failed to load field from server",
          });
        }
      }
    };
    fillSelectedField();
  }, [fieldSlug, caSlug, selectedField]);

  const handleEmptyClick = (x, y) => {
    if (!isBeginSelected) {
      onBeginCoordinates(x, y);
    } else {
      onEndCoordinates(x, y);
    }
  };

  const onBeginCoordinates = (x, y) => {
    setIsBeginSelected(true);
    setNewCUCoordinates((prev) => ({
      ...prev,
      begin: { x, y },
      potentialCUCells: [`${x},${y}`],
    }));
  };

  const onEndCoordinates = (x, y) => {
    setNewCUCoordinates((prev) => ({
      ...prev,
      end: { x, y },
      potentialCUCells: utils.cultivation.cultivationAreas.getCellsInRect({
        beginX: prev.begin.x,
        beginY: prev.begin.y,
        endX: x,
        endY: y,
        cultivations: cultvations,
      }).planted,
    }));
  };

  if (!cultivationArea)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    );

  const onBack = () => router.push(`/upravljanje-poljima/${fieldSlug}`);

  const { width, length } = cultivationArea.dimensions;

  return (
    <>
      <div className="grid grid-cols-6">
        <div className="col-start-1 col-end-6 h-screen flex flex-col ">
          <FieldGrid
            handleEmptyClick={handleEmptyClick}
            newCUCoordinates={newCUCoordinates}
            width={width}
            length={length}
            enlarged={true}
          />
        </div>
        <div className="col-start-6 col-end-7  h-screen flex flex-col  items-center ">
          <CAOptions
            onBack={onBack}
            onCultivate={() => setCultivationOpen(true)}
          />
        </div>
        <Cultivate
          cultivationAreaId={cultivationArea.id}
          cultivations={cultvations}
          cultivationOpen={cultivationOpen}
          setCultivationOpen={setCultivationOpen}
          newCUDetails={newCUDetails}
          setNewCUDetails={setNewCUDetails}
        />
      </div>
    </>
  );
}
