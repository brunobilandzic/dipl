import { AppSelect } from "@/components/form/inputs";
import { ListHeaderShowButton } from "./listActions";
import { PROCURMENT_APPROVED } from "@/lib/constants/documents/procurments";

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

export const facilitySortOptions = [...defaultSortOptions];

export const productSortOptions = [
  ...defaultSortOptions,
  { value: "priceAsc", label: "Cijena rastuće" },
  { value: "priceDesc", label: "Cijena padajuće" },
];

export const orderSortOptions = [
  { value: "newest", label: "Najnovije" },
  { value: "oldest", label: "Najstarije" },
  { value: "orderPriceAsc", label: "Cijena rastuće" },
  { value: "orderPriceDesc", label: "Cijena padajuće" },
];

export const workerSortOptions = [
  { value: "newest", label: "Najnoviji" },
  { value: "oldest", label: "Najstariji" },
  { value: "payedAsc", label: "Isplaćeno rastuće" },
  { value: "payedDesc", label: "Isplaćeno padajuće" },
  { value: "hourlyRateAsc", label: "Plaća po satu rastuće" },
  { value: "hourlyRateDesc", label: "Plaća po satu padajuće" },
];

export const procurmentSortOptions = [
  ...defaultSortOptions,
  { value: "procValAsc", label: "Vrijednost Rastuća" },
  { value: "procValDesc", label: "Vrijednost Padajuća" },
];

export const cropTypeSortOptions = [...defaultSortOptions];

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
