import Modals from "@/components/layout/modals";
import { useEffect } from "react";

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
