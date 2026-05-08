"use client";

import SubmitButton from "@/components/form";
import { AppInput } from "@/components/form/inputs";
import { submitWarehouseForm } from "@/lib/utils/storage/warehouse";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const initialWarehouseForm = {
  name: "",
  description: "",
};

function CreateWarehouse() {
  const [newWarehouse, setNewWarehouse] = useState({});
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
      <SubmitButton label="Izradi skladište" handleSubmit={handleSubmit} />
    </div>
  );
}

export default CreateWarehouse;
