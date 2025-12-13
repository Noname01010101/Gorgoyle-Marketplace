import SearchBar from "./SearchBar";
import SortSelect from "./SortSelect";

interface ModelFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOptions: { value: string; label: string }[];
}

export default function ModelFilters({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOptions,
}: ModelFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search models..."
          />
        </div>
        <div className="flex gap-4">
          <SortSelect
            value={sortBy}
            onChange={onSortChange}
            options={sortOptions}
          />
        </div>
      </div>
    </div>
  );
}
