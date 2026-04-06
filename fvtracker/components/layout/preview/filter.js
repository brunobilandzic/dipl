import { AppInput } from "@/components/form/inputs";
import { v4 as uuid } from "uuid";

export const Filter = ({ filters, setFilters, onApply }) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        {filters.map((option, index) => {
          switch (option.type) {
            case "search":
              return (
                <AppInput
                  key={index}
                  value={option.value}
                  onChange={(e) => {
                    setFilters((prev) => {
                      return prev.map((o, i) => {
                        if (i === index) {
                          return { ...o, value: e.target.value };
                        }
                        return o;
                      });
                    });
                  }}
                />
              );
          }
        })}
        <div className="btn btnSm" onClick={onApply}>
          Primjeni
        </div>
      </div>
    </>
  );
};
