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
    </div>
  );
}

export default CreateWarehouse;
