"use client";

import { FieldGrid } from "@/components/cultivation/fields/preview/grid";
import Modal, { ModalFooter } from "../../../layout/modals/modal";
import { showDate } from "@/lib/utils/display";
import { useEffect, useState } from "react";
import utils from "@/lib/utils";
import { MenuModal } from "../../../layout/modals/menu";
import {
  END_PLANTING,
  CONTINUE_PLANTING,
} from "@/lib/constants/cultivation/plants";
import { useDispatch, useSelector } from "react-redux";
import { PlantCultivation } from "./plantCultivation";
import api from "@/lib/api";
import { createPlantage } from "@/store/cultivation";

export const SeedingModal = ({
  isOpen,
  onCancel,
  cultivation,
  caDims,
  cultivationCells,
}) => {
  const [newPlantage, setNewPlantage] = useState({});
  useEffect(() => {
    if (!cultivation?._id) return;

    setNewPlantage(
      initialNewPlantage_WId ? initialNewPlantage_WId(cultivation?._id) : {},
    );
  }, [cultivation]);

  const isBeginSelected = () =>
    !!(
      typeof newPlantage.beginX === "number" &&
      typeof newPlantage.beginY === "number"
    );
  const [chooseNewEnd, setChooseNewEnd] = useState(initialChooseNewEnd);
  const [plantCultivationOpen, setPlantCultivationOpen] = useState(false);

  // object with mainTypes, genTypes, types and varieties aray
  const crops = useSelector((state) => state.cultivation.crops);
  const dispatch = useDispatch();

  const showChooseNewEnd = ({ x, y }) => {
    setChooseNewEnd((prev) => ({ ...prev, isOpen: true, choice: null, x, y }));
  };

  const handleNotPlanted = (x, y) => {
    if (isBeginSelected() && newPlantage.toPlantCells?.length > 0) {
      showChooseNewEnd({
        x,
        y,
      });
    } else {
      onBeginCoordinates({ x, y });
    }
  };

  const onBeginCoordinates = ({ x, y }) => {
    setNewPlantage((prev) => ({
      ...prev,
      beginX: x,
      beginY: y,
      toPlantCells: [`${x},${y}`],
    }));
  };

  const onEndCoordinates = ({ x, y }) => {
    const { planted } = utils.cultivation.cultivationAreas.getCellsInRect({
      beginX: newPlantage.beginX,
      beginY: newPlantage.beginY,
      endX: x,
      endY: y,
      toPlantCells: newPlantage.toPlantCells,
      toPlantCultivation: cultivation,
    });
    if (!planted) {
      reset();
      return;
    }
    setNewPlantage((prev) => ({
      ...prev,
      endX: x,
      endY: y,
      toPlantCells: planted,
    }));

    setPlantCultivationOpen(true);
  };

  const reset = () => {
    setNewPlantage(
      initialNewPlantage_WId ? initialNewPlantage_WId(cultivation?._id) : {},
    );
    setChooseNewEnd(initialChooseNewEnd);
    setPlantCultivationOpen(false);
  };

  const choiceOptions = [
    {
      label: END_PLANTING,
      onClick: () => {
        setChooseNewEnd({ isOpen: false, choice: END_PLANTING });
        onEndCoordinates({
          x: chooseNewEnd.x,
          y: chooseNewEnd.y,
        });
      },
    },
    {
      label: CONTINUE_PLANTING,
      onClick: () => {
        setChooseNewEnd({ isOpen: false, choice: CONTINUE_PLANTING });
      },
    },
    {
      label: "Cancel",
      onClick: () => {
        reset();
      },
      className: "btn w-full cancelButton",
    },
  ];

  const onSubmitNewPlantage = async () => {
    //submit to backend
    try {
      const body = preparePlantageBody(newPlantage);
      const res = await api.post("/cultivation/plant/new-plantage", body);
      const newPlantageFromRes = res.data;
      dispatch(
        createPlantage({
          cultivationId: newPlantage.cultivationId,
          newPlantage: newPlantageFromRes,
        }),
      );
    } catch (error) {
      console.error("Error preparing plantage body:", error);
    }
    reset();
  };

  const hanleCropVarietyClick = (cropVariety) => (e) => {
    e.stopPropagation();
    console.log("Clicked crop variety:", cropVariety);
  }

  if (!cultivation || !isOpen) return null;
  return (
    <>
      <Modal title="Seeding Modal" isOpen={isOpen} onCancel={onCancel}>
        <div className="flex flex-col gap-2">
          <div className="font-bold text-xl">{cultivation?.name || "N/A"}</div>
          <div>{cultivation?.description}</div>
          <div className="text-sm text-gray-500">
            Created at: {showDate(cultivation?.createdAt)} <br />
          </div>
        </div>
        <div className="mt-4 p-4">
          <div>
            <FieldGrid
              width={caDims.width}
              length={caDims.length}
              invertColor={true}
              cultivationCells={cultivationCells}
              onRightClick={reset}
              seedMode={true}
              toPlantCells={newPlantage?.toPlantCells}
              handleNotPlanted={handleNotPlanted}
            />
          </div>
        </div>
        <ModalFooter>
          <div className={`btn submitButton`}>Submit</div>
          <div className="btn cancelButton">Cancel</div>
        </ModalFooter>
      </Modal>
      <MenuModal
        invertColor="true"
        isOpen={chooseNewEnd.isOpen}
        options={choiceOptions}
        onCancel={reset}
      />
      <PlantCultivation
        onSubmit={onSubmitNewPlantage}
        isOpen={plantCultivationOpen}
        onCancel={reset}
        newPlantage={newPlantage}
        setNewPlantage={setNewPlantage}
        crops={crops}
      />
    </>
  );
};

const initialChooseNewEnd = {
  isOpen: false,
  choice: null,
  x: null,
  y: null,
};

const initialNewPlantage_WId = (cultivationId) => ({
  cultivationId: cultivationId || null,
  generalType: {
    _id: "699f3e94a9d129153ac7617f",
    name: "Lisnato povrće",
  },
  type: {
    _id: "699f3e94a9d129153ac76180",
    name: "Salata",
  },
  variety: {
    _id: "699f3e94a9d129153ac76181",
    name: "Iceberg",
  },
  toPlantCells: [],
  plantedAt: new Date("2026-03-10T00:00:00Z"),
  harvestedAt: null,
  beginX: null,
  beginY: null,
  endX: null,
  endY: null,
});

const preparePlantageBody = (newPlantage) => ({
  cultivationId: newPlantage.cultivationId,
  cropVarietyId: newPlantage.variety._id,
  relativeCoords: newPlantage.toPlantCells,
  plantedAt: newPlantage.plantedAt,
  harvestedAt: newPlantage.harvestedAt,
});
