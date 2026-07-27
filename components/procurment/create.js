"use client";

import { useEffect, useState } from "react";
import { AppInput } from "../form/inputs";
import { useSelector, useDispatch } from "react-redux";
import { procurments } from "@/seed/data/procurments";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import handleError from "@/lib/constants/errors/client/handleError";
import { setLoading } from "@/store/loading";
import api from "@/lib/api";
import { addProcurment } from "@/store/procurments";
import { useRouter } from "next/navigation";
import { checkValue } from "@/lib/utils/formValidation";

export const CreateProcurment = () => {
  const managerModelName = useSelector(
    (state) => state.user?.session?.managerModelName,
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const emptyItem = { name: "", quantity: "", price: "" };
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
      const { value: val, error } = checkValue(value);
      if (error) {
        alert(
          `${field === "quantity" ? "Količina" : "Cijena"} mora biti broj veći od nule.`,
        );
      }
      setProcurmentData((prev) => {
        const newItems = [...prev.items];
        newItems[index][field] = val;
        return { ...prev, items: newItems };
      });
    } else {
      setProcurmentData((prev) => {
        const newItems = [...prev.items];
        newItems[index][field] = value;
        return { ...prev, items: newItems };
      });
    }
  };

  const onRemoveItem = (index) => {
    setProcurmentData((prev) => {
      const newItems = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = async () => {
    try {
      const newProcurmentData = prepareProcurnentBody(procurmentData);
      dispatch(setLoading(true));
      const res = await api.post("/procurments", { newProcurmentData });
      dispatch(addProcurment(res.data.procurment));
      alert("Nabavka je uspješno kreirana.");
      router.push("/nabava");
    } catch (error) {
      console.error("Error creating procurment:", error);
      handleError({
        ...error,
        generalMessage:
          "Došlo je do greške prilikom kreiranja nabavke. Molimo pokušajte ponovo.",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const prepareProcurnentBody = (data) => {
    if (!data.name.trim()) {
      return alert("Naziv nabavke je obavezan.");
    }
    if (data.items.length === 0) {
      return alert("Nabavka mora imati barem jednu stavku.");
    }
    for (const item of data.items) {
      if (!item.name.trim()) {
        return alert("Naziv stavke je obavezan.");
      }
      if (item.quantity <= 0) {
        return alert("Količina stavke mora biti veća od nule.");
      }
      if (item.price <= 0) {
        return alert("Cijena stavke mora biti veća od nule.");
      }
    }
    return {
      ...data,
      items: data.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
    };
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Nova nabavka</h1>
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
        <div className="flex items-center justify-between mt-4">
          <h2 className="text-xl font-semibold py-2 mb-4">Stavke nabavke</h2>
          <div onClick={addItem} className="btn btnSm">
            Dodaj stavku
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {procurmentData.items?.map((item, index) => (
            <div key={index} className="item p-4 rounded-lg border-4 relative">
              <div
                onClick={() => onRemoveItem(index)}
                className="absolute top-2 right-2 cursor-pointer text-red-500"
              >
                <MdClose />
              </div>
              <AppInput
                label="Naziv stavke"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
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
                onChange={(e) =>
                  handleItemChange(index, "price", e.target.value)
                }
              />
            </div>
          ))}
        </div>
      </div>
      <div onClick={handleSubmit} className="btn submitButton mt-6">
        Spremi nabavku
      </div>
    </div>
  );
};

const testProcurment = (managerModelName) => ({
  name: `Nabavka for ${managerModelName}`,
  description: `Opis nabavke za ${managerModelName}`,
  items: procurments[managerModelName],
});
