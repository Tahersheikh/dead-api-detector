"use client";

interface Props {
  categories:       string[];
  selectedCategory: string;
  search:           string;
  checking:         boolean;
  onCategoryChange: (c: string) => void;
  onSearchChange:   (s: string) => void;
  onCheckNow:       () => void;
}

export default function FilterBar({
  categories,
  selectedCategory,
  search,
  checking,
  onCategoryChange,
  onSearchChange,
  onCheckNow,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          🔍
        </span>
        <input
          type="search"
          placeholder="Search APIs…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          aria-label="Search APIs by name"
        />
      </div>

      {/* Category select */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="py-2.5 px-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Check Now button */}
      <button
        onClick={onCheckNow}
        disabled={checking}
        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all
          bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-busy={checking}
      >
        {checking ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Checking…
          </>
        ) : (
          <>⚡ Check Now</>
        )}
      </button>
    </div>
  );
}
