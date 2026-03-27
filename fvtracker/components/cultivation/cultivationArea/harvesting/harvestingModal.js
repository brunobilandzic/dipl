import Modal from "@/components/layout/modals/modal";
import { showDate } from "@/lib/utils/display";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HarvestCultivation } from "./harvestCultivation";
import { FieldGrid } from "../../fields/preview/grid";
import { MenuModal } from "@/components/layout/modals/menu";
import {
  CONTINUE_HARVESTING,
  END_HARVESTING,
} from "@/lib/constants/cultivation/plants";
import utils from "@/lib/utils";
import { refreshFields } from "@/lib/utils/fields";
import { useRouter } from "next/navigation";
import { setLoading } from "@/store/loading";
import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";

export function HarvestingModal({
  isOpen,
  onCancel,
  onConfirm,
  cultivation,
  cultivationCells,
  caDims,
  field,
}) {
  const dispatch = useDispatch();

  const fields = useSelector((state) => state.cultivation.fields);
  const [newHarvest, setNewHarvest] = useState({});
  const [chooseNewEnd, setChooseNewEnd] = useState(initialChooseNewEnd);
  const [harvestCultivationOpen, setHarvestCultivationOpen] = useState(false);
  const router = useRouter();
  const [allFieldPlans, setAllFieldPlans] = useState({});
  const [availablePlans, setAvailablePlans] = useState({});

  useEffect(() => {
    if (fields) return;
    refreshFields({ dispatch, router });
  }, [fields]);

  const getPlans = () => {
    if (!fields || fields.length === 0) {
      console.log("No fields available to get plans from.");
      return {};
    }
    const _field = fields.find((f) => f.name === field.name);
    const allPlans = utils.plans.getFieldPlans({ field: _field });

    setAllFieldPlans(allPlans);
  };

  useEffect(() => {
    getPlans();
  }, [fields]);

  const checkPlans = () => {
    return (
      allFieldPlans?.harvestingPlans &&
      allFieldPlans?.harvestingPlans?.length > 0
    );
  };

  useEffect(() => {
    if (newHarvest?.cropVariety?._id && checkPlans()) {
      const availablePlans = utils.plans.getPlansForCropVariety({
        allFieldPlans,
        cropVarietyId: newHarvest.cropVariety._id,
      });
      setAvailablePlans(availablePlans);
    } else {
      setAvailablePlans({});
    }
  }, [newHarvest?.cropVariety?._id, allFieldPlans]);

  //use effects to monitor state changes

  useEffect(() => {
    console.log("New harvest state updated:", newHarvest);
  }, [newHarvest]);

  useEffect(() => {
    console.log("all plans for field:", allFieldPlans);
  }, [allFieldPlans]);

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

  const resetBegin = () => {
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
      onClick: () => {
        setChooseNewEnd({ isOpen: false, choice: CONTINUE_HARVESTING });
        onEndHarvestingCoordinates({
          x: chooseNewEnd.x,
          y: chooseNewEnd.y,
          isContinue: true,
        });
        resetBegin();
      },
    },
    {
      label: "Odustani",
      onClick: () => {
        reset();
      },
      className: "btn w-full cancelButton",
    },
  ];

  const onChoosePlan = (plan) => {
    setNewHarvest((prev) => ({
      ...prev,
      harvestingPlan: plan,
    }));
  };

  const submitHarvest = async () => {
    console.log("Submitting harvest with data:", prepareHarvestBody(newHarvest));
    dispatch(setLoading(true));
    try{
      const res = await api.post("/cultivation/harvest/new-harvest", prepareHarvestBody(newHarvest));
      console.log("Harvest submission response:", res);
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Error submitting harvest:", error);
      handleError({...error, customMessage: "Došlo je do greške prilikom kreiranja berbe."});
    } finally {
      dispatch(setLoading(false));
    }
  };

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
          onSubmit={submitHarvest}
          newHarvest={newHarvest}
          setNewHarvest={setNewHarvest}
          availablePlans={availablePlans}
          onChoosePlan={onChoosePlan}
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
    harvestingPlan: null,
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
  cropVarietyId: newHarvest.cropVariety._id,
  harvestingPlanId: newHarvest.harvestingPlan?._id,
  toHarvestCells: newHarvest.toHarvestCells,
});
