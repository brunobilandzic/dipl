"use client";

import styles from "@/components/form/form.module.css";
import { AppInput } from "@/components/form/inputs";
import { useState } from "react";

export const CreateWorker = () => {
  const emptyWorkerData = {
    name: "",
    surname: "",
    email: "",
    password: "",
  };
  const [workerData, setWorkerData] = useState(emptyWorkerData);
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
  ];

  const onChange = (e) => {
    const { name, value } = e.target;
    setWorkerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = () => {
    console.log("Submitting worker data:", workerData);
  };

  return (
    <div className={`form`}>
      <div className={styles.head}>
        <h2 className={styles.heading}>Izradi radnika</h2>
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
                value={workerData[name] || ""}
                onChange={onChange}
                label={input.label}
              />
            </div>
          );
        })}
      </div>
      <div className={`${styles.footer}       flex justify-center`}>
        <div className={`btn submitButton btnLg`} onClick={onSubmit}>
          Kreiraj radnika
        </div>
      </div>
    </div>
  );
};
