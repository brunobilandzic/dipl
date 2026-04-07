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
  { value: "fieldNameAsc", label: "Naziv polja A-Z" },
  { value: "fieldNameDesc", label: "Naziv polja Z-A" },
  { value: "priceAsc", label: "Cijena rastuće" },
  { value: "priceDesc", label: "Cijena padajuće" },
  { value: "newest", label: "Najnovije" },
  { value: "oldest", label: "Najstarije" },
];

export const SortOpenButton = ({ isOpen, setOpen }) => {
  return (
    <ListHeaderShowButton
      label="Sortiraj"
      setOpen={() => setOpen(!isOpen)}
      isOpen={isOpen}
    />
  );
};
