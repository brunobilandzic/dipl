"use client";

import { useEffect, useState } from "react";
import { AppDatePicker, AppSelect } from "@/components/form/inputs";
import Modals from "@/components/layout/modals";
import "react-datepicker/dist/react-datepicker.css";
import { ChoosePlan } from "@/components/cultivation/plans/planting/choosePlan";
import { useSelector } from "react-redux";
import { ChooseWorker } from "@/components/workers/choose";
import { EMPLOYMENT_STATUS_EMPLOYED } from "@/lib/constants/users/workers";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";

export const PlantCultivation = ({
  isOpen,
  onCancel,
  onSubmit,
  newPlantage,
  setNewPlantage,
  availablePlans,
  crops,
  onChoosePlan,
  submitDisabled,
}) => {
  const workerId = useSelector((state) => state.user.session.workerId);
  const workersRedux = useSelector((state) => state.workers.items);
  const workers = workersRedux.filter(
    (worker) => worker.employmentRequest.status === EMPLOYMENT_STATUS_EMPLOYED,
  );
  useEffect(() => {
    if (workerId) {
      setNewPlantage((prev) => ({
        ...prev,
        workerId,
      }));
    }
  }, [workerId]);
  const onChange = (e) => {
    const { name, value, options, selectedIndex } = e.target;

    if (options) {
      const label = options[selectedIndex].text;

      if(name === "variety") {
        const quantityPerCell = crops.varieties.find(v => v._id === value)?.quantityPerCell || 0;
        setNewPlantage((prev) => ({
          ...prev,
          [name]: {
            name: label,
            _id: value,
            quantityPerCell,
          },
        }));
      } else {
        setNewPlantage((prev) => ({
          ...prev,
          [name]: {
            name: label,
            _id: value,
          },
        }));
      }
      } else {
        setNewPlantage((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }

  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableVarieties, setAvailableVarieties] = useState([]);

  useEffect(() => {
    if (newPlantage.generalType) {
      const types = crops?.types.filter(
        (t) => t.generalTypeName === newPlantage.generalType?.name,
      );
      const varieties = crops?.varieties.filter((v) =>
        types?.map((t) => t._id).includes(v.cropType?._id),
      );
      setAvailableTypes(types);
      setAvailableVarieties(varieties);
    } else {
      setAvailableTypes([]);
    }
  }, [newPlantage?.generalType, crops?.types]);

  useEffect(() => {
    if (newPlantage.type) {
      const varieties = crops?.varieties.filter(
        (v) => v.cropTypeName === newPlantage.type.name,
      );
      setAvailableVarieties(varieties);
    } else {
      setAvailableVarieties([]);
    }
  }, [newPlantage?.type, crops?.varieties]);

  const chooseWorker = (e) => {
    const { name, value } = e.target;
    setNewPlantage((prev) => ({
      ...prev,
      workerId: value,
    }));
  };

  if (!isOpen) return null;
  return (
    <Modals.FormModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Zasadi na područje"
      onSubmit={onSubmit}
      invertColor={true}
      submitText="Završi sadnju"
      submitDisabled={submitDisabled}
    >
      <div className={`form`}>
        <div className={``}>
          <AppSelect
            label="Glavna vrsta"
            name="generalType"
            value={newPlantage?.generalType?._id || ""}
            defaultValue={newPlantage?.generalType?._id || ""}
            onChange={onChange}
            options={crops?.generalTypes?.map((gt) => ({
              label: gt.name,
              value: gt._id,
            }))}
          />
        </div>
        <div className={``}>
          {newPlantage.generalType?.name && (
            <AppSelect
              label="Tip biljke"
              name="type"
              value={newPlantage?.type?._id || ""}
              defaultValue={newPlantage?.type?._id || ""}
              onChange={onChange}
              options={availableTypes?.map((ct) => ({
                label: ct.name,
                value: ct._id,
              }))}
            />
          )}
          {newPlantage.type?.name && (
            <AppSelect
              label="Varijanta"
              name="variety"
              value={newPlantage?.variety?._id || ""}
              defaultValue={newPlantage?.variety?._id || ""}
              onChange={onChange}
              options={availableVarieties?.map((cv) => ({
                label: cv.name,
                value: cv._id,
              }))}
            />
          )}
          <div>
            {!workerId && (
              <ChooseWorker
                workers={workers}
                onChoose={chooseWorker}
                managerModelName={CULTIVATION_MANAGER}
              />
            )}
          </div>
          <div>
            <ChoosePlan
              selectedPlan={newPlantage.plantingPlan}
              availablePlans={availablePlans}
              onChoosePlan={onChoosePlan}
              cropVarietyId={newPlantage.variety?._id}
              plant={true}
            />
          </div>
        </div>
      </div>
    </Modals.FormModal>
  );
};
