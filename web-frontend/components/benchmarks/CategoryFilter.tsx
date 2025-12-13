interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  if (categories.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onCategoryChange("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-primary text-white"
              : "bg-card-bg text-text-secondary hover:bg-card-bg-hover"
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              selectedCategory === category
                ? "bg-primary text-white"
                : "bg-card-bg text-text-secondary hover:bg-card-bg-hover"
            }`}
          >
            {category.replace(/_/g, " ")}
          </button>
        ))}
      </div>
    </div>
  );
}
