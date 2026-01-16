"use client";

import "@/components/form/styles.css";
import { useState } from "react";
import { AppTextInput } from "@/components/form/inputs";
import React from "react";

function FillInfoForm() {
  const [info, setInfo] = useState({});
  const onChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };
  return (
    <div className="form">
      <div className="form-head">
        <div className="form-header">FillInfoForm</div>
      </div>
      <div className="form-body">
        <AppTextInput
          name="name"
          value={info.name || ""}
          onChange={onChange}
          placeholder="Unesite ime"
        />
        <AppTextInput
          name="surname"
          value={info.surname || ""}
          onChange={onChange}
          placeholder="Unesite prezime"
        />
      </div>
    </div>
  );
}

export default FillInfoForm;
