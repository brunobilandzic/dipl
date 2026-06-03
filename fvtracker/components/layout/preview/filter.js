import { AppInput, AppSelect } from "@/components/form/inputs";
import { v4 as uuid } from "uuid";
import { ListHeaderShowButton } from "./listActions";
import {
  PROCURMENT_APPROVED,
  PROCURMENT_REJECTED,
} from "@/lib/constants/documents/procurments";
import {
  CULTIVATION_MANAGER,
  FINANCIAL_MANAGER,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";

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
                  key={index}
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
                  key={index}
                  placeholder={option.placeholder}
                  value={option.value}
                  onChange={(e) => {
                    onChange(index, e.target.value);
                  }}
                />
              );
            case "customerSearch":
              return (
                <AppInput
                  key={index}
                  placeholder={option.placeholder}
                  value={option.value}
                  onChange={(e) => {
                    onChange(index, e.target.value);
                  }}
                />
              );
            case "workerNameSearch":
              return (
                <AppInput
                  key={index}
                  placeholder={option.placeholder}
                  value={option.value}
                  label="Pretraži radnike"
                  onChange={(e) => {
                    onChange(index, e.target.value);
                  }}
                />
              );
            case "procurmentStatus":
              return (
                <AppSelect
                  key={index}
                  placeholder={option.placeholder}
                  value={option.value}
                  onChange={(e) => {
                    onChange(index, e.target.value);
                  }}
                  label="Status nabave"
                  options={[
                    { value: "all", label: "Svi" },
                    { value: PROCURMENT_APPROVED, label: "Odobreni" },
                    { value: PROCURMENT_REJECTED, label: "Odbijeni" },
                  ]}
                />
              );
            case "workerType":
              return (
                <AppSelect
                  key={index}
                  placeholder={option.placeholder}
                  value={option.value}
                  onChange={(e) => {
                    onChange(index, e.target.value);
                  }}
                  label="Sektor radnika"
                  options={[
                    { value: "all", label: "Svi" },
                    { value: CULTIVATION_MANAGER, label: "Uzgoj" },
                    {
                      value: PRODUCTION_MANAGER,
                      label: "Proizvodnja",
                    },
                    { value: WAREHOUSE_MANAGER, label: "Skladište" },
                    { value: FINANCIAL_MANAGER, label: "Financije" },
                  ]}
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

export const FiltersOpenButton = ({
  filterOpen,
  setFilterOpen,
  clearFilters,
}) => {
  return (
    <ListHeaderShowButton
      label="Filtriraj"
      isOpen={filterOpen}
      setOpen={setFilterOpen}
      onClose={clearFilters}
    />
  );
};
