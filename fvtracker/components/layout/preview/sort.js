import { AppSelect } from "@/components/form/inputs";

export const SortList = ({ sortBy, setSortBy, sortOptions }) => {
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
