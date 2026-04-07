import { AppInput } from "@/components/form/inputs";
import { v4 as uuid } from "uuid";
import { ListHeaderShowButton } from "./listActions";

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
