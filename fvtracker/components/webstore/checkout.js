import { AppInput } from "../form/inputs";

export const CustomerInfoForm = () => {
  const initialCustomer = {
    name: "a",
    surname: "b",
    email: "c@c",
    address: "d",
  };
  const [customerData, setCustomerData] = useState(initialCustomer);

  const onChange = (e) => {
    setCustomerData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
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
    </div>
  );
};
