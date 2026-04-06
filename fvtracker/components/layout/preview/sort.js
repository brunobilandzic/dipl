import { AppSelect } from "@/components/form/inputs";

export const SortList = ({
  sortBy,
  setSortBy,
  sortOptions = defaultSortOptions,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Sortiraj po:</span>
      <AppSelect
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        options={sortOptions}
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
