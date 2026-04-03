export const ChooseCropVariety = ({
  crops,
  cropsData,
  setCropsData,
  itemsName = "items",
  additionalInput,
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
          const selectedGeneralType = generalTypes.find(
            (generalType) => generalType._id === item.generalType,
          );
          const availableTypes = selectedGeneralType
            ? types.filter(
                (type) => type.generalTypeName === selectedGeneralType.name,
              )
            : [];

          const selectedType = types.find((type) => type._id === item.type);
          const availableVarieties = selectedType
            ? cropVarieties.filter(
                (cropVariety) => cropVariety.cropTypeName === selectedType.name,
              )
            : [];

          return (
            <div className="rounded-lg border p-4" key={`item-${index}`}>
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

              <div className="grid gap-4 md:grid-cols-2">
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
