"use client";

import React, { useState, useEffect } from "react";
import styles from "@/components/form/form.module.css";
import { AppInput, AppSelect } from "@/components/form/inputs";
import { signIn, useSession } from "next-auth/react";
import {
  CULTIVATION_MANAGER,
  FINANCIAL_MANAGER,
  GENERAL_MANAGER,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";
import { useRouter } from "next/navigation";
import { Loading, LoadingFullScreen } from "@/components/layout/loading";

function SignUpForm() {
  const { session, status } = useSession();
  const testSignUpData = {
    email: `${new Date().getTime()}@example.com`,
    username: `brunobilandzic${Math.random().toString(16).slice(3, 6)}`,
    name: `Bruno${new Date().getTime()}`,
    surname: "Bilandžić",
    password: "1",
    passwordConfirm: "1",
    requestedRole: null,
  };

  const [signUpData, setSignUpData] = useState(testSignUpData);
  const [error, setError] = useState("");

  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingFullScreen />;
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      ...signUpData,
      isSignUp: true,
      redirect: false,
    });

    if (res?.error) {
      setError(res.code || "Registracija nije uspjela.");
      return;
    }

    // hard navigacija da SessionProvider pročita novi cookie (inače ostaje "unauthenticated")
    window.location.href = "/";
  };

  return (
    <div className={`form`}>
      <div className={styles.head}>
        <h2 className={styles.heading}>Registracija</h2>
      </div>
      <div className={styles.body}>
        {error && (
          <div className="mb-2 rounded bg-red-100 p-2 text-sm text-red-700">
            {error}
          </div>
        )}
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
          name="requestedRole"
          label="Uloga"
          options={roleOptions}
          value={signUpData.requestedRole || ""}
          onChange={(e) =>
            setSignUpData((prev) => ({
              ...prev,
              requestedRole: e.target.value,
            }))
          }
          defaultValue={signUpData.requestedRole || ""}
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
  { value: GENERAL_MANAGER, label: "Generalni menadžer" },
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
