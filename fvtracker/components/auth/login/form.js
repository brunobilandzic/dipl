"use client";

import React, { useState, useEffect } from "react";
import styles from "@/components/form/form.module.css";
import { AppInput } from "@/components/form/inputs";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/layout/loading";

function LoginForm() {
  const { status } = useSession();
  const [loginData, setLoginData] = useState({});
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loading />;
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      login: loginData.login,
      password: loginData.password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.code || "Prijava nije uspjela.");
      return;
    }

    window.location.href = "/";
  };

  return (
    <div className={`form`}>
      <div className={styles.head}>
        <h2 className={styles.heading}>Prijava</h2>
      </div>
      <div className={styles.body}>
        {error && (
          <div className="mb-2 rounded bg-red-100 p-2 text-sm text-red-700">
            {error}
          </div>
        )}
        {inputs.map((input, i) => {
          const { name, placeholder, type, label } = input;
          return (
            <div key={i}>
              <AppInput
                name={name}
                placeholder={placeholder}
                type={type}
                label={label}
                value={loginData[name] || ""}
                onChange={onChange}
              />
            </div>
          );
        })}
      </div>
      <div className={`${styles.footer} flex justify-center`}>
        <div className={`btn submitButton`} onClick={onSubmit}>
          Prijava
        </div>
        <div
          className={`btn btnSecondary`}
          onClick={() => router.push("/signup")}
        >
          Registracija
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

const inputs = [
  {
    name: "login",
    placeholder: "Email ili korisničko ime",
    type: "text",
    label: "Email ili korisničko ime",
  },
  {
    name: "password",
    placeholder: "Lozinka",
    type: "password",
    label: "Lozinka",
  },
];
