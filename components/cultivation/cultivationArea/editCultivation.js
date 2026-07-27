import { AppInput } from "@/components/form/inputs";
import Modals from "@/components/layout/modals";
import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { checkEmpty } from "@/lib/utils/objects";
import { deleteCultivation, updateCultivation } from "@/store/cultivation";
import { setLoading } from "@/store/loading";
import {  useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export function EditCultivation({ isOpen, onCancel, cultivationData }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [submitDisabled, setSubmitDisabled] = useState(false);
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

  useEffect(() => {
    const { name, description } = formData;
    setSubmitDisabled(checkEmpty({ name, description }, true));
  }, [formData]);

  const onSubmit = async () => {
    try {
      const res = await api.put(`/cultivation`, formData);
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
    if (!confirm("Are you sure you want to delete this cultivation area?")) {
      return;
    }
    try {
      dispatch(setLoading(true));
      await api.delete(`/cultivation?id=${formData._id}`);
      dispatch(deleteCultivation(formData._id));
    } catch (error) {
      handleError({ ...error, generalMessage: "Greška pri brisanju gredice" });
    } finally {
      dispatch(setLoading(false));
      onCancel();
    }
  };

  return (
    <Modals.UpdateModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Uredi kultivaciju"
      onSubmit={onSubmit}
      onDelete={onDelete}
      submitDisabled={submitDisabled}
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
