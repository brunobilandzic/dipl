"use client";

import { useEffect, useMemo, useState } from "react";
import { FieldGrid } from "../preview/grid";
import utils from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { handleApiError } from "@/lib/constants/errors/client/api";
import axios from "axios";
import { Loading } from "@/components/layout/loading";
import { selectField } from "@/store/cultivation";
import { FieldEditDashboard } from "./edit/dashboard";
import { useRouter } from "next/navigation";

export default function FieldPageComponent({ slug }) {
  const selectedField = useSelector((state) => state.cultivation.selectedField);
  const fields = useSelector((state) => state.cultivation.fields);
  const [field, setField] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedField && selectedField.slug === slug) {
      setField(selectedField);
    } else if (fields && fields.length > 0) {
      const foundField = fields.find((f) => f.slug === slug);
      if (foundField) {
        setField(foundField);
        dispatch(selectField(foundField));
      }
    } else {
      (async () => {
        const res = await axios(`/api/cultivation/fields`, {
          params: { slug },
        });
        if (res.data && res.data.field) {
          setField(res.data.field);
          dispatch(selectField(res.data.field));
        } else {
          throw new Error("Field not found");
        }
      })().catch((error) => {
        handleApiError(error);
      });
    }
  }, [slug, selectedField, fields]);

  if (!field)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    );

  const {
    name,
    description,
    dimensions: { width, length },
    cultivationAreas,
    cultivations,
    cultivationAreaDimensions,
  } = field;

  const fieldId = field._id.toString();

  return (
    <>
      <div className="w-full grid grid-cols-1 gap-4">
        <div className="text-3xl font-bold">{name}</div>
        <div className="italic">{description}</div>
        <FieldEditCASPanel
          fieldId={fieldId}
          field={field}
          setField={setField}
          width={width}
          length={length}
          cultivationAreas={cultivationAreas}
          cultivationAreaDimensions={cultivationAreaDimensions}
        />
        <div></div>
      </div>
    </>
  );
}

function FieldEditCASPanel({
  width,
  length,
  field,
  cultivationAreas,
  cultivationAreaDimensions,
  fieldId,
  setField,
}) {
  const [cultivationAreaMenu, setCultivationAreaMenu] =
    useState(initialCAMenuState);
  const plantedCells = useMemo(() => {
    return cultivationAreas
      ? utils.cultivation.cultivationAreas.getCASCells(cultivationAreas)
      : [];
  }, [cultivationAreas]);
  const [newCACoordinates, setNewCACoordinates] = useState({});
  const [isBeginSelected, setIsBeginSelected] = useState(false);

  const cultivationCells = useMemo(() => {
    if (!cultivationAreas) return [];
    const cultivations =
      utils.cultivation.cultivations.getCASCultivations(cultivationAreas);
    const plcvs = utils.cultivation.cultivations.getPlCvs(cultivations);
    return plcvs;
  }, [field]);

  const onBeginCoordinates = (beginX, beginY) => {
    setIsBeginSelected(true);
    setCultivationAreaMenu(initialCAMenuState);
    setNewCACoordinates((prev) => ({
      ...prev,
      begin: { x: beginX, y: beginY },
      planted: [`${beginX},${beginY}`],
    }));
  };

  const onEndCoordinates = (endX, endY) => {
    if (!newCACoordinates.begin) {
      alert("Početne koordinate nisu postavljene");
      return;
    }
    const { x: beginX, y: beginY } = newCACoordinates.begin;
    const { error, planted, dimensions } =
      utils.cultivation.cultivationAreas.getCellsInRect({
        beginX,
        beginY,
        endX,
        endY,
        cultivationAreaDimensions,
        cultivationAreas,
      });

    if (error) {
      alert(error);
      return;
    }

    const { error: selectionError } =
      utils.cultivation.cultivationAreas.checkValidSelection({
        beginX,
        beginY,
        endX,
        endY,
        gap: cultivationAreaDimensions.gap,
        plantedCells,
      });

    if (selectionError) {
      alert(selectionError);
      return;
    }

    setNewCACoordinates({
      ...newCACoordinates,
      end: { x: endX, y: endY },
      planted,
      dimensions,
    });
  };

  const handleEmptyClick = (x, y) => {
    const { error } = utils.cultivation.cultivationAreas.checkValidCell({
      x,
      y,
      gap: cultivationAreaDimensions.gap,
      plantedCells,
    });
    if (error) {
      alert(error);
      return;
    }
    if (!isBeginSelected) {
      onBeginCoordinates(x, y);
    } else {
      onEndCoordinates(x, y);
    }
  };

  const handleActiveClick = (x, y) => {
    const ca = utils.cultivation.cultivationAreas.getCAForCell(
      cultivationAreas,
      x,
      y,
    );
    /*     router.push(`/upravljanje-poljima/${field.slug}/ca/${ca.slug}`); */

    setCultivationAreaMenu({
      isOpen: true,
      cultivationArea: ca,
    });
  };

  const onRightClick = () => {
    resetSelection();
  };

  const resetSelection = () => {
    setNewCACoordinates({});
    setIsBeginSelected(false);
  };

  const getNewCOCoordinates = () => newCACoordinates;
  const emptyCACoordinates = () => setNewCACoordinates({});

  return (
    <>
      <div className="flex flex-col justify-start gap-6">
        <div
          style={{
            width: "full",
            aspectRatio: ``,
          }}
          className=""
        >
          <FieldGrid
            width={width}
            length={length}
            plantedCells={plantedCells}
            selectedCultivationArea={
              cultivationAreaMenu.isOpen
                ? cultivationAreaMenu.cultivationArea
                : null
            }
            newCACoordinates={newCACoordinates}
            isBeginSelected={isBeginSelected}
            setNewCACoordinates={setNewCACoordinates}
            onRightClick={onRightClick}
            handleActiveClick={handleActiveClick}
            handleEmptyClick={handleEmptyClick}
            field={field}
            cultivationCells={cultivationCells}
            cuCellsFieldCoords={true}
            cultivationAreas={cultivationAreas}
          />
        </div>
        <div className=" ">
          <FieldEditDashboard
            setIsBeginSelected={setIsBeginSelected}
            setField={setField}
            getNewCOCoordinates={getNewCOCoordinates}
            emptyCACoordinates={emptyCACoordinates}
            cultivationAreaDimensions={cultivationAreaDimensions}
            fieldId={fieldId}
            cultivationAreaMenu={cultivationAreaMenu}
            setCultivationAreaMenu={setCultivationAreaMenu}
            newCACoordinates={newCACoordinates}
            setNewCACoordinates={setNewCACoordinates}
          />
        </div>
      </div>
    </>
  );
}

export const initialCAMenuState = {
  isOpen: false,
  cultivationArea: null,
  mode: null,
};
