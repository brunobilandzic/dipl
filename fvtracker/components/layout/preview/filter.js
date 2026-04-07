import { AppInput } from "@/components/form/inputs";
import { v4 as uuid } from "uuid";

export const Filter = ({ filters, setFilters, onApply }) => {
  const onChange = (index, value) => {
    setFilters((prev) => {
      return prev.map((o, i) => {
        if (i === index) {
          return { ...o, value };
        }
        return o;
      });
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {filters.map((option, index) => {
          switch (option.type) {
            case "nameSearch":
              return (
                <AppInput
                  key={uuid()}
                  placeholder={option.placeholder}
                  value={option.value}
                  onChange={(e) => {
                    onChange(index, e.target.value);
                  }}
                />
              );
            case "cropVarietySearch":
              return (
                <AppInput
                  key={uuid()}
                  placeholder={option.placeholder}
                  value={option.value}
                  onChange={(e) => {
                    onChange(index, e.target.value);
                  }}
                />
              );
          }
        })}

        {/*         <div className="btn btnSm" onClick={onApply}>
          Primjeni
        </div> */}
      </div>
    </>
  );
};
