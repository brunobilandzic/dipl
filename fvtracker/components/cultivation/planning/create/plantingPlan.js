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

const createInitialFormData = () => ({
  cultivation: "",
  items: [{ cropVariety: "", quantity: 0 }],
  plannedPlantingDate: null,
  plannedHarvestingDate: null,
});

export const FillPlanInfo = ({ selectedField, onSubmit = () => {} }) => {
  const [cropVarieties, setCropVarieties] = useState([]);
  const [formData, setFormData] = useState(createInitialFormData);

  useEffect(() => {
    setFormData(createInitialFormData());
  }, [selectedField?._id]);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await api.get("/cultivation/plant");
        if (!ignore && res.data?.varieties) {
          setCropVarieties(res.data.varieties);
        }
      } catch (error) {
        console.log("Error fetching crop varieties:", error);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

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
      items: [...prev.items, { cropVariety: "", quantity: 0 }],
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

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formData,
      items: formData.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity) || 0,
      })),
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
        {formData.items.map((item, index) => (
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

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
              <div className="inputRow">
                <label className="label">Sorta</label>
                <select
                  className="inputText"
                  onChange={(event) =>
                    handleItemChange(index, "cropVariety", event.target.value)
                  }
                  required
                  value={item.cropVariety}
                >
                  <option value="">Odaberite sortu</option>
                  {cropVarieties.map((cropVariety) => (
                    <option key={cropVariety._id} value={cropVariety._id}>
                      {cropVariety.cropTypeName
                        ? `${cropVariety.cropTypeName} - ${cropVariety.name}`
                        : cropVariety.name}
                    </option>
                  ))}
                </select>
              </div>

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
        ))}
      </div>

      <button className="btn self-start" type="submit">
        Spremi plan
      </button>
    </form>
  );
};


  