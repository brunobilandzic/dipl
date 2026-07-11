"use client";

import { AppDatePicker, AppInput, AppSelect } from "@/components/form/inputs";
import api from "@/lib/api";
import { createHarvestingPlan, createPlantingPlan } from "@/store/cultivation";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FieldGrid } from "@/components/cultivation/fields/preview/grid";
import utils from "@/lib/utils";
import { FieldStatistics } from "@/components/cultivation/fields/general";
import handleError from "@/lib/constants/errors/client/handleError";
import { Loading } from "@/components/layout/loading";
import { refreshFields } from "@/lib/utils/cultivation/fields/fields";
import { setLoading } from "@/store/loading";
import { refreshManagers } from "@/lib/utils/production/managers";
import { useRouter } from "next/navigation";
import {
  ChooseCropVarietyItems,
  testCropItemData,
} from "@/components/cultivation/crops/choose";

export default function CreatePlantingPlanPageComonent() {
  const [selectedField, setSelectedField] = useState(null);
  return (
    <>
      <div className="border p-4 rounded-lg">
        <SelectField
          selectedField={selectedField}
          setSelectedField={setSelectedField}
        />
      </div>

      {selectedField ? (
        <div className="mt-4 rounded-lg border p-4">
          <FillPlanInfo selectedField={selectedField} itemsName="items" />
        </div>
      ) : null}
    </>
  );
}

export const CreatePlantagePlan = ({}) => {
  return (
    <>
      <Link href={"/plan-sadnje/izradi"}>
        <div className="btn">Izradi plan sadnje</div>
      </Link>
    </>
  );
};

export const SelectField = ({
  selectedField,
  setSelectedField,
  plant = true,
}) => {
  const fields = useSelector((state) => state.cultivation.fields);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (fields) return;
    refreshFields({ dispatch, router });
  }, [fields]);

  if (!fields) {
    return <Loading />;
  }

  if (fields.length === 0) {
    return <div>Nema dostupnih polja. Prvo kreirajte polje.</div>;
  }

  return (
    <>
      <div className="flex w-full flex-wrap gap-4">
        {fields &&
          fields.map((field) => {
            const cultivationCells = utils.cultivation.cultivations.getPlCvs(
              utils.cultivation.cultivations.getCASCultivations(
                field.cultivationAreas,
              ),
            );
            if (plant && !field.plantingPlans) {
              // Keep all fields selectable in create/edit flows.
            }

            return (
              <div
                key={field._id}
                className={`border-2 h-fit w-fit ${selectedField?._id === field._id ? "border-green-500" : "border-gray-300"} rounded-lg p-2 cursor-pointer flex flex-col items-center justify-center `}
                onClickCapture={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (selectedField?._id === field._id) {
                    setSelectedField(null);
                    return;
                  }
                  setSelectedField(field);
                }}
              >
                <div className="mb-2">{field.name}</div>
                <FieldGrid
                  small={true}
                  width={field.dimensions.width}
                  length={field.dimensions.length}
                  plantedCells={utils.cultivation.cultivationAreas.getCASCells(
                    field.cultivationAreas,
                  )}
                  cultivationCells={cultivationCells}
                  cuCellsFieldCoords={true}
                />
                <div className="mt-2 self-start">
                  <FieldStatistics field={field} />
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export const FillPlanInfo = ({
  selectedField,
  plant = true,
  itemsName = "items",
}) => {
  const crops = useSelector((state) => state.cultivation.crops);
  const dispatch = useDispatch();
  const createInitialFormData = ({ field = selectedField?._id } = {}) => {
    const defaultCropData = testCropItemData({ crops });
    const formDataInitial = {
      name: `Plan ${plant ? "sadnje" : "berbe"} - ${new Date().toLocaleString("hr-HR")}`,
      field,
      [itemsName]: defaultCropData,
      plannedPlantingDate: new Date().toISOString().split("T")[0],
      plannedHarvestingDate: new Date().toISOString().split("T")[0],
    };
    plantingManagerField({ plant, formDataInitial });
    return formDataInitial;
  };

  const [formData, setFormData] = useState(
    createInitialFormData({
      field: selectedField?._id,
    }),
  );

  useEffect(() => {
    setFormData(
      createInitialFormData({
        field: selectedField?._id,
      }),
    );
  }, [selectedField?._id, crops]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const submitData = utils.plans.prepareSubmitPlan({
      ...formData,
      field: selectedField?._id || formData.field,
    });

    if (!submitData) return;

    if (utils.objects.checkEmpty(submitData)) {
      return;
    }

    try {
      dispatch(setLoading(true));
      const endpoint = `/cultivation/${plant ? "plant" : "harvest"}/plan`;
      const res = await api.post(endpoint, {
        ...submitData,
      });

      const resultPlan =
        res.data[`new${plant ? "Planting" : "Harvesting"}Plan`];

      alert(`Plan ${plant ? "sadnje" : "berbe"} uspješno kreiran!`);
      if (plant) {
        dispatch(createPlantingPlan(resultPlan));
      } else {
        dispatch(createHarvestingPlan(resultPlan));
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.error(
        `Error creating ${plant ? "planting" : "harvesting"} plan:`,
        error,
      );
      handleError({
        ...error,
        generalMessage: `Greška prilikom ${isEdit ? "ažuriranja" : "kreiranja"} plana ${plant ? "sadnje" : "berbe"}`,
      });
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <div className="text-lg font-semibold">
              Plan {plant ? "sadnje" : "berbe"}
            </div>
            <div className="text-sm text-gray-600">
              {selectedField?.name
                ? `Odabrano polje: ${selectedField.name}`
                : `Popunite podatke plana ${plant ? "sadnje" : "berbe"}.`}
            </div>
          </div>
          <div>
            <AppInput
              label={`Naziv plana ${plant ? "sadnje" : "berbe"}`}
              name="name"
              onChange={handleFormChange}
              placeholder={`Unesite naziv plana ${plant ? "sadnje" : "berbe"}`}
              value={formData.name}
            />
          </div>

          <ChooseCropVarietyItems
            crops={crops}
            cropsData={formData}
            setCropsData={setFormData}
            additionalItemFields={[QuantityInput]}
          />
          <div className="btn self-start submitButton" onClick={handleSubmit}>
            Spremi plan {plant ? "sadnje" : "berbe"}
          </div>
        </div>
      </div>
    </>
  );
};

export const QuantityInput = ({ index, item, handleItemChange }) => (
  <AppInput
    label="Količina"
    type="number"
    name="quantity"
    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
    value={item.quantity}
  />
);

const plantingManagerField = ({ plant, formDataInitial }) => {
  if (plant) {
    delete formDataInitial.productionManager;
    delete formDataInitial.plannedHarvestingDate;
  } else {
    delete formDataInitial.plannedPlantingDate;
  }
};
