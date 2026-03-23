import Modals from "@/components/layout/modals";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppInput } from "@/components/form/inputs";
import axios from "axios";
import handleError from "@/lib/constants/errors/client/handleError";
import { updateCultivation, deleteCultivation } from "@/store/cultivation";
import api from "@/lib/api";

export function EditCultivation({ isOpen, onCancel, cultivationData }) {
  const dispatch = useDispatch();
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
    console.log("Submitting cultivation edit with data:", formData);

    try {
      const res = await api.put(`/cultivation`, formData);
      console.log("Cultivation updated successfully:", res.data);
      dispatch(updateCultivation(res.data.updatedCultivation));
      onCancel();
      alert(
        "Kultivacija je uspješno ažurirana - " +
          res.data.updatedCultivation.name,
      );
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
