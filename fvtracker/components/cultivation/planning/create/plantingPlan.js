"use client";

import { AppDatePicker, AppInput } from "@/components/form/inputs";
import api from "@/lib/api";
import { setFields } from "@/store/cultivation";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FieldGrid } from "@/components/cultivation/fields/preview/grid";
import utils from "@/lib/utils";
import { FieldStatistics } from "../../fields/general";
import handleError from "@/lib/constants/errors/client/handleError";

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
          <FillPlanInfo selectedField={selectedField} />
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

const SelectField = ({ selectedField, setSelectedField }) => {
  const fields = useSelector((state) => state.cultivation.fields);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("fields in select field component", fields);
    if (fields && fields.length > 0) return;

    (async () => {
      try {
        const res = await api.get("/cultivation/fields");
        if (res.data && res.data.fields) {
          dispatch(setFields(res.data.fields));
        }
      } catch (error) {
        console.log("Error fetching fields:", error);
        const errorMessage =
          error.response?.data?.message || error.message || "Unknown error";
        alert(`Error fetching fields: ${errorMessage}`);
      }
    })();
  }, [fields]);

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

export const FillPlanInfo = ({ selectedField, setSelectedField }) => {
  const crops = useSelector((state) => state.cultivation.crops);
  const {
    generalTypes = [],
    types = [],
    varieties: cropVarieties = [],
  } = crops || {};

  const createInitialFormData = ({ fieldId = selectedField?._id || null }) => ({
    field: fieldId,
    items: [
      {
        generalType: "699f3e94a9d129153ac7617f",
        type: "699f3e94a9d129153ac76180",
        cropVariety: "699f3e94a9d129153ac76181",
        quantity: 100,
      },
    ],
    plannedPlantingDate: new Date().toISOString().split("T")[0],
    plannedHarvestingDate: new Date().toISOString().split("T")[0],
  });

  const [formData, setFormData] = useState(
    createInitialFormData({ fieldId: null }),
  );

  useEffect(() => {
    setFormData(createInitialFormData({ fieldId: selectedField?._id || null }));
  }, [selectedField?._id]);

  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        if (field === "generalType") {
          return {
            ...item,
            generalType: value,
            type: "",
            cropVariety: "",
          };
        }

        if (field === "type") {
          return {
            ...item,
            type: value,
            cropVariety: "",
          };
        }

        return {
          ...item,
          [field]: field === "quantity" ? Number(value) : value,
        };
      }),
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { generalType: "", type: "", cropVariety: "", quantity: 0 },
      ],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = async () => {
    const submitData = utils.plant.prepareSubmitPlan(formData);
    console.log("Submitting planting plan with data:", submitData);
    if (utils.objects.checkEmpty(submitData)) {
      return;
    }
    return;
    try {
      const res = await api.post("/cultivation/planting-plans", {
        ...submitData,
        fieldId: selectedField._id,
      });
      if (res.data && res.data.plantingPlan) {
        alert("Plan sadnje uspješno kreiran!");
      }
      setSelectedField(null);
      setFormData(createInitialFormData());
    } catch (error) {
      console.error("Error creating planting plan:", error);
      handleError({
        ...error,
        generalMessage: "Greška prilikom kreiranja plana sadnje",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <div className="text-lg font-semibold">Plan sadnje</div>
        <div className="text-sm text-gray-600">
          {selectedField?.name
            ? `Odabrano polje: ${selectedField.name}`
            : "Popunite podatke plana sadnje."}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <AppDatePicker
          label="Planirani datum sadnje"
          name="plannedPlantingDate"
          onChange={handleFormChange}
          placeholder="Odaberite datum sadnje"
          value={formData.plannedPlantingDate}
        />
        <AppDatePicker
          label="Planirani datum berbe"
          name="plannedHarvestingDate"
          onChange={handleFormChange}
          placeholder="Odaberite datum berbe"
          value={formData.plannedHarvestingDate}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="text-base font-semibold">Stavke plana</div>
        <button className="btn" onClick={addItem} type="button">
          Dodaj stavku
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {formData.items.map((item, index) => {
          const selectedGeneralType = generalTypes.find(
            (generalType) => generalType._id === item.generalType,
          );
          const availableTypes = selectedGeneralType
            ? types.filter(
                (type) => type.generalTypeName === selectedGeneralType.name,
              )
            : [];

          const selectedType = types.find((type) => type._id === item.type);
          const availableVarieties = selectedType
            ? cropVarieties.filter(
                (cropVariety) => cropVariety.cropTypeName === selectedType.name,
              )
            : [];

          return (
            <div className="rounded-lg border p-4" key={`item-${index}`}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="font-medium">Stavka {index + 1}</div>
                <button
                  className="text-sm text-red-600 disabled:cursor-not-allowed disabled:text-gray-400"
                  disabled={formData.items.length === 1}
                  onClick={() => removeItem(index)}
                  type="button"
                >
                  Ukloni
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="inputRow">
                  <label className="label">Glavna vrsta</label>
                  <select
                    className="inputText"
                    onChange={(event) =>
                      handleItemChange(index, "generalType", event.target.value)
                    }
                    required
                    value={item.generalType}
                  >
                    <option value="">Odaberite glavnu vrstu</option>
                    {generalTypes.map((generalType) => (
                      <option key={generalType._id} value={generalType._id}>
                        {generalType.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="inputRow">
                  <label className="label">Tip biljke</label>
                  <select
                    className="inputText"
                    disabled={!item.generalType}
                    onChange={(event) =>
                      handleItemChange(index, "type", event.target.value)
                    }
                    required
                    value={item.type}
                  >
                    <option value="">Odaberite tip biljke</option>
                    {availableTypes.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="inputRow">
                  <label className="label">Varijanta</label>
                  <select
                    className="inputText"
                    disabled={!item.type}
                    onChange={(event) =>
                      handleItemChange(index, "cropVariety", event.target.value)
                    }
                    required
                    value={item.cropVariety}
                  >
                    <option value="">Odaberite varijantu</option>
                    {availableVarieties.map((cropVariety) => (
                      <option key={cropVariety._id} value={cropVariety._id}>
                        {cropVariety.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="inputRow">
                  <AppInput
                    label="Kolicina"
                    min={0}
                    name={`quantity-${index}`}
                    onChange={(event) =>
                      handleItemChange(index, "quantity", event.target.value)
                    }
                    type="number"
                    value={item.quantity}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="btn self-start" onClick={handleSubmit}>
        Spremi plan
      </div>
    </div>
  );
};
