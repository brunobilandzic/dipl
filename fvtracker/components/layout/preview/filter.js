import { AppInput, AppSelect } from "@/components/form/inputs";
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
import {
  EMPLOYMENT_STATUS_EMPLOYED,
  EMPLOYMENT_STATUS_PENDING,
  EMPLOYMENT_STATUS_UNEMPLOYED,
} from "@/lib/constants/users/workers";
import { ROLE_STATUSES } from "@/lib/constants/users";

export const Filter = ({ filters, setFilters, cropOptions = {} }) => {
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

  const {
    mainTypeOptions,
    generalTypeOptions,
    cropTypeOptions,
    cropVarietyOptions,
  } = cropOptions;

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
            case "employmentStatus":
              return (
                <AppSelect
                  key={index}
                  placeholder={option.placeholder}
                  value={option.value}
                  onChange={(e) => {
                    onChange(index, e.target.value);
                  }}
                  label="Status zaposlenja"
                  options={[
                    { value: "all", label: "Svi" },
                    { value: EMPLOYMENT_STATUS_EMPLOYED, label: "Zaposleni" },
                    { value: EMPLOYMENT_STATUS_PENDING, label: "Na čekanju" },
                    { value: EMPLOYMENT_STATUS_UNEMPLOYED, label: "Odbijeni" },
                  ]}
                />
              );
            case "roleRequest":
              return (
                <AppSelect
                  key={index}
                  placeholder={option.placeholder}
                  value={option.value}
                  onChange={(e) => {
                    onChange(index, e.target.value);
                  }}
                  label="Status zahtjeva"
                  options={[
                    { value: "all", label: "Svi" },
                    { value: ROLE_STATUSES.PENDING, label: "Na čekanju" },
                    { value: ROLE_STATUSES.APPROVED, label: "Odobreni" },
                    { value: ROLE_STATUSES.REJECTED, label: "Odbijeni" },
                  ]}
                />
              );
            case "emplReqWorkerNameSearch":
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
            case "mainType":
              return (
                <AppSelect
                  key={index}
                  placeholder={option.placeholder}
                  value={option.value}
                  onChange={(e) => {
                    onChange(index, e.target.value);
                  }}
                  label="Glavna vrsta"
                  options={mainTypeOptions}
                />
              );
            case "generalType":
              return (
                <AppSelect
                  key={index}
                  placeholder={option.placeholder}
                  value={option.value}
                  onChange={(e) => {
                    onChange(index, e.target.value);
                  }}
                  label="Opća vrsta"
                  options={generalTypeOptions}
                />
              );
            case "cropType":
              return (
                <AppSelect
                  key={index}
                  placeholder={option.placeholder}
                  value={option.value}
                  onChange={(e) => {
                    onChange(index, e.target.value);
                  }}
                  label="Vrsta kulture"
                  options={cropTypeOptions}
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
