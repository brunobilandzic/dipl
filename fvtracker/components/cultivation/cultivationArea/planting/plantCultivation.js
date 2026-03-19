"use client";

import { useEffect, useState } from "react";
import { AppDatePicker, AppSelect } from "@/components/form/inputs";
import Modals from "@/components/layout/modals";
import utils from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import api from "@/lib/api";
import { setFields } from "@/store/cultivation";

import "react-datepicker/dist/react-datepicker.css";

export const PlantCultivation = ({
  isOpen,
  onCancel,
  onSubmit,
  newPlantage,
  setNewPlantage,
  crops,
}) => {
  const [plantingPlans, setPlantingPlans] = useState([]);
  const [availablePlantingPlans, setAvailablePlantingPlans] = useState([]);
  const fields = useSelector((state) => state.cultivation.fields);
  const dispatch = useDispatch();

  const refreshFields = async () => {
    try {
      const res = await api.get("/cultivation/fields");
      if (res.data && res.data.fields) {
        dispatch(setFields(res.data.fields));
        setPlantingPlans(utils.plans.getFieldsPlans(res.data.fields));
      }
    } catch (error) {
      console.log("Error fetching fields:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      alert(`Error fetching fields: ${errorMessage}`);
    }
  };

  useEffect(() => {
    if (fields && fields.length > 0) return;

    refreshFields();
  }, [fields]);
  const onChange = (e) => {
    const { name, value, options, selectedIndex } = e.target;

    if (options) {
      const label = options[selectedIndex].text;

      setNewPlantage((prev) => ({
        ...prev,
        [name]: {
          name: label,
          _id: value,
        },
      }));
    } else {
      setNewPlantage((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableVarieties, setAvailableVarieties] = useState([]);

  useEffect(() => {
    if (newPlantage.generalType) {
      const types = crops?.types.filter(
        (t) => t.generalTypeName === newPlantage.generalType.name,
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

  useEffect(() => {
    console.log("Selected variety:", newPlantage.variety);
    if (newPlantage.variety) {
      setAvailablePlantingPlans(
        utils.plans.getPlansForCropVariety({
          plantingPlans,
          cropVarietyId: newPlantage.variety._id,
        }),
      );
    } else {
      setAvailablePlantingPlans([]);
    }
  }, [newPlantage?.variety, plantingPlans]);

  useEffect(() => {
    console.log("Available planting plans:", availablePlantingPlans);
  }, [availablePlantingPlans]);

  if (!isOpen) return null;
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
          <AppSelect
            label="Glavna vrsta"
            name="generalType"
            value={newPlantage?.generalType?._id || ""}
            defaultValue={newPlantage?.generalType?._id || ""}
            onChange={onChange}
            options={crops?.generalTypes.map((gt) => ({
              label: gt.name,
              value: gt._id,
            }))}
          />
        </div>
        <div className={``}>
          {newPlantage.generalType.name && (
            <AppSelect
              label="Tip biljke"
              name="type"
              value={newPlantage?.type._id || ""}
              defaultValue={newPlantage?.type._id || ""}
              onChange={onChange}
              options={availableTypes?.map((ct) => ({
                label: ct.name,
                value: ct._id,
              }))}
            />
          )}
          {newPlantage.type.name && (
            <AppSelect
              label="Varijanta"
              name="variety"
              value={newPlantage?.variety._id || ""}
              defaultValue={newPlantage?.variety._id || ""}
              onChange={onChange}
              options={availableVarieties?.map((cv) => ({
                label: cv.name,
                value: cv._id,
              }))}
            />
          )}
          <div className="">
            <AppDatePicker
              label="Datum sadnje"
              name="plantedAt"
              value={newPlantage.plantedAt}
              onChange={onChange}
              placeholder="Izaberite datum"
            />
          </div>
        </div>
      </div>
    </Modals.FormModal>
  );
};
