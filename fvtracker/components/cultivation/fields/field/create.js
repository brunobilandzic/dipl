"use client";

import { AppInput, AppTextArea } from "@/components/form/inputs";
import cultivationConstants from "@/lib/constants/cultivation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "@/components/form/form.module.css";
import utils from "@/lib/utils";
import api from "@/lib/api";
import { handleApiError } from "@/lib/constants/errors/client/api";
import { Loading } from "@/components/layout/loading";

export function CreateFieldPageComponent() {
  const testFieldData = {
    name: "Test Field",
    description: "This is a test field",
    length: 50,
    width: 50,
    location: {
      longitude: 16.70472,
      latitude: 43.67028,
    },
    cultivationAreaDimensions: {
      min_ca_dim: 10,
      max_ca_dim: 30,
      gap: 2,
    },
  };

  const [fieldData, setFieldData] = useState(testFieldData);

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
    if (name === "length" || name === "width") {
      if (
        !utils.formValidation.numbersInRanges([
          { value, min: 0, max: e.target.max },
        ])
      ) {
        alert(
          `Vrijednost mora biti između ${cultivationConstants.field.fieldDimensions.MIN_FIELD_DIMENSION} i ${e.target.max}`,
        );
        setFieldData((prev) => ({
          ...prev,
          [name]: 0,
        }));
        e.target.value = "";
        return;
      }
    }
    setFieldData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onObjectChange = (objectName) => (e) => {
    const { name, value } = e.target;
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
      value: fieldData.length,
      min: cultivationConstants.field.fieldDimensions.MIN_FIELD_DIMENSION,
      max: cultivationConstants.field.fieldDimensions.MAX_FIELD_DIMENSION,
    },
    {
      value: fieldData.width,
      min: cultivationConstants.field.fieldDimensions.MIN_FIELD_DIMENSION,
      max: cultivationConstants.field.fieldDimensions.MAX_FIELD_DIMENSION,
    },
  ];

  const onSubmit = async () => {
    if (!checkConditions()) return;

    try {
      console.log("Submitting field data:", fieldData);
      const res = await api.post("/cultivation/fields", fieldData);
      console.log("res", res);
    } catch (err) {
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
        {Object.entries(cultivationConstants.field?.locationInputs).map(
          ([key, input]) => (
            <AppInput
              value={fieldData.location[key]}
              key={input.name}
              label={input.label}
              name={input.name}
              type={input.type}
              placeholder={input.placeholder}
              onChange={onObjectChange("location")}
            />
          ),
        )}
        {/* {cultivationConstants.field?.cultivationAreaDimensionInputs.map((input) => (
          <AppInput
            value={fieldData.cultivationAreaDimensions[input.name]}
            key={input.name}
            label={input.label}
            name={input.name}
            type={input.type}
            placeholder={input.placeholder}
            onChange={null}
            min={input.min}
            max={input.max}
          />
        ))} */}
        <div className={`${styles.footer}`}>
          <div onClick={onSubmit} className="btn submitButton">
            Kreiraj parcelu
          </div>
        </div>
      </div>
    </>
  );
}
