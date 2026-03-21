"use client";

import { AppDatePicker, AppInput } from "@/components/form/inputs";
import api from "@/lib/api";
import { createHarvestPlan, setFields } from "@/store/cultivation";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FieldGrid } from "@/components/cultivation/fields/preview/grid";
import utils from "@/lib/utils";
import { FieldStatistics } from "../../../fields/general";
import handleError from "@/lib/constants/errors/client/handleError";
import { Loading } from "@/components/layout/loading";
import { fieldHasCultivations } from "@/lib/utils/cultivation";

export default function CreateHarvestPlanPageComponent() {
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
          <FillHarvestPlanInfo
            selectedField={selectedField}
            setSelectedField={setSelectedField}
          />
        </div>
      ) : null}
    </>
  );
}

export const CreateHarvestPlanButton = ({}) => {
  return (
    <>
      <Link href={"/plan-berbe/izradi"}>
        <div className="btn">Izradi plan berbe</div>
      </Link>
    </>
  );
};

const SelectField = ({ selectedField, setSelectedField }) => {
  const fields = useSelector((state) => state.cultivation.fields);
  const dispatch = useDispatch();

  useEffect(() => {
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

  if (!fields || fields.length === 0) return <Loading />;

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
            if (!fieldHasCultivations(field)) return;

            return (
              <div
                key={field._id}
                className={`border-2 h-fit w-fit ${selectedField?._id === field._id ? "border-green-500" : "border-gray-300"} rounded-lg p-2 cursor-pointer flex flex-col items-center justify-center`}
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

export const FillHarvestPlanInfo = ({ selectedField, setSelectedField }) => {
  const crops = useSelector((state) => state.cultivation.crops);
  const dispatch = useDispatch();
  const {
    generalTypes = [],
    types = [],
    varieties: cropVarieties = [],
  } = crops || {};

  const createInitialFormData = ({ field = selectedField?._id || null } = {}) => {
    const defaultGeneralType = generalTypes[0]?._id || "";
    const defaultType =
      types.filter((t) => t.generalTypeName === generalTypes[0]?.name)[0]?._id || "";
    const defaultVariety =
      cropVarieties.filter(
        (v) =>
          v.cropTypeName === types.find((t) => t._id === defaultType)?.name,
      )[0]?._id || "";
    return {
      name: `Plan berbe - ${field?.toString() || "Nije odabrano"} - ${new Date().toLocaleTimeString()}`,
      field,
      items: [
        {
          generalType: defaultGeneralType,
          type: defaultType,
          cropVariety: defaultVariety,
          quantity: 100,
        },
      ],
      plannedHarvestingDate: new Date().toISOString().split("T")[0],
    };
  };

  const [formData, setFormData] = useState(createInitialFormData({ field: null }));

  useEffect(() => {
    setFormData(createInitialFormData({ field: selectedField?._id || null }));
  }, [selectedField?._id, crops]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        if (field === "generalType") return { ...item, generalType: value, type: "", cropVariety: "" };
        if (field === "type") return { ...item, type: value, cropVariety: "" };
        return { ...item, [field]: field === "quantity" ? Number(value) : value };
      }),
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { generalType: "", type: "", cropVariety: "", quantity: 0 }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = async () => {
    const submitData = {
      ...formData,
      items: formData.items
        .filter((item) => item.cropVariety)
        .map(({ cropVariety, quantity }) => ({ cropVariety, quantity })),
    };
    if (utils.objects.checkEmpty(submitData)) return;
    try {
      const res = await api.post("/cultivation/harvest/plan", { ...submitData });
      if (res.data && res.data.newHarvestPlan) {
        alert("Plan berbe uspješno kreiran!");
      }
      console.log("Created harvest plan:", res.data.newHarvestPlan);
      dispatch(createHarvestPlan(res.data.newHarvestPlan));
      setSelectedField(null);
      setFormData(createInitialFormData({}));
    } catch (error) {
      console.error("Error creating harvest plan:", error);
      handleError({ ...error, generalMessage: "Greška prilikom kreiranja plana berbe" });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-lg font-semibold">Plan berbe</div>
        <div className="text-sm text-gray-600">
          {selectedField?.name
            ? `Odabrano polje: ${selectedField.name}`
            : "Popunite podatke plana berbe."}
        </div>
      </div>
      <div>
        <AppInput
          label="Naziv plana berbe"
          name="name"
          onChange={handleFormChange}
          placeholder="Unesite naziv plana berbe"
          value={formData.name}
        />
      </div>
      <div>
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
          const selectedGeneralType = generalTypes.find((gt) => gt._id === item.generalType);
          const availableTypes = selectedGeneralType
            ? types.filter((t) => t.generalTypeName === selectedGeneralType.name)
            : [];
          const selectedType = types.find((t) => t._id === item.type);
          const availableVarieties = selectedType
            ? cropVarieties.filter((cv) => cv.cropTypeName === selectedType.name)
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
                    onChange={(e) => handleItemChange(index, "generalType", e.target.value)}
                    required
                    value={item.generalType}
                  >
                    <option value="">Odaberite glavnu vrstu</option>
                    {generalTypes.map((gt) => (
                      <option key={gt._id} value={gt._id}>{gt.name}</option>
                    ))}
                  </select>
                </div>

                <div className="inputRow">
                  <label className="label">Tip biljke</label>
                  <select
                    className="inputText"
                    disabled={!item.generalType}
                    onChange={(e) => handleItemChange(index, "type", e.target.value)}
                    required
                    value={item.type}
                  >
                    <option value="">Odaberite tip biljke</option>
                    {availableTypes.map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="inputRow">
                  <label className="label">Varijanta</label>
                  <select
                    className="inputText"
                    disabled={!item.type}
                    onChange={(e) => handleItemChange(index, "cropVariety", e.target.value)}
                    required
                    value={item.cropVariety}
                  >
                    <option value="">Odaberite varijantu</option>
                    {availableVarieties.map((cv) => (
                      <option key={cv._id} value={cv._id}>{cv.name}</option>
                    ))}
                  </select>
                </div>

                <div className="inputRow">
                  <AppInput
                    label="Planirana količina"
                    min={0}
                    name={`quantity-${index}`}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
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
