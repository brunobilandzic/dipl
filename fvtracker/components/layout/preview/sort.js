import { AppSelect } from "@/components/form/inputs";
import { ListHeaderShowButton } from "./listActions";

export const Sort = ({
  sortBy,
  setSortBy,
  sortOptions = defaultSortOptions,
}) => {
  return (
    <div className="flex items-center gap-2">
      <AppSelect
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        options={sortOptions}
        label="Sortiraj po"
      />
    </div>
  );
};

const defaultSortOptions = [
  { value: "fieldNameAsc", label: "Naziv A-Z" },
  { value: "fieldNameDesc", label: "Naziv Z-A" },
  { value: "newest", label: "Najnovije" },
  { value: "oldest", label: "Najstarije" },
];

export const fieldSortOptions = [...defaultSortOptions];

export const productSortOptions = [
  ...defaultSortOptions,
  { value: "priceAsc", label: "Cijena rastuće" },
  { value: "priceDesc", label: "Cijena padajuće" },
];

export const SortOpenButton = ({ isOpen, setOpen, clearSort }) => {
  return (
    <ListHeaderShowButton
      label="Sortiraj"
      setOpen={setOpen}
      isOpen={isOpen}
      onClose={clearSort}
    />
  );
};
