import { AppInput } from "../form/inputs";

export const CreateProcurment = () => {
  const [procurmentData, setProcurmentData] = useState({
    name: "",
    description: "",
    items: [],
  });
  const emptyItem = { name: "", quantity: 0, price: 0 };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProcurmentData((prev) => ({ ...prev, [name]: value }));
  };
  const addItem = () => {
    setProcurmentData((prev) => ({
      ...prev,
      items: [...prev.items, emptyItem],
    }));
  };
  const handleItemChange = (index, field, value) => {
    setProcurmentData((prev) => {
      const newItems = [...prev.items];
      newItems[index][field] = value;
      return { ...prev, items: newItems };
    });
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
