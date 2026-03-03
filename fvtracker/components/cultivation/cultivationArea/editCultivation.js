import Modals from "@/components/layout/modals";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppInput } from "@/components/form/inputs";
import axios from "axios";
import handleError from "@/lib/constants/errors/client/handleError";
import {
  updateCultivationArea,
  deleteCultivationArea,
} from "@/store/cultivation";

export function EditCultivation({ isOpen, onCancel, cultivationData }) {
  const [formData, setFormData] = useState({});
  useEffect(() => {
    if (cultivationData) {
      setFormData(cultivationData);
    }
  }, [cultivationData]);

  const onChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    console.log(
      "Submitting cultivation area edit with data:",
      prepareUpdateData(formData),
    );

    try {
      const res = await axios.put(
        `/api/cultivation/cultivation-area`,
        prepareUpdateData(formData),
      );
      onCancel();
      alert("Cultivation updated successfully  - " + res.data.updatedCultivation.name);
    } catch (error) {
      handleError(error);
    }
  };

  const onDelete = async () => {
    console.log("Deleting cultivation area with id:", formData._id);
    /*     if (!confirm("Are you sure you want to delete this cultivation area?")) {
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
    } */
  };

  return (
    <Modals.UpdateModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Uredi kultivaciju"
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
  );
}

const prepareUpdateData = (formData) => {
  return {
    ...formData,
    cultivationId: formData._id,
  };
};
