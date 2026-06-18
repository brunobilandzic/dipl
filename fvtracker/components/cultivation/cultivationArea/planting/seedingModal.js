"use client";

import { FieldGrid } from "@/components/cultivation/fields/preview/grid";
import Modal from "@/components/layout/modals/modal";
import { showDate } from "@/lib/utils/display";
import { useEffect, useState } from "react";
import utils from "@/lib/utils";
import { MenuModal } from "@/components/layout/modals/menu";
import {
  END_PLANTING,
  CONTINUE_PLANTING,
} from "@/lib/constants/cultivation/plants";
import { useDispatch, useSelector } from "react-redux";
import { PlantCultivation } from "@/components/cultivation/cultivationArea/planting/plantCultivation";
import api from "@/lib/api";
import { createPlantage, setFields } from "@/store/cultivation";
import { setLoading } from "@/store/loading";
import { setError } from "@/store/error";
import handleError from "@/lib/constants/errors/client/handleError";
import { useRouter } from "next/navigation";
import { getDimensionsCA } from "@/lib/utils/cultivation/fields/cultivationAreas";
import { refreshFields } from "@/lib/utils/cultivation/fields/fields";
import { plantPayWorker } from "@/store/workers";

export const SeedingModal = ({
  isOpen,
  onCancel,
  cultivation,
  caDims,
  cultivationCells,
  field,
}) => {
  const [newPlantage, setNewPlantage] = useState({});
  const [allFieldPlans, setAllFieldPlans] = useState({});
  const [availablePlans, setAvailablePlans] = useState({});

  const dispatch = useDispatch();
  const router = useRouter();
  const crops = useSelector((state) => state.cultivation.crops);
  const fields = useSelector((state) => state.cultivation.fields);

  const getPlans = (fields) => {
    if (!fields || fields.length === 0) return {};
    const _field = fields.find((f) => f.name === field.name);
    const allPlans = utils.plans.getFieldPlans({ field: _field });
    setAllFieldPlans(allPlans);
    return allPlans;
  };

  useEffect(() => {
    if (fields) {
      getPlans(fields);
    }
  }, [fields]);

  const checkPlans = () => {
    return (
      allFieldPlans?.plantingPlans && allFieldPlans.plantingPlans?.length > 0
    );
  };

  useEffect(() => {
    if (!newPlantage?.variety?._id) {
      setAvailablePlans({});
      return;
    }

    const plans =
      allFieldPlans && Object.keys(allFieldPlans).length > 0
        ? allFieldPlans
        : getPlans(fields);

    const cropVariety = crops?.varieties?.find(
      (v) => v._id.toString() === newPlantage.variety._id.toString(),
    );

    const available = utils.plans.getPlansForCropVariety({
      allFieldPlans: plans,
      cropVariety,
      plantageArea: newPlantage.toPlantCells?.length || 1,
    });

    setAvailablePlans(available);
  }, [
    newPlantage?.variety?._id,
    allFieldPlans,
    fields,
    newPlantage?.toPlantCells,
  ]);

  useEffect(() => {
    if (fields) return;
    refreshFields({ dispatch });
  }, [fields]);

  useEffect(() => {
    if (!cultivation?._id) return;
    if (!crops?.generalTypes?.length) return;

    setNewPlantage(
      initialNewPlantage_WId
        ? initialNewPlantage_WId({ cultivationId: cultivation?._id, crops })
        : {},
    );
  }, [cultivation, crops]);

  // BEGIN LOGIC

  const isBeginSelected = () =>
    !!(
      typeof newPlantage.beginX === "number" &&
      typeof newPlantage.beginY === "number"
    );

  const [chooseNewEnd, setChooseNewEnd] = useState(initialChooseNewEnd);
  const [plantCultivationOpen, setPlantCultivationOpen] = useState(false);

  // PLANTING SELECTION

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
      onBeginPlantingCoordinates({ x, y });
    }
  };

  const onBeginPlantingCoordinates = ({ x, y }) => {
    setNewPlantage((prev) => ({
      ...prev,
      beginX: x,
      beginY: y,
      toPlantCells: [...(prev.toPlantCells ?? []), `${x},${y}`],
    }));
    // FIELD & PLANS LOADING
  };

  const onEndPlantingCoordinates = ({ x, y, isContinue }) => {
    const { planted, error } =
      utils.cultivation.cultivationAreas.getCellsInRect({
        beginX: newPlantage.beginX,
        beginY: newPlantage.beginY,
        endX: x,
        endY: y,
        toPlantCells: newPlantage.toPlantCells,
        toPlantCultivation: cultivation,
      });
    if (error) {
      console.log("Error getting cells in rect:", error);
      dispatch(setError(error));
      reset();
      return;
    }
    if (!planted) {
      reset();
      return;
    }

    setNewPlantage((prev) => ({
      ...prev,
      endX: x,
      endY: y,
      toPlantCells: [...new Set([...prev.toPlantCells, ...planted])],
    }));

    if (!isContinue) setPlantCultivationOpen(true);
  };

  // RESETING LOGIC

  const removeBegin = () => {
    setNewPlantage((prev) => ({
      ...prev,
      beginX: null,
      beginY: null,
    }));
  };

  const reset = () => {
    setNewPlantage(
      initialNewPlantage_WId
        ? initialNewPlantage_WId({
            cultivationId: cultivation?._id,
            crops,
          })
        : {},
    );
    setChooseNewEnd(initialChooseNewEnd);
    setPlantCultivationOpen(false);
  };

  // MENU OPTIONS

  const choiceOptions = [
    {
      label: END_PLANTING,
      onClick: () => {
        setChooseNewEnd((prev) => {
          return { ...prev, isOpen: false, choice: END_PLANTING };
        });
        onEndPlantingCoordinates({
          x: chooseNewEnd.x,
          y: chooseNewEnd.y,
        });
      },
    },
    {
      label: CONTINUE_PLANTING,
      onClick: () => {
        setChooseNewEnd({ isOpen: false, choice: CONTINUE_PLANTING });
        onEndPlantingCoordinates({
          x: chooseNewEnd.x,
          y: chooseNewEnd.y,
          isContinue: true,
        });
        removeBegin();
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

  // SUBMIT HANDLERS

  const onSubmitNewPlantage = async () => {
    //submit to backend
    dispatch(setLoading(true));
    try {
      const body = preparePlantageBody(newPlantage);
      const res = await api.post("/cultivation/plant/new-plantage", body);
      const { newPlantage: newPlantageFromRes, plantageWork } = res.data;
      dispatch(
        createPlantage({
          cultivationId: newPlantage.cultivationId,
          newPlantage: newPlantageFromRes,
          cropVarietyId: newPlantage.variety._id,
        }),
      );
      dispatch(
        plantPayWorker({
          workerId: newPlantage.workerId,
          plantageWork,
        }),
      );
      /*
      dispatch(fetchWorkers(CULTIVATION_MANAGER));
     
      await refreshFields({ dispatch }); */
    } catch (error) {
      console.error("Error preparing plantage body:", error);
      handleError(
        {
          ...error,
          generalMessage: "Greška prilikom kreiranja sadnje",
        },
        router,
      );
    } finally {
      dispatch(setLoading(false));
    }
    reset();
  };

  // PLAN SELECTION

  const onChoosePlan = (plan) => {
    setNewPlantage((prev) => ({
      ...prev,
      plantingPlan: plan,
    }));
  };

  // RENDER
  return (
    <>
      <Modal title="Sadnja" isOpen={isOpen} onCancel={onCancel}>
        {JSON.stringify({
          plantingPlans: allFieldPlans?.plantingPlans?.length,
        })}
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
              seedMode={true}
              toPlantCells={newPlantage?.toPlantCells}
              handleNotPlanted={handleNotPlanted}
              fieldView={false}
            />
          </div>
        </div>
      </Modal>
      {chooseNewEnd.isOpen && (
        <MenuModal
          invertColor="true"
          isOpen={chooseNewEnd.isOpen}
          options={choiceOptions}
          onCancel={reset}
        />
      )}
      {plantCultivationOpen && (
        <PlantCultivation
          onSubmit={onSubmitNewPlantage}
          isOpen={plantCultivationOpen}
          onCancel={reset}
          newPlantage={newPlantage}
          setNewPlantage={setNewPlantage}
          crops={crops}
          allFieldPlans={allFieldPlans}
          availablePlans={availablePlans}
          onChoosePlan={onChoosePlan}
          submitDisabled={utils.objects.checkEmpty(newPlantage, true)}
        />
      )}
    </>
  );
};

const initialChooseNewEnd = {
  isOpen: false,
  choice: null,
  x: null,
  y: null,
};

const initialNewPlantage_WId = ({ cultivationId, crops }) => {
  const {
    generalTypes = [],
    types = [],
    varieties: cropVarieties = [],
  } = crops || {};

  const defaultGeneralType = generalTypes?.find(
    (gt) => gt.name === "Jabučasto voće",
  )?._id;
  const defaultType = types.find((t) => t.name === "Jabuka")?._id || "";
  const defaultVariety =
    cropVarieties.filter((v) => v.name === "Idared")[0]?._id || "";

  return {
    generalType: {
      _id: defaultGeneralType,
      name:
        generalTypes.find((gt) => gt._id === defaultGeneralType)?.name || "N/A",
    },
    type: {
      _id: defaultType,
      name: types.find((t) => t._id === defaultType)?.name || "N/A",
    },
    cultivationId: cultivationId || null,
    variety: {
      _id: defaultVariety,
      name: cropVarieties.find((v) => v._id === defaultVariety)?.name || "N/A",
    },
    plantingPlan: null,
    toPlantCells: [],
    plantedAt: new Date("2026-03-10T00:00:00Z"),
    beginX: null,
    beginY: null,
    endX: null,
    endY: null,
    workerId: null,
  };
};

const preparePlantageBody = (newPlantage) => ({
  cultivationId: newPlantage.cultivationId,
  cropVarietyId: newPlantage.variety._id,
  relativeCoords: newPlantage.toPlantCells,
  plantedAt: newPlantage.plantedAt,
  harvestedAt: newPlantage.harvestedAt,
  plantingPlanId: newPlantage.plantingPlan?._id,
  workerId: newPlantage.workerId,
});

export const getPlantageDimensions = ({ beginX, beginY, endX, endY }) => {
  const { width, length } = getDimensionsCA(beginX, beginY, endX, endY);

  return width * length;
};
