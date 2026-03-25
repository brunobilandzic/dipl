"use client";

import React, { useState, useEffect } from "react";
import styles from "@/components/form/form.module.css";
import { AppInput, AppSelect } from "@/components/form/inputs";
import { signIn } from "next-auth/react";
import {
  CULTIVATION_MANAGER,
  FINANCIAL_MANAGER,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";

function SignUpForm(_signUpData = null) {
  console.log("SignUpForm props", _signUpData);
  const [signUpData, setSignUpData] = useState(testSignUpData);

  useEffect(() => {
    if (Object.keys(_signUpData).length > 0) {
      setSignUpData(_signUpData);
      console.log("SignUpForm useEffect setSignUpData", _signUpData);
    }
  }, [_signUpData]);
  console.log("SignUpForm render", testSignUpData);
  const onChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    signIn("credentials", {
      ...signUpData,
      isSignUp: true,
    });
  };

  return (
    <div className={`form`}>
      <div className={styles.head}>
        <h2 className={styles.heading}>Registracija</h2>
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
                value={signUpData[name] || ""}
                onChange={onChange}
                label={input.label}
              />
            </div>
          );
        })}
        <AppSelect
          name="role"
          label="Uloga"
          options={roleOptions}
          value={signUpData.role || ""}
          onChange={(e) =>
            setSignUpData((prev) => ({ ...prev, role: e.target.value }))
          }
        />
      </div>
      <div className={`${styles.footer}       flex justify-center`}>
        <div className={`btn submitButton btnLg`} onClick={onSubmit}>
          Registracija
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;

const roleOptions = [
  { value: CULTIVATION_MANAGER, label: "Menadžer kultivacije" },
  { value: PRODUCTION_MANAGER, label: "Menadžer proizvodnje" },
  { value: WAREHOUSE_MANAGER, label: "Menadžer skladišta" },
  { value: FINANCIAL_MANAGER, label: "Financijski menadžer" },
];

const inputs = [
  {
    name: "email",
    placeholder: "Email",
    type: "email",
    label: "Email",
  },
  {
    name: "username",
    placeholder: "Korisničko ime",
    type: "text",
    label: "Korisničko ime",
  },
  {
    name: "name",
    placeholder: "Ime",
    type: "text",
    label: "Ime",
  },
  { name: "surname", placeholder: "Prezime", type: "text", label: "Prezime" },
  {
    name: "password",
    type: "password",
    label: "Lozinka",
  },
  {
    name: "passwordConfirm",
    placeholder: "Potvrdi šifru",
    type: "password",
    label: "Potvrdi lozinku",
  },
];

const testSignUpData = {
  email: "brunobilandzic98@gmail.com",
  username: "brunobilandzic",
  name: "Bruno",
  surname: "Bilandžić",
  password: "test1234",
  passwordConfirm: "test1234",
};
