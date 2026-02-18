"use client";

import { AppInput } from "@/components/form/inputs";
import cultivationConstants from "@/lib/constants/cultivation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
    setFieldData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const a = ""
  };



  return (
    <>
        <div className="form">
          {cultivationConstants.field?.formInputs.map((input) => (
            <AppInput
              key={input.name}
              label={input.label}
              name={input.name}
              type={input.type}
              placeholder={input.placeholder}
              onChange={onChange}
            />
          ))}
        </div>
    </>
  );
}
