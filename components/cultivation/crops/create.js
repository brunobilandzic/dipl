"use client";

import SubmitButton from "@/components/form";
import { AppInput, AppSelect, AppTextArea } from "@/components/form/inputs";
import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import {
  addCropType,
  addCropVariety,
  addGeneralType,
  addMainType,
  setCrops,
} from "@/store/cultivation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const COLORS = [
  { value: "slate", label: "Škriljevac" },
  { value: "gray", label: "Siva" },
  { value: "zinc", label: "Cink" },
  { value: "neutral", label: "Neutralna" },
  { value: "stone", label: "Kamena" },
  { value: "red", label: "Crvena" },
  { value: "orange", label: "Narančasta" },
  { value: "amber", label: "Jantarna" },
  { value: "yellow", label: "Žuta" },
  { value: "lime", label: "Limeta" },
  { value: "green", label: "Zelena" },
  { value: "emerald", label: "Smaragdna" },
  { value: "teal", label: "Tirkizna" },
  { value: "cyan", label: "Cijan" },
  { value: "sky", label: "Nebeskoplava" },
  { value: "blue", label: "Plava" },
  { value: "indigo", label: "Indigo" },
  { value: "violet", label: "Ljubičasta" },
  { value: "purple", label: "Purpurna" },
  { value: "fuchsia", label: "Fuksija" },
  { value: "pink", label: "Roza" },
  { value: "rose", label: "Ružičasta" },
];
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const LEVELS = [
  { value: "mainType", label: "Glavna vrsta" },
  { value: "generalType", label: "Generalna vrsta" },
  { value: "cropType", label: "Kultura" },
  { value: "cropVariety", label: "Sorta" },
];

const initialForm = {
  name: "",
  description: "",
  color: "green",
  mainCropType: "",
  generalType: "",
  cropType: "",
  shade: 500,
  quantityPerCell: 1,
  varieties: [{ name: "", shade: 500, quantityPerCell: 1 }],
};

function CreateCrop() {
  const [level, setLevel] = useState("cropType");
  const [form, setForm] = useState(initialForm);
  const crops = useSelector((state) => state.cultivation.crops);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (crops) return;
    api
      .get("/cultivation/plant")
      .then((res) => dispatch(setCrops(res.data)))
      .catch((error) => handleError(error));
  }, [crops, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVarietyChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      varieties: prev.varieties.map((variety, i) =>
        i === index ? { ...variety, [field]: value } : variety,
      ),
    }));
  };

  const addVariety = () => {
    setForm((prev) => ({
      ...prev,
      varieties: [
        ...prev.varieties,
        { name: "", shade: 500, quantityPerCell: 1 },
      ],
    }));
  };

  const removeVariety = (index) => {
    setForm((prev) => ({
      ...prev,
      varieties: prev.varieties.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post("/cultivation/crops", { level, ...form });
      if (level === "mainType") dispatch(addMainType(res.data));
      else if (level === "generalType") dispatch(addGeneralType(res.data));
      else if (level === "cropType") dispatch(addCropType(res.data));
      else dispatch(addCropVariety(res.data));
      setForm(initialForm);
      router.push("/kulture");
    } catch (error) {
      handleError({ ...error, generalMessage: "Greška pri izradi kulture." });
    }
  };

  const mainTypeOptions = (crops?.mainTypes || []).map((mt) => ({
    value: mt._id,
    label: mt.name,
  }));
  const generalTypeOptions = (crops?.generalTypes || []).map((gt) => ({
    value: gt._id,
    label: `${gt.name} (${gt.mainTypeName})`,
  }));
  const cropTypeOptions = (crops?.types || []).map((t) => ({
    value: t._id,
    label: `${t.name} (${t.generalTypeName})`,
  }));

  const submitDisabled = () => {
    if (!form.name) return true;
    if (level === "generalType" && !form.mainCropType) return true;
    if (level === "cropType" && !form.generalType) return true;
    if (level === "cropVariety" && !form.cropType) return true;
    return false;
  };

  return (
    <div>
      <AppSelect
        label="Razina"
        name="level"
        options={LEVELS}
        defaultValue={level}
        onChange={(e) => setLevel(e.target.value)}
        defaultOptionLabel="Odaberite razinu"
      />

      <AppInput
        label={`Naziv ${level === "mainType" ? "glavne vrste" : level === "generalType" ? "generalne vrste" : level === "cropType" ? "kulture" : "sorte"}`}
        name="name"
        value={form.name || ""}
        onChange={handleChange}
      />

      {level === "generalType" && (
        <AppSelect
          label="Glavna vrsta (roditelj)"
          name="mainCropType"
          options={mainTypeOptions}
          defaultValue={form.mainCropType}
          onChange={handleChange}
        />
      )}

      {level === "cropType" && (
        <>
          <AppSelect
            label="Generalna vrsta (roditelj)"
            name="generalType"
            options={generalTypeOptions}
            defaultValue={form.generalType}
            onChange={handleChange}
          />
          <AppSelect
            label="Boja"
            name="color"
            options={COLORS}
            defaultValue={form.color}
            onChange={handleChange}
          />
        </>
      )}

      {level === "cropVariety" && (
        <>
          <AppSelect
            label="Kultura (roditelj)"
            name="cropType"
            options={cropTypeOptions}
            defaultValue={form.cropType}
            onChange={handleChange}
          />
          <AppSelect
            label="Nijansa"
            name="shade"
            options={SHADES.map((s) => ({ value: s, label: String(s) }))}
            defaultValue={form.shade}
            onChange={handleChange}
          />
          <AppInput
            label="Količina po ćeliji"
            name="quantityPerCell"
            type="number"
            value={form.quantityPerCell || ""}
            onChange={handleChange}
          />
        </>
      )}

{/*       {level !== "mainType" && (
        <AppTextArea
          label="Opis"
          name="description"
          value={form.description || ""}
          onChange={handleChange}
        />
      )}
 */}
      {level === "cropType" && (
        <div className="mt-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-base font-semibold">Sorte (opcionalno)</div>
            <button className="btn" onClick={addVariety} type="button">
              Dodaj sortu
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {form.varieties.map((variety, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="font-medium">Sorta {index + 1}</div>
                  <button
                    className="text-sm text-red-600 disabled:cursor-not-allowed disabled:text-gray-400"
                    onClick={() => removeVariety(index)}
                    type="button"
                  >
                    Ukloni
                  </button>
                </div>
                <AppInput
                  label="Naziv sorte"
                  name="name"
                  value={variety.name || ""}
                  onChange={(e) =>
                    handleVarietyChange(index, "name", e.target.value)
                  }
                />
                <AppSelect
                  label="Nijansa"
                  name="shade"
                  options={SHADES.map((s) => ({ value: s, label: String(s) }))}
                  defaultValue={variety.shade}
                  onChange={(e) =>
                    handleVarietyChange(index, "shade", e.target.value)
                  }
                />
                <AppInput
                  label="Količina po ćeliji"
                  name="quantityPerCell"
                  type="number"
                  value={variety.quantityPerCell || ""}
                  onChange={(e) =>
                    handleVarietyChange(
                      index,
                      "quantityPerCell",
                      e.target.value,
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <SubmitButton
        disabled={submitDisabled()}
        label="Izradi"
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default CreateCrop;
