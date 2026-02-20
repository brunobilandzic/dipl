import React, { useEffect, useState } from "react";
import Modals from "@/components/layout/modals";
import { AppInput } from "@/components/form/inputs";

export const EditCA = ({
  selectedCultivationArea,
  setSelectedCultivationArea,
}) => {
  useEffect(() => {
    console.log("selectedCultivationArea in editCA", selectedCultivationArea);
  }, [selectedCultivationArea]);

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (selectedCultivationArea) {
      setFormData({
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

  const onSubmit = () => {
    console.log("Submitting form data:", formData);
    setSelectedCultivationArea(null);
  };

  return (
    <>
      {selectedCultivationArea ? (
        <Modals.FormModal
          onCancel={() => setSelectedCultivationArea(null)}
          isOpen={!!selectedCultivationArea}
          title="Edit Cultivation Area"
          onClose={() => setSelectedCultivationArea(null)}
          onSubmit={onSubmit}
        >
          <div className="form">
            <div className="">
              <AppInput
                label="Ime"
                name="name"
                value={formData?.name || ""}
                onChange={onChange}
              />
            </div>
            <div className="">
              <AppInput
                label="Opis"
                name="description"
                value={formData?.description || ""}
                onChange={onChange}
              />
            </div>
            <div className="flex gap-4">
              <AppInput
                label="Širina (m)"
                name="width"
                value={formData?.dimensions.width}
                onChange={onChange}
              />
              <AppInput
                label="Dužina (m)"
                name="length"
                value={formData?.dimensions.length}
                onChange={onChange}
              />
            </div>
          </div>
        </Modals.FormModal>
      ) : null}
    </>
  );
};
