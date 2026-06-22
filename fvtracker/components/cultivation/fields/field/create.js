"use client";

import { AppInput, AppTextArea } from "@/components/form/inputs";
import cultivationConstants from "@/lib/constants/cultivation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "@/components/form/form.module.css";
import utils from "@/lib/utils";
import api from "@/lib/api";
import { handleApiError } from "@/lib/constants/errors/client/api";
import { Loading } from "@/components/layout/loading";
import { selectField, addField } from "@/store/cultivation";
import { useRouter } from "next/navigation";

export function CreateFieldPageComponent() {
  const testFieldData = {
    name: `Test Field ${new Date().getTime()}`,
    description: "This is a test field",
    dimensions: {
      width: 50,
      length: 50,
    },
    cultivationAreaDimensions: {
      min_ca_dim: 1,
      max_ca_dim: 10000,
      gap: 2,
    },
  };

  const [fieldData, setFieldData] = useState(testFieldData);
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const managerModelName = useSelector(
    (state) => state.user.session?.managerModelName,
  );

  if (status === "loading" || !managerModelName || !session) {
    return <Loading />;
  }

  if (managerModelName !== "CultivationManager") {
    throw new Error("Unauthorized");
  }

  const onChange = (e) => {
    const { name, value } = e.target;

    setFieldData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onObjectChange = (objectName) => (e) => {
    const { name, value } = e.target;
    if (
      objectName === "dimensions" ||
      objectName === "cultivationAreaDimensions"
    ) {
      const valid = utils.formValidation.numbersInRanges([
        {
          name: e.target.dataset?.label,
          value,
          min: 0,
          max: e.target.max,
        },
      ]);

      if (!valid.valid) {
        if (value === "" || value === "0" || value === 0) {
          setFieldData((prev) => ({
            ...prev,
            [objectName]: {
              ...prev[objectName],
              [name]: value,
            },
          }));
          return;
        }
        alert(valid.message);
        setFieldData((prev) => ({
          ...prev,
          [objectName]: {
            ...prev[objectName],
            [name]: prev[objectName][name],
          },
        }));
        e.target.value = "";
        return;
      }
    }
    setFieldData((prev) => ({
      ...prev,
      [objectName]: {
        ...prev[objectName],
        [name]: value,
      },
    }));
  };

  const checkConditions = () => {
    if (utils.objects.checkEmpty(fieldData)) {
      alert("Sva polja su obavezna");
      return false;
    }

    if (!utils.formValidation.numbersInRanges(prepareRanges())) {
      alert(
        `Dužina i širina polja moraju biti između ${cultivationConstants.field.fieldDimensions.MIN_FIELD_DIMENSION} i ${cultivationConstants.field.fieldDimensions.MAX_FIELD_DIMENSION}`,
      );
      return false;
    }

    return true;
  };

  const prepareRanges = () => [
    {
      name: "Dužina polja",
      value: fieldData.dimensions.length,
      min: cultivationConstants.field.fieldDimensions.MIN_FIELD_DIMENSION,
      max: cultivationConstants.field.fieldDimensions.MAX_FIELD_DIMENSION,
    },
    {
      name: "Širina polja",
      value: fieldData.dimensions.width,
      min: cultivationConstants.field.fieldDimensions.MIN_FIELD_DIMENSION,
      max: cultivationConstants.field.fieldDimensions.MAX_FIELD_DIMENSION,
    },
    {
      name: "Minimalna dimenzija područja za sadnju",
      value: fieldData.cultivationAreaDimensions.min_ca_dim,
      min: cultivationConstants.field.cultivationAreaDimensions
        .MIN_CA_DIMENSION,
      max: cultivationConstants.field.cultivationAreaDimensions
        .MAX_CA_DIMENSION,
    },
    {
      name: "Maksimalna dimenzija područja za sadnju",
      value: fieldData.cultivationAreaDimensions.max_ca_dim,
      min: cultivationConstants.field.cultivationAreaDimensions
        .MIN_CA_DIMENSION,
      max: cultivationConstants.field.cultivationAreaDimensions
        .MAX_CA_DIMENSION,
    },
    {
      name: "Razmak između područja",
      value: fieldData.cultivationAreaDimensions.gap,
      min: cultivationConstants.field.cultivationAreaDimensions.MIN_GAP,
      max: cultivationConstants.field.cultivationAreaDimensions.MAX_GAP,
    },
  ];

  const onSubmit = async () => {
    if (!checkConditions()) return;

    try {
      const res = await api.post("/cultivation/fields", fieldData);
      alert("Parcela uspješno kreirana");
      dispatch(addField(res.data.field));
      dispatch(selectField(res.data.field));
      router.push(`/upravljanje-poljima/${res.data.field.slug}`);
    } catch (err) {
      console.log(err);
      handleApiError({
        ...err,
        generalMessage: "Greška prilikom kreiranja parcele",
      });
    }
  };

  return (
    <>
      <div className="form">
        {cultivationConstants.field?.formInputs.map((input) => {
          if (input.type === "text" || input.type === "number") {
            return (
              <AppInput
                value={fieldData[input.name]}
                key={input.name}
                label={input.label}
                name={input.name}
                type={input.type}
                placeholder={input.placeholder}
                onChange={onChange}
                min={input.min}
                max={input.max}
              />
            );
          } else if (input.type === "textarea") {
            return (
              <AppTextArea
                value={fieldData[input.name]}
                key={input.name}
                label={input.label}
                name={input.name}
                type={input.type}
                placeholder={input.placeholder}
                onChange={onChange}
              />
            );
          }
        })}

        {Object.entries(cultivationConstants.field?.dimensionsInputs).map(
          ([key, input]) => (
            <AppInput
              value={fieldData.dimensions[key]}
              key={input.name}
              label={input.label}
              name={input.name}
              type={input.type}
              placeholder={input.placeholder}
              onChange={onObjectChange("dimensions")}
              min={input.min}
              max={input.max}
            />
          ),
        )}
        {Object.entries(
          cultivationConstants.field?.cultivationAreaDimensionsInputs,
        ).map(([key, input]) => (
          <AppInput
            value={fieldData.cultivationAreaDimensions[key]}
            key={input.name}
            label={input.label}
            name={input.name}
            type={input.type}
            placeholder={input.placeholder}
            onChange={onObjectChange("cultivationAreaDimensions")}
            min={input.min}
            max={input.max}
          />
        ))}
        <div className={`${styles.footer}`}>
          <div onClick={onSubmit} className="btn submitButton">
            Kreiraj polje
          </div>
        </div>
      </div>
    </>
  );
}
