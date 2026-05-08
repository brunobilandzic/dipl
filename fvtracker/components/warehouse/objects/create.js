import SubmitButton from "@/components/form";
import { AppInput } from "@/components/form/inputs";
import React, { useState } from "react";

const initialWarehouseForm = {
  name: "",
  description: "",
};

function CreateWarehouse() {
  const [newWarehouse, setNewWarehouse] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewWarehouse((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    console.log("Submitting new warehouse with data:", newWarehouse);
    await submitWarehouseForm({ form: newWarehouse });
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
