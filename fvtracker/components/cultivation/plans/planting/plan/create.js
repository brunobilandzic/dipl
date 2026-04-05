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
import { refreshFields } from "@/lib/utils/cultivation/fields";
import { setLoading } from "@/store/loading";
import { refreshManagers } from "@/lib/utils/production/managers";
import { useRouter } from "next/navigation";
import { ChooseCropVarietyItems } from "@/components/cultivation/crops/choose";

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

export const SelectField = ({
  selectedField,
  setSelectedField,
  plant = true,
}) => {
  const fields = useSelector((state) => state.cultivation.fields);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("fields in select field component", fields);
    if (fields) return;
    refreshFields({ dispatch });
  }, [fields]);

  if (!fields) {
    console.log("Fields not loaded yet, showing loading state");
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

export const FillPlanInfo = ({ selectedField, plant = true, itemsName }) => {
  const crops = useSelector((state) => state.cultivation.crops);
  const {
    generalTypes = [],
    types = [],
    varieties: cropVarieties = [],
  } = crops || {};
  const dispatch = useDispatch();
  const createInitialFormData = ({ field = selectedField?._id } = {}) => {
    const defaultGeneralType = generalTypes[0]?._id || "";
    const defaultType =
      types.filter((t) => t.generalTypeName === generalTypes[0]?.name)[0]
        ?._id || "";
    const defaultVariety =
      cropVarieties.filter(
        (v) =>
          v.cropTypeName === types.find((t) => t._id === defaultType)?.name,
      )[0]?._id || "";
    const formDataInitial = {
      name: `Plan ${plant ? "sadnje" : "berbe"} - ${new Date().toLocaleString()}`,
      productionManager: "",
      field,
      [itemsName]: [
        {
          generalType: defaultGeneralType,
          type: defaultType,
          cropVariety: defaultVariety,
          quantity: 100,
        },
      ],
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
  }, [selectedField?._id, , crops]);

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

  const handleSubmit = async () => {
    const submitData = utils.plans.prepareSubmitPlan({
      ...formData,
      field: selectedField?._id || formData.field,
    });

    console.log(
      `Submitting new ${plant ? "planting" : "harvesting"} plan with data:`,
      submitData,
    );

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

      console.log(
        `Result ${plant ? "planting" : "harvesting"} plan:`,
        resultPlan,
      );
      if (plant) {
        dispatch(createPlantingPlan(resultPlan));
      } else {
        dispatch(createHarvestingPlan(resultPlan));
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.error(
        `Error ${isEdit ? "updating" : "creating"} ${plant ? "planting" : "harvesting"} plan:`,
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
          <div className="grid gap-4 md:grid-cols-2">
            <AppDatePicker
              label="Planirani datum berbe"
              name="plannedHarvestingDate"
              onChange={handleFormChange}
              placeholder="Odaberite datum berbe"
              value={formData.plannedHarvestingDate}
            />
          </div>

          <ChooseCropVarietyItems
            crops={crops}
            cropsData={formData}
            setCropsData={setFormData}
          />
          {!plant && (
            <div className="mt-4">
              <SelectProductionManager
                setFormData={setFormData}
                selectedProductionManager={formData.productionManager}
              />
            </div>
          )}

          <div className="btn self-start" onClick={handleSubmit}>
            Spremi plan {plant ? "sadnje" : "berbe"}
          </div>
        </div>
      </div>
    </>
  );
};

export const SelectProductionManager = ({
  setFormData,
  selectedProductionManager,
}) => {
  const productionManagers = useSelector((state) => state.products?.managers);
  console.log("Production managers from store:", productionManagers);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (!productionManagers)
      refreshManagers({
        dispatch,
        router,
      });
  }, [productionManagers]);

  if (!productionManagers) return null;

  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">Odaberite voditelja proizvodnje:</label>
      <AppSelect
        options={productionManagers.map((pm) => ({
          value: pm._id,
          label:
            pm.rootManager?.appUser?.name +
            " " +
            pm.rootManager?.appUser?.surname,
        }))}
        value={selectedProductionManager}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            productionManager: e.target.value,
          }))
        }
        placeholder="Odaberite voditelja proizvodnje"
      />
    </div>
  );
};

const plantingManagerField = ({ plant, formDataInitial }) => {
  if (plant) {
    delete formDataInitial.productionManager;
    delete formDataInitial.plannedHarvestingDate;
  } else {
    delete formDataInitial.plannedPlantingDate;
  }
};
