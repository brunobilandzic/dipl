import { checkValue } from "@/lib/utils/formValidation";
import { titleCaseLetter } from "@/lib/utils/strings";
import { useEffect } from "react";

export const ChooseCropVarietyItems = ({
  crops,
  cropsData,
  setCropsData,
  itemsName = "items",
  children,
  itemLabel = "stavka",
  emptyItem = { generalType: "", type: "", cropVariety: "", quantity: "" },
  additionalItemFields,
  allowZero = false,
  heading = "Unesi vrste",
  addLabel = "Dodaj stavku",
}) => {
  const {
    generalTypes = [],
    types = [],
    varieties: cropVarieties = [],
  } = crops || {};

  const handleItemChange = (index, field, value) => {
    if (field === "quantity") {
      if (value <= 0) {
        alert("Količina ne može biti negativna.");
        setCropsData((prev) => ({
          ...prev,
          [itemsName]: prev[itemsName].map((item, itemIndex) => {
            if (itemIndex !== index) {
              return item;
            }
            return {
              ...item,
              quantity: "",
            };
          }),
        }));
        return;
      }
    }

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

        if (field === "cropVariety") {
          return {
            ...item,
            cropVariety: value,
          };
        }

        if (field === "quantity") {
          return {
            ...item,
            quantity: value,
          };
        }

        if (field === "quality") {
          return {
            ...item,
            quality: value,
          };
        }
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
        <div className="text-base font-semibold">{heading}</div>
        <button className="btn" onClick={addItem} type="button">
          {addLabel}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {cropsData[itemsName]?.map((item, index) => {
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
                itemLabel={itemLabel}
                allowZero={allowZero}
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
                <SelectCropVariety
                  handleItemChange={handleItemChange}
                  index={index}
                  item={item}
                  availableVarieties={availableVarieties}
                />

                {additionalItemFields &&
                  additionalItemFields.length > 0 &&
                  additionalItemFields.map((FieldComponent, fieldIndex) => (
                    <div key={`additional-field-${fieldIndex}`}>
                      {
                        <FieldComponent
                          item={item}
                          handleItemChange={handleItemChange}
                          index={index}
                        />
                      }
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
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
    ? cropVarieties.filter((cropVariety) => cropVariety.cropType === item.type)
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

function ItemHeader({
  index,
  cropsData,
  itemsName,
  removeItem,
  itemLabel = "stavka",
  allowZero = false,
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="font-medium">
        {titleCaseLetter(itemLabel)} {index + 1}
      </div>
      <button
        className="text-sm text-red-600 disabled:cursor-not-allowed disabled:text-gray-400"
        disabled={cropsData[itemsName].length === 1 && !allowZero}
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

const SelectCropVariety = ({
  handleItemChange,
  index,
  item,
  availableVarieties,
}) => {
  return (
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
  );
};

export const testCropItemData = ({ crops }) => {
  const { defaultGeneralType, defaultType, defaultVariety } =
    initializeCropDefaults();
  return [
    {
      generalType: defaultGeneralType,
      type: defaultType,
      cropVariety: defaultVariety,
      quantity: 100,
    },
  ];

  function initializeCropDefaults() {
    const {
      generalTypes = [],
      types = [],
      varieties: cropVarieties = [],
    } = crops || {};
    const defaultGeneralType = generalTypes[0]?._id || "";
    const defaultType =
      types.filter((t) => t.generalTypeName === generalTypes[0]?.name)[0]
        ?._id || "";
    const defaultVariety =
      cropVarieties.filter(
        (v) =>
          v.cropTypeName === types.find((t) => t._id === defaultType)?.name,
      )[0]?._id || "";
    return { defaultGeneralType, defaultType, defaultVariety };
  }
};
