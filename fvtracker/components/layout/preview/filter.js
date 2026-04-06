import { AppInput } from "@/components/form/inputs";
import { v4 as uuid } from "uuid";

export const Filter = ({ options, filterData, setFilterData, onApply }) => {
  return (
    <>
      <div>{JSON.stringify(filterData, null, 2)}</div>
      {options.map((option) => {
        let InputComponent;
        switch (option.type) {
          case "stringContains":
            InputComponent = FieldStringContains;
            break;
          default:
            InputComponent = AppInput;
        }
        return (
          <div key={option.name} className="mb-4">
            <InputComponent
              option={option}
              onChange={(e) => {
                setFilterData({
                  ...filterData,
                  [option.name]: e.target.value,
                });
              }}
            />
          </div>
        );
      })}
    </>
  );
};

export const FieldStringContains = ({ option, onChange }) => {
  return (
    <AppInput
      fieldName={option.field}
      label={option.label}
      name={option.field}
      onChange={onChange}
    />
  );
};
