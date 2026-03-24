import Modal from "@/components/layout/modals/modal";
import { showDate } from "@/lib/utils/display";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "@/lib/api";
import { setFields } from "@/store/cultivation";
import { HarvestCultivation } from "./harvestCultivation";
import { FieldGrid } from "../../fields/preview/grid";
import { MenuModal } from "@/components/layout/modals/menu";
import {
  CONTINUE_HARVESTING,
  END_HARVESTING,
} from "@/lib/constants/cultivation/plants";
import utils from "@/lib/utils";

export function HarvestingModal({
  isOpen,
  onCancel,
  onConfirm,
  cultivation,
  cultivationCells,
  caDims,
  field,
}) {
  const fields = useSelector((state) => state.fields);
  const [newHarvest, setNewHarvest] = useState({});
  const [chooseNewEnd, setChooseNewEnd] = useState(initialChooseNewEnd);
  const [harvestCultivationOpen, setHarvestCultivationOpen] = useState(false);

  //use effects to monitor state changes
  useEffect(() => {
    console.log("New harvest state updated:", newHarvest);
  }, [newHarvest]);

  // set harvest when cult id
  useEffect(() => {
    if (!cultivation?._id) return;

    setNewHarvest(
      initialNewHarvest_WId
        ? initialNewHarvest_WId({ cultivationId: cultivation?._id })
        : {},
    );
  }, [cultivation?._id]);

  // BEGIN LOGIC

  const isBeginSelected = () =>
    !!(
      typeof newHarvest.beginX === "number" &&
      typeof newHarvest.beginY === "number"
    );

  const onBeginHarvestingCoordinates = ({ x, y, cropVariety }) => {
    setNewHarvest((prev) => ({
      ...prev,
      beginX: x,
      beginY: y,
      toHarvestCells: [...(prev.toHarvestCells ?? []), `${x},${y}`],
      cropVariety,
    }));
  };

  // END LOGIC

  const onEndHarvestingCoordinates = ({ x, y, isContinue }) => {
    console.log(newHarvest);
    const rectCells = utils.harvest.getHarvestCellsRect({
      beginX: newHarvest.beginX,
      beginY: newHarvest.beginY,
      endX: x,
      endY: y,
      cultivationCells,
      cropVarietyId: newHarvest.cropVariety._id,
    });
    setNewHarvest((prev) => ({
      ...prev,
      endX: x,
      endY: y,
      toHarvestCells: [...new Set([...prev.toHarvestCells, ...rectCells])],
    }));

    if (!isContinue) setHarvestCultivationOpen(true);
  };

  // RESETING LOGIC

  const reset = () => {
    setNewHarvest(
      initialNewHarvest_WId
        ? initialNewHarvest_WId({ cultivationId: cultivation?._id })
        : {},
    );
    setChooseNewEnd(initialChooseNewEnd);
    setHarvestCultivationOpen(false);
  };

  const removeBegin = () => {
    setNewHarvest((prev) => ({
      ...prev,
      beginX: null,
      beginY: null,
    }));
  };

  // HANDLE CLICKS

  const handleNotPlanted = (x, y) => {
    alert("Polje nije zasađeno, nije moguće žeti");
  };

  const handleCropVarietyClick = ({ cropVariety, x, y }) => {
    if (isBeginSelected() && newHarvest.toHarvestCells?.length > 0) {
      setChooseNewEnd({
        x,
        y,
        isOpen: true,
      });
    } else {
      console.log("Selected cell crop variety:", cropVariety);
      onBeginHarvestingCoordinates({ x, y, cropVariety });
    }
  };

  // CHOICE MENU OPTIONS

  const choiceOptions = [
    {
      label: END_HARVESTING,
      onClick: () => {
        setChooseNewEnd((prev) => {
          return { ...prev, isOpen: false, choice: END_HARVESTING };
        });
        onEndHarvestingCoordinates({
          x: chooseNewEnd.x,
          y: chooseNewEnd.y,
        });
      },
    },
    {
      label: CONTINUE_HARVESTING,
      onClick: () => {},
    },
    {
      label: "Odustani",
      onClick: () => {
        reset();
      },
      className: "btn w-full cancelButton",
    },
  ];

  return (
    <>
      <Modal title="Berba" isOpen={isOpen} onCancel={onCancel}>
        <div className="flex flex-col gap-2">
          <div className="font-bold text-xl">{cultivation?.name || "N/A"}</div>
          <div>{cultivation?.description}</div>
          <div className="text-sm text-gray-500">
            Kreirano: {showDate(cultivation?.createdAt)} <br />
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
              toHarvestCells={newHarvest?.toHarvestCells}
              handleNotPlanted={handleNotPlanted}
              handleCropVarietyClick={handleCropVarietyClick}
              harvestMode={true}
            />
          </div>
        </div>
      </Modal>
      {chooseNewEnd.isOpen && (
        <MenuModal
          invertColor="true"
          isOpen={chooseNewEnd.isOpen}
          onCancel={reset}
          options={choiceOptions}
        />
      )}
      {harvestCultivationOpen && (
        <HarvestCultivation
          isOpen={harvestCultivationOpen}
          onCancel={reset}
          onSubmit={reset}
          newNewHarvest={newHarvest}
          setNewHarvest={setNewHarvest}
          availablePlans={availablePlans}
          onChoosePlan={onChoosePlan}
          submitDisabled={submitDisabled}
        />
      )}
    </>
  );
}

const initialChooseNewEnd = {
  isOpen: false,
  choice: null,
  x: null,
  y: null,
};

const initialNewHarvest_WId = ({ cultivationId }) => {
  // we are choosing variaty when clicking on it
  return {
    cultivationId: cultivationId || null,
    cropVariety: null,
    harvestPlan: null,
    toHarvestCells: [],
    harvestedAt: new Date("2026-03-10T00:00:00Z"),
    beginX: null,
    beginY: null,
    endX: null,
    endY: null,
  };
};

const prepareHarvestBody = (newHarvest) => ({
  cultivationId: newHarvest.cultivationId,
  cropVarietyId: newHarvest.variety._id,
  relativeCoords: newHarvest.toHarvestCells,
  harvestedAt: newHarvest.harvestedAt,
  plantingPlanId: newPlantage.plantingPlan?._id,
});
