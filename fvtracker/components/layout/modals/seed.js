"use client";

import { FieldGrid } from "@/components/cultivation/fields/preview/grid";
import Modal, { ModalFooter } from "./modal";
import { showDate } from "@/lib/utils/display";
import { useEffect, useState } from "react";
import utils from "@/lib/utils";
import { MenuModal } from "./menu";
import {
  END_PLANTING,
  CONTINUE_PLANTING,
} from "@/lib/constants/cultivation/plants";
import Modals from ".";
import { AppInput, AppSelect } from "@/components/form/inputs";
import { useSelector } from "react-redux";

export const SeedingModal = ({
  isOpen,
  onCancel,
  cultivation,
  caDims,
  cultivationCells,
}) => {
  const [dragEvent, setDragEvent] = useState(null);
  const [newPlantage, setNewPlantage] = useState(
    initialNewPlantage(cultivation?.id),
  );
  const isBeginSelected = () =>
    !!(
      typeof newPlantage.beginX === "number" &&
      typeof newPlantage.beginY === "number"
    );
  const [chooseNewEnd, setChooseNewEnd] = useState(initialChooseNewEnd);
  const [plantCultivationOpen, setPlantCultivationOpen] = useState(false);

  useEffect(() => {
    console.log("newPlantage state:", newPlantage);
  }, [newPlantage]);

  useEffect(() => {
    console.log("choicenewend state:", chooseNewEnd);
  }, [chooseNewEnd]);

  // object with mainTypes, genTypes, types and varieties aray

  const crops = useSelector((state) => state.cultivation.crops);

  const turnOffBeginSelection = () => {
    setNewPlantage((prev) => ({ ...prev, beginX: null, beginY: null }));
  };
  const emptyToPlantCells = () => {
    setNewPlantage((prev) => ({ ...prev, toPlantCells: [] }));
  };
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

  const handleDrag = ({ x, y }) => {
    if (isBeginSelected()) {
      setNewPlantage((prev) => ({
        ...prev,
        toPlantCells: [...prev.toPlantCells, `${x},${y}`],
      }));
    }
  };

  const reset = () => {
    setNewPlantage(initialNewPlantage(cultivation?.id));
    setDragEvent(null);
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
        isOpen={plantCultivationOpen}
        onCancel={reset}
        newPlantage={newPlantage}
        setNewPlantage={setNewPlantage}
        crops={crops}
/>
    </>
  );
};

const PlantCultivation = ({
  isOpen,
  onCancel,
  onSubmit,
  newPlantage,
  setNewPlantage,
  crops,
}) => {
  const onChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setNewPlantage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modals.FormModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Zasadi na područje"
      onSubmit={onSubmit}
      invertColor={true}
    >
      <div className={`form`}>
        <div className={``}>
          <AppInput
            type="text"
            label="Ime"
            name="name"
            value={newPlantage.name}
            onChange={onChange}
          />
        </div>
      </div>
    </Modals.FormModal>
  );
};

const initialChooseNewEnd = {
  isOpen: false,
  choice: null,
  x: null,
  y: null,
};

const initialNewPlantage = (cultivationId) => ({
  cultivation: cultivationId || null,
  //all crops are names
  generalType: "",
  type: "",
  variety: "",
  toPlantCells: [],
  name: "",
  
  plantedAt: null,
  harvestedAt: null,
  beginX: null,
  beginY: null,
  endX: null,
  endY: null,
});
