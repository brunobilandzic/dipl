export const ChooseCropVariety = ({
  crops,
  cropsData,
  setCropsData,
  itemsName = "items",
  additionalInput,
  emptyItem = { generalType: "", type: "", cropVariety: "", quantity: "" },
}) => {
  const {
    generalTypes = [],
    types = [],
    varieties: cropVarieties = [],
  } = crops || {};

  const handleItemChange = (index, field, value) => {
    setCropsData((prev) => ({
      ...prev,
      [itemsName]: prev[itemsName].map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        if (field === "generalType") {
          return {
            ...item,
            generalType: value,
            type: "",
            cropVariety: "",
          };
        }

        if (field === "type") {
          return {
            ...item,
            type: value,
            cropVariety: "",
          };
        }

        return {
          ...item,
          [field]: field === "quantity" ? Number(value) : value,
        };
      }),
    }));
  };

  const addItem = () => {
    setCropsData((prev) => ({
      ...prev,
      [itemsName]: [...prev[itemsName], { ...emptyItem }],
    }));
  };

  const removeItem = (index) => {
    setCropsData((prev) => {
      const newItems = prev[itemsName].filter(
        (_, itemIndex) => itemIndex !== index,
      );
      return {
        ...prev,
        [itemsName]: newItems,
      };
    });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="text-base font-semibold">Stavke plana</div>
        <button className="btn" onClick={addItem} type="button">
          Dodaj stavku
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {cropsData[itemsName].map((item, index) => {
          const { availableTypes, availableVarieties } = getAvailableOptions({
            generalTypes,
            types,
            cropVarieties,
            item,
          });

          return (
            <div className="rounded-lg border p-4" key={`item-${index}`}>
              <ItemHeader
                index={index}
                cropsData={cropsData}
                itemsName={itemsName}
                removeItem={removeItem}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <SelectGeneralType
                  handleItemChange={handleItemChange}
                  index={index}
                  item={item}
                  generalTypes={generalTypes}
                />
                <SelectCropType
                  handleItemChange={handleItemChange}
                  index={index}
                  item={item}
                  availableTypes={availableTypes}
                />

                <div className="inputRow">
                  <label className="label">Varijanta</label>
                  <select
                    className="inputText"
                    disabled={!item.type}
                    onChange={(event) =>
                      handleItemChange(index, "cropVariety", event.target.value)
                    }
                    required
                    value={item.cropVariety}
                  >
                    <option value="">Odaberite varijantu</option>
                    {availableVarieties.map((cropVariety) => (
                      <option key={cropVariety._id} value={cropVariety._id}>
                        {cropVariety.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="inputRow">
                  <AppInput
                    label="Kolicina"
                    min={0}
                    name={`quantity-${index}`}
                    onChange={(event) =>
                      handleItemChange(index, "quantity", event.target.value)
                    }
                    type="number"
                    value={item.quantity}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {!plant && (
          <div className="mt-4">
            <SelectProductionManager
              setFormData={setFormData}
              selectedProductionManager={formData.productionManager}
            />
          </div>
        )}
      </div>
    </>
  );
};

const getAvailableOptions = ({ generalTypes, types, cropVarieties, item }) => {
  const selectedGeneralType = generalTypes.find(
    (generalType) => generalType._id === item.generalType,
  );
  const availableTypes = selectedGeneralType
    ? types.filter((type) => type.generalType === item.generalType)
    : [];
  const selectedType = availableTypes.find((type) => type._id === item.type);
  const availableVarieties = selectedType
    ? cropVarieties.filter((cropVariety) => cropVariety.type === item.type)
    : [];

  return {
    selectedGeneralType,
    availableTypes,
    selectedType,
    availableVarieties,
  };
};
function SelectGeneralType({ handleItemChange, index, item, generalTypes }) {
  return (
    <div className="inputRow">
      <label className="label">Glavna vrsta</label>
      <select
        className="inputText"
        onChange={(event) =>
          handleItemChange(index, "generalType", event.target.value)
        }
        required
        value={item.generalType}
      >
        <option value="">Odaberite glavnu vrstu</option>
        {generalTypes.map((generalType) => (
          <option key={generalType._id} value={generalType._id}>
            {generalType.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function ItemHeader({ index, cropsData, itemsName, removeItem }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="font-medium">Stavka {index + 1}</div>
      <button
        className="text-sm text-red-600 disabled:cursor-not-allowed disabled:text-gray-400"
        disabled={cropsData[itemsName].length === 1}
        onClick={() => removeItem(index)}
        type="button"
      >
        Ukloni
      </button>
    </div>
  );
}

const SelectCropType = ({ handleItemChange, index, item, availableTypes }) => {
  return (
    <div className="inputRow">
      <label className="label">Tip biljke</label>
      <select
        className="inputText"
        disabled={!item.generalType}
        onChange={(event) =>
          handleItemChange(index, "type", event.target.value)
        }
        required
        value={item.type}
      >
        <option value="">Odaberite tip biljke</option>
        {availableTypes.map((type) => (
          <option key={type._id} value={type._id}>
            {type.name}
          </option>
        ))}
      </select>
    </div>
  );
};
