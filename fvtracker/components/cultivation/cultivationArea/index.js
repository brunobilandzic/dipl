"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCultivation,
  deleteCultivation,
  selectField,
  setFieldUpdated,
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
import { HarvestingModal } from "@/components/cultivation/cultivationArea/harvesting/harvestingModal";
import { refreshFields } from "@/lib/utils/cultivation/fields/fields";
import { setLoading } from "@/store/loading";
import { sanitize } from "@/lib/utils/objects";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";

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
  const [harvestCultivation, setHarvestCultivation] = useState(
    initialHarvestCultivation,
  );
  const managerModelName = useSelector(
    (state) => state.user.session?.managerModelName,
  );

  const cultivationArea = useMemo(() => {
    return selectedField?.cultivationAreas?.find((ca) => ca.slug === caSlug);
  }, [selectedField, caSlug, fields]);

  const cultivationCells = useMemo(() => {
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
    existingCulName: "",
  };

  const [newCUDetails, setNewCUDetails] = useState(initialNewCUDetails);

  useEffect(() => {
    const fillSelectedField = async () => {
      if (!selectedField && fields) {
        try {
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
            generalMessage: "Neuspjelo učitavanje područja za sadnju",
          });
        }
      }
      if (!selectedField) {
        await refreshFields({ dispatch, router });
      }
    };
    fillSelectedField();
  }, [selectedField, fields]);

  useEffect(() => {
    const disabled = [];
    if (
      !newCUDetails.potentialCUCells ||
      newCUDetails.potentialCUCells.length === 0 ||
      managerModelName != CULTIVATION_MANAGER
    ) {
      disabled.push(cultivation.names.CULTIVATE_CELLS);
    }
    if (!selectedCultivation) {
      disabled.push(cultivation.names.MANAGE_SEEDING);
      disabled.push(cultivation.names.EDIT_INFO);
      disabled.push(cultivation.names.DELETE_CULTIVATION);
      disabled.push(cultivation.names.HARVEST_CELLS);
    }
    setDisabledOptions(disabled);
  }, [newCUDetails, selectedCultivation]);

  const handleEmptyClick = (x, y) => {
    if (managerModelName != CULTIVATION_MANAGER) {
      alert("Nemate ovlasti za uređivanje kultivacija");
      return;
    }
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
    dispatch(setLoading(true));
    try {
      const data =
        utils.cultivation.cultivations.prepareCultivationData(newCUDetails);
      const res = await api.post(`/cultivation`, { data });
      dispatch(createCultivation(sanitize(res.data.newCultivation)));
      setSelectedCultivation(sanitize(res.data.newCultivation));
      setIsBeginSelected(false);
      alert("Kultivacija je uspješno kreirana");
    } catch (error) {
      console.error("Error submitting cultivation:", error);
      handleError({
        ...error,
        generalMessage: "Neuspjelo kreiranje kultivacije",
      });
      return;
    } finally {
      dispatch(setLoading(false));
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
      dispatch(
        setFieldUpdated({ fieldId: selectedField._id, updatedAt: new Date() }),
      );
      setSelectedCultivation(null);
      alert("Kultivacija je uspješno obrisana");
    } catch (error) {
      console.error("Error deleting cultivation:", error);
      handleError({
        ...error,
        generalMessage: "Neuspjelo brisanje kultivacije",
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

  const onHarvest = () => {
    if (!selectedCultivation) return;
    setHarvestCultivation({
      isOpen: true,
      cultivation: selectedCultivation,
    });
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold ">{cultivationArea.name}</h1>
        <p className="">{cultivationArea.description}</p>
      </div>
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
            fieldView={false}
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
            onHarvest={onHarvest}
          />
        </div>
        {createCultivationOpen && (
          <CreateCultivation
            cultivationAreaId={cultivationArea.id}
            isOpen={createCultivationOpen}
            onCancel={() => setCreateCultivationOpen(false)}
            newCUDetails={newCUDetails}
            setNewCUDetails={setNewCUDetails}
            onSubmit={onSubmitCultivation}
            existingCultivations={cultivationArea.cultivations}
          />
        )}
        {editCultivationOpen && (
          <EditCultivation
            isOpen={editCultivationOpen}
            onCancel={() => setEditCultivationOpen(false)}
            cultivationData={selectedCultivation}
          />
        )}
        {plantCultivation.isOpen && (
          <SeedingModal
            field={selectedField}
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
        )}
        {harvestCultivation.isOpen && (
          <>
            <HarvestingModal
              isOpen={harvestCultivation.isOpen}
              onCancel={() => setHarvestCultivation(initialHarvestCultivation)}
              cultivation={selectedCultivation}
              caDims={{ width, length }}
              cultivationCells={utils.cultivation.cultivations.filterCutivationCells(
                {
                  cultivationCells,
                  cultivationId: selectedCultivation?._id,
                },
              )}
              field={selectedField}
            />
          </>
        )}
      </div>
    </>
  );
}

const initialPlantCultivation = {
  isOpen: false,
  cultivation: null,
};

const initialHarvestCultivation = {
  isOpen: false,
  cultivation: null,
};
