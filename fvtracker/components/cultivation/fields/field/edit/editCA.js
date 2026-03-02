"use client";

import React, { useEffect, useState } from "react";
import Modals from "@/components/layout/modals";
import { AppInput } from "@/components/form/inputs";
import axios from "axios";
import handleError from "@/lib/constants/errors/client/handleError";
import { deleteCultivationArea } from "@/store/cultivation";
import { useDispatch } from "react-redux";
import { updateCultivationArea } from "@/store/cultivation";
import { initialCAMenuState } from "../index";
import { useRouter } from "next/navigation";

export const EditCA = ({ cultivationAreaMenu, setCultivationAreaMenu }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    console.log(
      "selectedCultivationArea in editCA",
      cultivationAreaMenu?.cultivationArea,
    );
  }, [cultivationAreaMenu]);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (cultivationAreaMenu?.cultivationArea) {
      setFormData({
        id: cultivationAreaMenu.cultivationArea._id,
        name: cultivationAreaMenu.cultivationArea.name || "",
        description: cultivationAreaMenu.cultivationArea.description || "",
        dimensions: cultivationAreaMenu.cultivationArea.dimensions || {
          width: 0,
          length: 0,
        },
      });
    }
  }, [cultivationAreaMenu?.cultivationArea]);

  const onChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    try {
      const res = await axios.put(
        `/api/cultivation/cultivation-area`,
        formData,
      );
      console.log(res);
      alert("Cultivation area updated successfully");
      setCultivationAreaMenu(initialCAMenuState);
      dispatch(updateCultivationArea(res.data.updatedCultivationArea));
    } catch (error) {
      handleError(error);
    }
  };

  const onDelete = async () => {
    if (!confirm("Are you sure you want to delete this cultivation area?")) {
      return;
    }
    try {
      await axios.delete(`/api/cultivation/cultivation-area`, {
        data: { id: formData.id },
      });
      dispatch(deleteCultivationArea(formData.id));
      setCultivationAreaMenu(initialCAMenuState);
    } catch (error) {
      handleError(error);
    }
  };

  const menuOptions = [
    {
      label: "Edit",
      onClick: () =>
        setCultivationAreaMenu((prev) => ({
          ...prev,
          isOpen: true,
          mode: "EDIT",
        })),
      className: "btn w-full bg-blue-500 hover:bg-blue-600 text-white",
    },
    {
      label: "Cultivate",
      onClick: () =>
        router.push(`/upravljanje-poljima/${cultivationAreaMenu?.cultivationArea?.field?.slug}/ca/${cultivationAreaMenu?.cultivationArea?.slug}`),
      className: "btn w-full bg-green-500 hover:bg-green-600 text-white",
    },
    {
      label: "Delete",
      onClick: onDelete,
      className: "btn cancelButton w-full",
    },
  ];

  useEffect(() => {
    console.log("cultivationAreaMenu in EditCA", cultivationAreaMenu);
  }, [cultivationAreaMenu]);

  return (
    <>
      {cultivationAreaMenu?.isOpen ? (
        <Modals.MenuModal
          options={menuOptions}
          title="Cultivation Area Menu"
          onCancel={() => setCultivationAreaMenu(initialCAMenuState)}
          isOpen={cultivationAreaMenu?.isOpen}
        />
      ) : null}
      {cultivationAreaMenu?.mode === "EDIT" ? (
        <Modals.UpdateModal
          onCancel={() => setCultivationAreaMenu(initialCAMenuState)}
          isOpen={cultivationAreaMenu?.isOpen}
          title="Edit Cultivation Area"
          onClose={() => setCultivationAreaMenu(initialCAMenuState)}
          onSubmit={onSubmit}
          onDelete={onDelete}
        >
          <div className="form">
            <div className="">
              <AppInput
                label="Ime"
                name="name"
                value={formData?.name ?? ""}
                onChange={onChange}
              />
            </div>
            <div className="">
              <AppInput
                label="Opis"
                name="description"
                value={formData.description ?? ""}
                onChange={onChange}
              />
            </div>
          </div>
        </Modals.UpdateModal>
      ) : null}
    </>
  );
};
