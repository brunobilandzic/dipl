"use client";

import styles from "@/components/form/form.module.css";
import { AppInput, AppSelect } from "@/components/form/inputs";
import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import managerSectors from "@/lib/constants/users/managerSectors";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";
import { setLoading } from "@/store/loading";
import { addWorker } from "@/store/workers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const CreateWorker = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAdmin = useSelector((state) => state.user?.session?.isAdmin);
  const generalManager = useSelector((state) => state.generalManager?.manager);
  const managerModelName = useSelector(
    (state) => state.user?.session?.managerModelName,
  );
  const adminOrGeneralManager = isAdmin || generalManager;

  let emptyWorkerData, testWorkerData;

  if (adminOrGeneralManager) {
    emptyWorkerData = {
      hourlyRate: "",
      name: "worker",
      surname: "test",
      email: "",
      password: "",
      username: "",
      managerModelName: "",
    };
    testWorkerData = {
      hourlyRate: 12,
      name: "worker",
      surname: "test",
      email: "workertest@gmail.com",
      password: "1",
      username: "workertest",
      managerModelName: CULTIVATION_MANAGER,
    };
  } else {
    emptyWorkerData = {
      hourlyRate: "",
      name: "worker",
      surname: "test",
      email: "wt@mail.com",
      password: "1",
      username: "wt",
      managerModelName: managerModelName,
    };
    testWorkerData = {
      hourlyRate: 12,
      name: "worker",
      surname: "test manager",
      email: "workertestmanager@gmail.com",
      password: "1",
      username: "workertest",
      managerModelName: managerModelName,
    };
  }
  const [workerData, setWorkerData] = useState(testWorkerData);
  const inputs = [
    {
      name: "hourlyRate",
      placeholder: "Satna plaća",
      type: "number",
      label: "Satna plaća",
    },
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

  const onSubmit = async () => {
    console.log("Submitting worker data:", { workerData });

    try {
      dispatch(setLoading(true));
      const res = await api.post("/workers", { workerData });
      alert(`Radnik uspešno kreiran.`, {
        type: "success",
      });
      console.log("Worker created successfully:", res.data.worker);
      dispatch(addWorker(res.data.worker));
      router.push("/radnici");
    } catch (error) {
      console.error("Error creating worker:", error);
      handleError(
        {
          ...error,
          generalMessage: "Greška pri kreiranju radnika",
        },
        router,
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const submitDisabled = () =>
    Object.values(workerData).some((value) => value === "");

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
        {adminOrGeneralManager && (
          <div>
            <AppSelect
              name="managerModelName"
              placeholder="Sektor"
              value={workerData.managerModelName || ""}
              onChange={onChange}
              label="Sektor"
              defaultValue={workerData.managerModelName || ""}
              options={Object.entries(managerSectors).map(([key, value]) => ({
                value: key,
                label: value,
              }))}
            />
          </div>
        )}
      </div>
      <div className={`${styles.footer}       flex justify-center`}>
        <div
          className={`btn submitButton btnLg ${submitDisabled() ? "disabled" : ""}`}
          onClick={submitDisabled() ? undefined : onSubmit}
        >
          Kreiraj radnika
        </div>
      </div>
    </div>
  );
};
