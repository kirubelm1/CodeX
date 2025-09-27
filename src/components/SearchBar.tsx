import { Search, Filter, Heart } from 'lucide-react';
import { SearchFilters } from '../types';
import { LANGUAGES } from '../constants/languages';

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableTags: string[];
}

export function SearchBar({ filters, onFiltersChange, availableTags }: SearchBarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search snippets..."
            value={filters.query}
            onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          />
        </div>

        {/* Language Filter */}
        <div className="min-w-0 flex-shrink-0 lg:w-48">
          <select
            value={filters.language}
            onChange={(e) => onFiltersChange({ ...filters, language: e.target.value })}
            className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          >
            <option value="">All Languages</option>
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Favorites Filter */}
        <button
          onClick={() => onFiltersChange({ ...filters, showFavoritesOnly: !filters.showFavoritesOnly })}
          className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-colors ${
            filters.showFavoritesOnly
              ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
              : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Heart className={`w-5 h-5 ${filters.showFavoritesOnly ? 'fill-current' : ''}`} />
          <span className="hidden sm:inline">Favorites</span>
        </button>
      </div>

      {/* Tag Filter */}
      {availableTags.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 10).map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  const newTags = filters.tags.includes(tag)
                    ? filters.tags.filter(t => t !== tag)
                    : [...filters.tags, tag];
                  onFiltersChange({ ...filters, tags: newTags });
                }}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filters.tags.includes(tag)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
