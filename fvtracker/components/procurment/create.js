import { AppInput } from "../form/inputs";

export const CreateProcurment = () => {
  const [procurmentData, setProcurmentData] = useState({
    name: "",
    description: "",
    items: [],
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProcurmentData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div>
      <h1>Create Procurment</h1>
      <div className="form">
        <AppInput
          label="Naziv nabavke"
          value={procurmentData.name}
          onChange={handleChange}
        />
        <AppInput
          label="Opis nabavke"
          value={procurmentData.description}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
