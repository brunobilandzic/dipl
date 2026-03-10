"use client";

import { useEffect, useState } from "react";
import { AppSelect } from "@/components/form/inputs";
import Modals from "../../../layout/modals";

export const PlantCultivation = ({
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

  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableVarieties, setAvailableVarieties] = useState([]);

  useEffect(() => {
    if (newPlantage.generalType) {
      const types = crops.types.filter(
        (t) => t.generalTypeName === newPlantage.generalType,
      );
      setAvailableTypes(types);
    } else {
      setAvailableTypes([]);
    }
  }, [newPlantage.generalType, crops.types]);

  useEffect(() => {
    if (newPlantage.type) {
      const varieties = crops.varieties.filter(
        (v) => v.cropTypeName === newPlantage.type,
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
            value={newPlantage?.generalType || ""}
            onChange={onChange}
            options={crops?.generalTypes.map((mt) => ({
              label: mt.name,
              value: mt.name,
            }))}
          />
        </div>
        <div className={``}>
          {newPlantage.generalType && (
            <AppSelect
              label="Tip biljke"
              name="type"
              value={newPlantage?.type || ""}
              onChange={onChange}
              options={availableTypes?.map((ct) => ({
                label: ct.name,
                value: ct.name,
              }))}
            />
          )}
          {newPlantage.type && (
            <AppSelect
              label="Varijanta"
              name="variety"
              value={newPlantage?.variety || ""}
              onChange={onChange}
              options={availableVarieties?.map((cv) => ({
                label: cv.name,
                value: cv.name,
              }))}
            />
          )}
        </div>
      </div>
    </Modals.FormModal>
  );
};
