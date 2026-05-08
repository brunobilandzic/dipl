import { FormModal } from "@/components/layout/modals/form";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AppInput, AppTextArea } from "@/components/form/inputs";
import { submitWarehouseForm } from "@/lib/utils/storage/warehouse";
import React, { useState } from "react";

export function EditWarehouseModal({ warehouse, onCancel, isOpen }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [form, setForm] = useState({
    name: warehouse?.name || "",
    description: warehouse?.description ?? "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    await submitWarehouseForm({
      form,
      warehouseId: warehouse._id,
      dispatch,
      router,
    });
    onCancel();
  };

  return (
    <UpdateModal
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      title="Uredi skladište"
      submitText="Spremi"
      submitDisabled={!form.name.trim()}
    >
      <AppInput
        label="Naziv"
        name="name"
        value={form.name}
        onChange={handleChange}
      />
      <AppTextArea
        label="Opis"
        name="description"
        value={form.description}
        onChange={handleChange}
      />
    </UpdateModal>
  );
}
