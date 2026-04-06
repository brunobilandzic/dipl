import { AppInput } from "@/components/form/inputs";
import { v4 as uuid } from "uuid";

export const Filter = ({}) => {
  return (
    <>
      <div>{JSON.stringify(filterData, null, 2)}</div>
      {options.map((option, index) => {
        let InputComponent;
        switch (option.filter) {
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
                setFilterData((prev) => {
                  return prev.map((o, i) => {
                    if (i === index) {
                      return { ...o, [option.name]: e.target.value };
                    }
                    return o;
                  });
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
