"use client";

import { useEffect, useState } from "react";
import { AppDatePicker, AppSelect } from "@/components/form/inputs";
import Modals from "@/components/layout/modals";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export const PlantCultivation = ({
  isOpen,
  onCancel,
  onSubmit,
  newPlantage,
  setNewPlantage,
  crops,
}) => {
  const onChange = (e) => {
    const { name, value, options, selectedIndex } = e.target;
    const label = options[selectedIndex].text;
    
    setNewPlantage((prev) => ({
      ...prev,
      [name]: {
        name: label,
        _id: value,
      },
    }));
  };

  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableVarieties, setAvailableVarieties] = useState([]);

  useEffect(() => {
    if (newPlantage.generalType) {
      const types = crops.types.filter(
        (t) => t.generalTypeName === newPlantage.generalType.name,
      );
      setAvailableTypes(types);
    } else {
      setAvailableTypes([]);
    }
  }, [newPlantage.generalType, crops.types]);

  useEffect(() => {
    if (newPlantage.type) {
      const varieties = crops.varieties.filter(
        (v) => v.cropTypeName === newPlantage.type.name,
      );
      setAvailableVarieties(varieties);
    } else {
      setAvailableVarieties([]);
    }
  }, [newPlantage.type, crops.varieties]);

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
            value={newPlantage?.generalType._id || ""}
            defaultValue={newPlantage?.generalType._id || ""}
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
