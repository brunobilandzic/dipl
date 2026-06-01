"use client";

import { useEffect, useState } from "react";
import { AppInput } from "../form/inputs";
import { useSelector } from "react-redux";
import { procurments } from "@/seed/data/procurments";

export const CreateProcurment = () => {
  const managerModelName = useSelector(
    (state) => state.user?.session?.managerModelName,
  );
  const emptyItem = { name: "", quantity: 0, price: 0 };
  const emptyProcurment = {
    name: "",
    description: "",
    items: [emptyItem],
  };
  const [procurmentData, setProcurmentData] = useState(
    testProcurment(managerModelName),
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProcurmentData((prev) => ({ ...prev, [name]: value }));
  };
  const addItem = () => {
    setProcurmentData((prev) => ({
      ...prev,
      items: [...prev.items, emptyItem],
    }));
  };
  const handleItemChange = (index, field, value) => {
    if (field === "quantity" || field === "price") {
      if (isNaN(value)) return;
      if (value === "") value = 0;
      if (value < 0) value = 0;
    }
    setProcurmentData((prev) => {
      const newItems = [...prev.items];
      newItems[index][field] = value;
      return { ...prev, items: newItems };
    });
  };

  return (
    <div>
      <h1>Create Procurment</h1>
      <div className="form">
        <AppInput
          label="Naziv nabavke"
          value={procurmentData.name}
          onChange={handleChange}
          name="name"
        />
        <AppInput
          label="Opis nabavke"
          value={procurmentData.description}
          onChange={handleChange}
          name="description"
        />
        <h2>Stavke nabavke</h2>
        {procurmentData.items?.map((item, index) => (
          <div key={index} className="item">
            <AppInput
              label="Naziv stavke"
              value={item.name}
              onChange={(e) => handleItemChange(index, "name", e.target.value)}
            />
            <AppInput
              label="Količina"
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
            />
            <AppInput
              label="Cijena"
              type="number"
              value={item.price}
              onChange={(e) => handleItemChange(index, "price", e.target.value)}
            />
          </div>
        ))}
        <button onClick={addItem}>Dodaj stavku</button>
      </div>
    </div>
  );
};

const testProcurment = (managerModelName) => ({
  name: `Nabavka for ${managerModelName}`,
  description: `Opis nabavke za ${managerModelName}`,
  items: procurments[managerModelName],
});
