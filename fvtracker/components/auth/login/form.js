"use client";

import React, { useState } from "react";
import styles from "@/components/form/form.module.css";
import { AppInput } from "@/components/form/inputs";


function LoginForm() {
  const [loginData, setLoginData] = useState({});
  const onChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    console.log("Login data submitted:", loginData);
  };

  return (
    <div className={`${styles.form}`}>
      <div className={styles.head}>
        <h2 className={styles.heading}>Login</h2>
      </div>
      <div className={styles.body}>
        {inputs.map((input, i) => {
          const { name, placeholder, type } = input;
          return (
            <div key={i}>
              <AppInput
                name={name}
                placeholder={placeholder}
                type={type}
                value={loginData[name] || ""}
                onChange={onChange}
              />
            </div>
          );
        })}
      </div>
      <div className={styles.footer}>
        <div
          className={`global-button ${styles.submitButton}`}
          onClick={onSubmit}
        >
          Prijava
        </div>
      </div>
    </div>
  );
}
export default LoginForm;

const inputs = [
  {
    name: "email",
    placeholder: "Email",
    type: "email",
  },
  {
    name: "password",
    placeholder: "Šifra",
    type: "password",
  },
];
