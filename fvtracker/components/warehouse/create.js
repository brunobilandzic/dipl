"use client";

import SubmitButton from "@/components/form";
import { AppInput } from "@/components/form/inputs";
import { submitWarehouseForm } from "@/lib/utils/storage/warehouse";
import { getRandomString } from "@/lib/utils/strings";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const initialWarehouseForm = {
  name: "",
  description: "",
  volume: "",
};

const testWarehouse = {
  name: getRandomString({ beginning: "Skladište", length: 5 }),
  description: "Glavno skladište za elektroničke uređaje",
  volume: "10000",
};

function CreateWarehouse() {
  const [newWarehouse, setNewWarehouse] = useState(testWarehouse);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewWarehouse((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    console.log("Submitting new warehouse with data:", newWarehouse);
    await submitWarehouseForm({ form: newWarehouse, dispatch, router });
    setNewWarehouse(initialWarehouseForm);
  };
  return (
    <div>
      <AppInput
        label="Naziv skladišta"
        name="name"
        value={newWarehouse.name || ""}
        onChange={handleChange}
      />
      <AppInput
        label="Opis skladišta"
        name="description"
        value={newWarehouse.description || ""}
        onChange={handleChange}
      />
      <AppInput
        label="Kapacitet skladišta"
        name="volume"
        value={newWarehouse.volume || ""}
        onChange={handleChange}
      />
      <SubmitButton label="Izradi skladište" handleSubmit={handleSubmit} />
    </div>
  );
}

export default CreateWarehouse;
