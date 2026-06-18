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
import { refreshFields } from "@/lib/utils/cultivation/fields/fields";
import { useRouter } from "next/navigation";
import { setLoading } from "@/store/loading";
import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { harvestCells } from "@/store/cultivation";
import { getPlantageDimensions } from "../planting/seedingModal";
import { fetchWorkerById, fetchWorkers } from "@/store/workers";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";

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
  const workerId = useSelector((state) => state.user.session.workerId);
  useEffect(() => {
    if (workerId) {
      setNewHarvest((prev) => ({
        ...prev,
        workerId,
      }));
    }
  }, [workerId]);

  const chooseWorker = (e) => {
    const { name, value } = e.target;
    setNewHarvest((prev) => ({
      ...prev,
      workerId: value,
    }));
  };

  useEffect(() => {
    if (fields) return;
    refreshFields({ dispatch, router });
  }, [fields]);

  const getPlans = () => {
    if (!fields || fields.length === 0) return {};
    const _field = fields.find((f) => f.name === field.name);
    const allPlans = utils.plans.getFieldPlans({ field: _field });
    setAllFieldPlans(allPlans);
    return allPlans;
  };

  useEffect(() => {
    if (!fields || fields.length === 0) return;
    getPlans();
  }, [fields]);

  const checkPlans = () => {
    return (
      allFieldPlans?.harvestingPlans &&
      allFieldPlans?.harvestingPlans?.length > 0
    );
  };

  useEffect(() => {
    if (!newHarvest?.cropVariety?._id) {
      setAvailablePlans({});
      return;
    }
    const plans =
      allFieldPlans && Object.keys(allFieldPlans).length > 0
        ? allFieldPlans
        : getPlans();

    if (!plans?.harvestingPlans?.length) return;

    const available = utils.plans.getPlansForCropVariety({
      allFieldPlans: plans,
      plantageArea: newHarvest.toHarvestCells?.length || 1,
      cropVariety: newHarvest.cropVariety,
    });
    setAvailablePlans(available);
  }, [
    newHarvest?.cropVariety?._id,
    allFieldPlans,
    fields,
    newHarvest?.toHarvestCells,
  ]);

  // set harvest when cult id
  useEffect(() => {
    if (!cultivation?._id) return;

    setNewHarvest(
      initialNewHarvest_WId
        ? initialNewHarvest_WId({ cultivationId: cultivation?._id, workerId })
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
    setNewHarvest((prev) => {
      return {
        ...prev,
        beginX: x,
        beginY: y,
        toHarvestCells: [...(prev.toHarvestCells ?? []), `${x},${y}`],
        cropVariety,
      };
    });
  };

  // END LOGIC

  const onEndHarvestingCoordinates = ({ x, y, isContinue }) => {
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
        ? initialNewHarvest_WId({ cultivationId: cultivation?._id, workerId })
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
      if (cropVariety._id !== newHarvest.cropVariety._id) {
        alert("Ne možete žeti različite sorte u istoj berbi");
        return;
      }
      setChooseNewEnd({
        x,
        y,
        isOpen: true,
      });
    } else {
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
    dispatch(setLoading(true));
    try {
      const res = await api.post(
        "/cultivation/harvest/new-harvest",
        prepareHarvestBody(newHarvest),
      );
      dispatch(
        harvestCells({
          cultivationId: newHarvest.cultivationId,
          harvestedCropVarieties: res.data.harvestedCropVarieties,
          cropVarietyId: newHarvest.cropVariety._id,
        }),
      );
      if (workerId) {
        dispatch(fetchWorkerById(workerId));
      } else {
        dispatch(fetchWorkers(CULTIVATION_MANAGER));
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error submitting harvest:", error);
      handleError({
        ...error,
        customMessage: "Došlo je do greške prilikom kreiranja berbe.",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const chooseQuality = (quality) => {
    setNewHarvest((prev) => ({
      ...prev,
      quality,
    }));
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
              fieldView={false}
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
          workerId={workerId}
          chooseWorker={chooseWorker}
          chooseQuality={chooseQuality}
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

const initialNewHarvest_WId = ({ cultivationId, workerId }) => {
  // we are choosing variaty when clicking on it
  return {
    cultivationId: cultivationId || null,
    cropVariety: null,
    harvestingPlan: null,
    workerId: workerId || null,
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
  workerId: newHarvest.workerId,
  quality: newHarvest.quality,
});
