import { AppInput } from "../form/inputs";
import { FormModal } from "../layout/modals/form";

export const CustomerInfoForm = ({
  isOpen,
  onCancel,
  customerData,
  setCustomerData,
  submitOrder,
}) => {
  const onChange = (e) => {
    setCustomerData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <FormModal
      title="Unesite Vaše podatke"
      onSubmit={submitOrder}
      submitText="Nastavi"
      isOpen={isOpen}
      onCancel={onCancel}
    >
      <AppInput
        label="Ime"
        name="name"
        value={customerData.name}
        onChange={onChange}
      />
      <AppInput
        label="Prezime"
        name="surname"
        value={customerData.surname}
        onChange={onChange}
      />
      <AppInput
        label="Email"
        name="email"
        value={customerData.email}
        onChange={onChange}
      />
      <AppInput
        label="Adresa"
        name="address"
        value={customerData.address}
        onChange={onChange}
      />
    </FormModal>
  );
};
