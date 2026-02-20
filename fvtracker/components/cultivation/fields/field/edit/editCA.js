"use client"

import React, { useEffect, useState } from "react";
import Modals from "@/components/layout/modals";
import { AppInput } from "@/components/form/inputs";
import axios from "axios";
import handleError from "@/lib/constants/errors/client/handleError";
import { deleteCultivationArea } from "@/store/cultivation";
import { useDispatch } from "react-redux";

export const EditCA = ({
  selectedCultivationArea,
  setSelectedCultivationArea,
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("selectedCultivationArea in editCA", selectedCultivationArea);
  }, [selectedCultivationArea]);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (selectedCultivationArea) {
      setFormData({
        id: selectedCultivationArea.id,
        name: selectedCultivationArea?.name || "",
        description: selectedCultivationArea?.description || "",
        dimensions: selectedCultivationArea?.dimensions || {
          width: selectedCultivationArea?.dimensions?.width || 0,
          length: selectedCultivationArea?.dimensions?.length || 0,
        },
      });
    }
  }, [selectedCultivationArea]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "width" || name === "length") {
      setFormData((prev) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const onSubmit = async () => {
    try {
      const res = await axios.put(
        `/api/cultivation/cultivation-area`,
        formData,
      );
      console.log(res);
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
      setSelectedCultivationArea(null);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      {selectedCultivationArea ? (
        <Modals.UpdateModal
          onCancel={() => setSelectedCultivationArea(null)}
          isOpen={!!selectedCultivationArea}
          title="Edit Cultivation Area"
          onClose={() => setSelectedCultivationArea(null)}
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
            <div className="flex gap-4">
              <AppInput
                label="Širina (m)"
                name="width"
                value={formData.dimensions?.width ?? ""}
                onChange={onChange}
              />
              <AppInput
                label="Dužina (m)"
                name="length"
                value={formData.dimensions?.length ?? ""}
                onChange={onChange}
              />
            </div>
          </div>
        </Modals.UpdateModal>
      ) : null}
    </>
  );
};
