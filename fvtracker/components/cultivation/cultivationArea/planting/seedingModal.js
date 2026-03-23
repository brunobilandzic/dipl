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

export const SeedingModal = ({
  isOpen,
  onCancel,
  cultivation,
  caDims,
  cultivationCells,
  field,
}) => {
  const [newPlantage, setNewPlantage] = useState({});
  const [allFieldPlans, setAllFieldPlans] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  useEffect(() => {
    console.log({
      availablePlans,
      allFieldPlans,
    });
  }, [availablePlans, allFieldPlans]);

  const dispatch = useDispatch();
  const crops = useSelector((state) => state.cultivation.crops);
  const fields = useSelector((state) => state.cultivation.fields);

  const refreshFields = async () => {
    try {
      const res = await api.get("/cultivation/fields");
      if (res.data && res.data.fields) {
        dispatch(setFields(res.data.fields));
        const getPlans = (fields) => {
          const field = fields.find((f) => f.name === field.name);
          return utils.plans.getFieldPlans({ field });
        };
        setAllFieldPlans(getPlans(res.data.fields));
      }
    } catch (error) {
      console.log("Error fetching fields:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Nepoznata greška";
      alert(`Greška pri dohvaćanju polja: ${errorMessage}`);
    }
  };

  const getPlans = (fields) => {
    const _field = fields.find((f) => f.name === field.name);
    const allPlans = utils.plans.getFieldPlans({ field: _field });
    console.log("setting allPlans:", allPlans);
    setAllFieldPlans(allPlans);
  };

  useEffect(() => {
    if (fields && fields.length > 0) {
      getPlans(fields);
    }
  }, [fields]);

  const checkPlans = () => !!allFieldPlans;

  useEffect(() => {
    if (newPlantage?.variety?._id) {
      const availablePlans = utils.plans.getPlansForCropVariety({
        allFieldPlans,
        cropVarietyId: newPlantage.variety._id,
      });
      setAvailablePlans(availablePlans);
    } else {
      setAvailablePlans([]);
    }
  }, [fields, newPlantage?.variety]);

  useEffect(() => {
    if (fields && fields.length > 0) return;

    refreshFields();
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

  const isBeginSelected = () =>
    !!(
      typeof newPlantage.beginX === "number" &&
      typeof newPlantage.beginY === "number"
    );

  const removeBegin = () => {
    setNewPlantage((prev) => ({
      ...prev,
      beginX: null,
      beginY: null,
    }));
  };
  const [chooseNewEnd, setChooseNewEnd] = useState(initialChooseNewEnd);
  const [plantCultivationOpen, setPlantCultivationOpen] = useState(false);

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
      toPlantCells: [...(prev.toPlantCells ?? []), `${x},${y}`],
    }));
  };

  const onEndCoordinates = ({ x, y, isContinue }) => {
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
      toPlantCells: [...new Set([...prev.toPlantCells, ...planted])],
    }));

    if (!isContinue) setPlantCultivationOpen(true);
  };

  const reset = () => {
    setNewPlantage(
      initialNewPlantage_WId
        ? initialNewPlantage_WId({ cultivationId: cultivation?._id, crops })
        : {},
    );
    setChooseNewEnd(initialChooseNewEnd);
    setPlantCultivationOpen(false);
  };

  const choiceOptions = [
    {
      label: END_PLANTING,
      onClick: () => {
        setChooseNewEnd((prev) => {
          return { ...prev, isOpen: false, choice: END_PLANTING };
        });
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
        onEndCoordinates({
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

  useEffect(() => {
    if (newPlantage?.variety?._id) {
      const availablePlans = utils.plans.getPlansForCropVariety({
        allFieldPlans: allFieldPlans,
        cropVarietyId: newPlantage.variety._id,
      });
      setAvailablePlans(availablePlans);
    } else {
      setAvailablePlans([]);
    }
  }, [newPlantage?.variety, allFieldPlans]);

  const hanleCropVarietyClick = (cropVariety) => {
    console.log("Clicked crop variety:", cropVariety);
  };

  useEffect(() => {
    console.log("New plantage state:", newPlantage);
  }, [newPlantage]);

  useEffect(() => {
    console.log("Available planting plans updated:", availablePlans);
  }, [availablePlans]);

  const onChoosePlan = (plan) => {
    setNewPlantage((prev) => ({
      ...prev,
      plantingPlan: plan,
    }));
  };

  if (!cultivation || !isOpen) return null;
  return (
    <>
      <Modal title="Sijanje" isOpen={isOpen} onCancel={onCancel}>
        {JSON.stringify(allFieldPlans)}
        <div className="flex flex-col gap-2">
          <div className="font-bold text-xl">{cultivation?.name || "N/A"}</div>
          <div>{cultivation?.description}</div>
          <div className="text-sm text-gray-500">
            Kreirano: {showDate(cultivation?.createdAt)} <br />
          </div>
        </div>
        <div className="mt-4 p-4">
          {JSON.stringify(cultivationCells)}
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
              hanleCropVarietyClick={hanleCropVarietyClick}
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

  const defaultGeneralType = generalTypes[0]?._id || "";
  const defaultType =
    types.filter((t) => t.generalTypeName === generalTypes[0]?.name)[0]?._id ||
    "";
  const defaultVariety =
    cropVarieties.filter(
      (v) => v.cropTypeName === types.find((t) => t._id === defaultType)?.name,
    )[0]?._id || "";

  return {
    cultivationId: cultivationId || null,
    generalType: {
      _id: defaultGeneralType,
      name:
        generalTypes.find((gt) => gt._id === defaultGeneralType)?.name || "N/A",
    },
    type: {
      _id: defaultType,
      name: types.find((t) => t._id === defaultType)?.name || "N/A",
    },
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
  };
};

const preparePlantageBody = (newPlantage) => ({
  cultivationId: newPlantage.cultivationId,
  cropVarietyId: newPlantage.variety._id,
  relativeCoords: newPlantage.toPlantCells,
  plantedAt: newPlantage.plantedAt,
  harvestedAt: newPlantage.harvestedAt,
  plantingPlanId: newPlantage.plantingPlan?._id,
});
