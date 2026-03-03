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
import { CreateCultivation } from "./createCultivation";
import { CultivationMenu } from "./cultivationMenu";

export function CultivationAreaPageComponent({ fieldSlug, caSlug }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const selectedField = useSelector((state) => state.cultivation.selectedField);
  const fields = useSelector((state) => state.cultivation.fields);

  const [createCultivationOpen, setCreateCultivationOpen] = useState(false);
  const [cultivationMenuOpen, setCultivationMenuOpen] = useState(false);
  const [isBeginSelected, setIsBeginSelected] = useState(false);
  const [selectedCultivationName, setSelectedCultivationName] = useState(null);

  const cultivationArea = useMemo(() => {
    return selectedField?.cultivationAreas?.find((ca) => ca.slug === caSlug);
  }, [selectedField, caSlug, fields]);

  const cultivationCells = useMemo(() => {
    if (!cultivationArea) return [];
    const plcvs = utils.cultivation.cultivations.getPlCvs(
      cultivationArea.cultivations,
    );
    return plcvs;
  }, [cultivationArea]);

  useEffect(() => {
    if (cultivationArea?._id) {
      setNewCUDetails((prev) => ({
        ...prev,
        cultivationAreaId: cultivationArea._id,
      }));
    }
  }, [cultivationArea]);

  const initialNewCUDetails = {
    cultivationAreaId: cultivationArea?._id || null,
    existingCulName: null,
    name: "",
    description: "",
    dimensions: {
      width: "",
      length: "",
    },
  };

  const [newCUDetails, setNewCUDetails] = useState(initialNewCUDetails);

  useEffect(() => {
    console.log("newCUDetails changed:", newCUDetails);
  }, [newCUDetails]);

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
    setNewCUDetails((prev) => ({
      ...prev,
      begin: { x, y },
      potentialCUCells: [`${x},${y}`],
    }));
  };

  const onEndCoordinates = (x, y) => {
    if (!newCUDetails.begin) return;
    const potentialCUCells = utils.cultivation.cultivationAreas.getCellsInRect({
      beginX: newCUDetails.begin.x,
      beginY: newCUDetails.begin.y,
      endX: x,
      endY: y,
      cultivations: cultivationArea.cultivations,
    });

    if (potentialCUCells.error) {
      alert(potentialCUCells.error);
      return;
    }
    setNewCUDetails((prev) => ({
      ...prev,
      end: { x, y },
      potentialCUCells: potentialCUCells.planted,
      dimensions: potentialCUCells.dimensions,
    }));
  };

  const onRightClick = () => {
    setIsBeginSelected(false);
    setNewCUDetails(initialNewCUDetails);
  };

  const onCultivationClick = (x, y) => {
    const cellCoords = `${x},${y}`;
    const cultivation = utils.cultivation.cultivations.getCUForCell(
      cultivationArea.cultivations,
      cellCoords,
    );
    if (cultivation) {
      console.log("Cultivation clicked:", cultivation);
      setCultivationMenuOpen(true);
    } else {
      console.log("No cultivation found for cell:", cellCoords);
    }
  };

  const onSubmitCultivation = async () => {
    console.log("Submitting cultivation with details:", newCUDetails);
    try {
      const data =
        utils.cultivation.cultivations.prepareCultivationData(newCUDetails);
      console.log("Submitting cultivation with data:", data);
      const res = await api.post(`/cultivation`, { data });
      console.log("Cultivation created successfully:", res.data);
    } catch (error) {
      console.error("Error submitting cultivation:", error);
      handleError({
        ...error,
        generalMessage: "Failed to create cultivation",
      });
      return;
    }
    setCreateCultivationOpen(false);
    setNewCUDetails(initialNewCUDetails);
  };

  const onBack = () => router.push(`/upravljanje-poljima/${fieldSlug}`);

  if (!cultivationArea)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    );

  const { width, length } = cultivationArea.dimensions;

  return (
    <>
      {JSON.stringify(newCUDetails, null, 2)}
      <br />
      {/* {JSON.stringify(cultivationArea.cultivations, null, 2)} */}
      <div className="grid grid-cols-6">
        <div className="col-start-1 col-end-6 h-screen flex flex-col ">
          <FieldGrid
            handleEmptyClick={handleEmptyClick}
            potentialCUCells={newCUDetails.potentialCUCells}
            width={width}
            length={length}
            enlarged={true}
            onRightClick={onRightClick}
            cultivationCells={cultivationCells}
            handleActiveClick={onCultivationClick}
          />
        </div>
        <div className="col-start-6 col-end-7  h-screen flex flex-col  items-center ">
          <CAOptions
            onBack={onBack}
            onCultivate={() => setCreateCultivationOpen(true)}
            disabled={
              !newCUDetails.potentialCUCells ||
              newCUDetails.potentialCUCells.length === 0
            }
          />
        </div>
        <CreateCultivation
          cultivationAreaId={cultivationArea.id}
          isOpen={createCultivationOpen}
          onCancel={() => setCreateCultivationOpen(false)}
          newCUDetails={newCUDetails}
          setNewCUDetails={setNewCUDetails}
          onSubmit={onSubmitCultivation}
          existingCultivations={cultivationArea.cultivations}
        />
        <CultivationMenu
          isOpen={cultivationMenuOpen}
          choices={[]}
          onCancel={() => setCultivationMenuOpen(false)}
        />
      </div>
    </>
  );
}
