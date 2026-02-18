"use client";

import { AppInput, AppTextArea } from "@/components/form/inputs";
import cultivationConstants from "@/lib/constants/cultivation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "@/components/form/form.module.css";
import utils from "@/lib/utils";

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

  useEffect(() => {
    console.log("Field data:", fieldData);
  }, [fieldData]);

  return (
    <>
      <div className="form">
        {cultivationConstants.field?.formInputs.map((input) => {
          let returnValue = null;
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
        <div className={`${styles.footer}`}></div>
      </div>
    </>
  );
}
