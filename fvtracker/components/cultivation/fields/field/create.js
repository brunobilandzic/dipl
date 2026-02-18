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

export function CreateFieldPageComponent() {
  const { data: session, status } = useSession();
  const managerModelName = useSelector(
    (state) => state.user.session?.managerModelName,
  );
  const [fieldData, setFieldData] = useState({
    name: "",
    length: "",
    width: "",
    location: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "length" || name === "width") {
      if (!utils.formValidation.numberInRange(value, 0, e.target.max)) {
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

  const onSubmit = () => {
    if (utils.objects.checkEmpty(fieldData)) {
      alert("Sva polja su obavezna");
      return;
    }
    if (
      !utils.formValidation.numberInRange(
        fieldData.length,
        cultivationConstants.field.fieldDimensions.MIN_FIELD_DIMENSION,
        cultivationConstants.field.fieldDimensions.MAX_FIELD_DIMENSION,
      )
    ) {
      alert(
        `Dužina mora biti između ${cultivationConstants.field.fieldDimensions.MIN_FIELD_DIMENSION} i ${cultivationConstants.field.fieldDimensions.MAX_FIELD_DIMENSION}`,
      );
      return;
    }
    if (
      !utils.formValidation.numberInRange(
        fieldData.width,
        cultivationConstants.field.fieldDimensions.MIN_FIELD_DIMENSION,
        cultivationConstants.field.fieldDimensions.MAX_FIELD_DIMENSION,
      )
    ) {
      alert(
        `Širina mora biti između ${cultivationConstants.field.fieldDimensions.MIN_FIELD_DIMENSION} i ${cultivationConstants.field.fieldDimensions.MAX_FIELD_DIMENSION}`,
      );
      return;
    }
    try {
      const res = api.post("/cultivation/field", fieldData);
      console.log(res);
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
        <div className={`${styles.footer}`}>
          <div onClick={onSubmit} className="btn submitButton">
            Kreiraj parcelu
          </div>
        </div>
      </div>
    </>
  );
}
