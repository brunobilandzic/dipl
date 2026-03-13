"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCultivation,
  deleteCultivation,
  selectField,
} from "@/store/cultivation";
import handleError from "@/lib/constants/errors/client/handleError";
import api from "@/lib/api";
import { Loading } from "@/components/layout/loading";
import CAOptions from "./caOptions";
import { FieldGrid } from "../fields/preview/grid";
import { useRouter } from "next/navigation";
import utils from "@/lib/utils";
import { CreateCultivation } from "./createCultivation";
import cultivation from "@/lib/constants/cultivation";
import { EditCultivation } from "./editCultivation";
import { SeedingModal } from "@/components/cultivation/cultivationArea/planting/seedingModal";

export function CultivationAreaPageComponent({ fieldSlug, caSlug }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const selectedField = useSelector((state) => state.cultivation.selectedField);
  const fields = useSelector((state) => state.cultivation.fields);

  const [createCultivationOpen, setCreateCultivationOpen] = useState(false);
  const [isBeginSelected, setIsBeginSelected] = useState(false);
  const [selectedCultivation, setSelectedCultivation] = useState(null);
  const [disabledOptions, setDisabledOptions] = useState([]);
  const [editCultivationOpen, setEditCultivationOpen] = useState(false);
  const [plantCultivation, setPlantCultivation] = useState(
    initialPlantCultivation,
  );

  const cultivationArea = useMemo(() => {
    console.log("Calculating cultivationArea for caSlug:", caSlug);
    return selectedField?.cultivationAreas?.find((ca) => ca.slug === caSlug);
  }, [selectedField, caSlug, fields]);

  const cultivationCells = useMemo(() => {
    console.log(
      "Calculating cultivationCells for cultivationArea:",
      cultivationArea,
    );
    if (!cultivationArea) return [];
    const plcvs = utils.cultivation.cultivations.getPlCvs(
      cultivationArea.cultivations,
    );
    return plcvs;
  }, [cultivationArea, selectField, fields]);

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
  }, [fieldSlug, caSlug, selectedField, fields]);

  useEffect(() => {
    const disabled = [];
    if (
      !newCUDetails.potentialCUCells ||
      newCUDetails.potentialCUCells.length === 0
    ) {
      disabled.push(cultivation.names.CULTIVATE_CELLS);
    }
    if (!selectedCultivation) {
      disabled.push(cultivation.names.MANAGE_SEEDING);
      disabled.push(cultivation.names.EDIT_INFO);
      disabled.push(cultivation.names.DELETE_CULTIVATION);
    }
    setDisabledOptions(disabled);
  }, [newCUDetails, selectedCultivation]);

  const handleEmptyClick = (x, y) => {
    if (!isBeginSelected) {
      onBeginCoordinates(x, y);
    } else {
      onEndCoordinates(x, y);
    }
  };

  const onBeginCoordinates = (x, y) => {
    setIsBeginSelected(true);
    setSelectedCultivation(null);
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
    setSelectedCultivation(null);
    setNewCUDetails(initialNewCUDetails);
  };

  const onCultivationClick = (x, y) => {
    if (isBeginSelected) {
      alert("Nemoguće napraviti kultivaciju gdje već postoji");
      return;
    }
    const cellCoords = `${x},${y}`;
    const cultivation = utils.cultivation.cultivations.getCUForCell(
      cultivationArea.cultivations,
      cellCoords,
    );
    if (cultivation) {
      setSelectedCultivation(cultivation);
    } else {
      console.log("No cultivation found for cell:", cellCoords);
    }
  };

  const onSubmitCultivation = async () => {
    try {
      const data =
        utils.cultivation.cultivations.prepareCultivationData(newCUDetails);
      const res = await api.post(`/cultivation`, { data });
      dispatch(createCultivation(res.data.newCultivation));
      setSelectedCultivation(res.data.newCultivation);
      setIsBeginSelected(false);
      alert("Cultivation created successfully");
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

  const onDeleteCultivation = async () => {
    if (!selectedCultivation) return;
    if (!confirm("Jeste li sigurni da želite obrisati ovu kultivaciju?"))
      return;

    try {
      await api.delete(`/cultivation`, {
        data: { id: selectedCultivation._id },
      });
      dispatch(deleteCultivation(selectedCultivation._id));
      setSelectedCultivation(null);
      alert("Cultivation deleted successfully");
    } catch (error) {
      console.error("Error deleting cultivation:", error);
      handleError({
        ...error,
        generalMessage: "Failed to delete cultivation",
      });
    }
  };

  const onPlant = () => {
    if (!selectedCultivation) return;
    setPlantCultivation({
      isOpen: true,
      cultivation: selectedCultivation,
    });
  };

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
            selectedCultivationName={selectedCultivation?.name}
          />
        </div>
        <div className="col-start-6 col-end-7  h-screen flex flex-col  items-center ">
          <CAOptions
            onBack={onBack}
            onCultivate={() => setCreateCultivationOpen(true)}
            onEdit={() => setEditCultivationOpen(true)}
            disabled={disabledOptions}
            onDelete={onDeleteCultivation}
            onPlant={onPlant}
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
        <EditCultivation
          isOpen={editCultivationOpen}
          onCancel={() => setEditCultivationOpen(false)}
          cultivationData={selectedCultivation}
        />
        <SeedingModal
          isOpen={plantCultivation.isOpen}
          onCancel={() => setPlantCultivation(initialPlantCultivation)}
          cultivation={selectedCultivation}
          caDims={{ width, length }}
          cultivationCells={utils.cultivation.cultivations.filterCutivationCells(
            {
              cultivationCells,
              cultivationId: selectedCultivation?._id,
            },
          )}
        />
      </div>
    </>
  );
}

const initialPlantCultivation = {
  isOpen: false,
  cultivation: null,
};
