import { useState } from 'react';

export function SearchBar({ onSearch, availableTags }: {
  onSearch: (query: string, tags: string[]) => void;
  availableTags: string[];
}) {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, selectedTags);
  };
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev: string[]) => 
      prev.includes(tag) 
        ? prev.filter((t: string) => t !== tag)
        : [...prev, tag]
    );
  };
  
  const handleClear = () => {
    setQuery('');
    setSelectedTags([]);
    onSearch('', []);
  };
  
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 flex-wrap">
          <input
            type="search"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Filters {showFilters ? '▲' : '▼'}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryHover transition-colors"
          >
            Search
          </button>
        </div>
      </form>
      
      {showFilters && (
        <div className="mt-4 pt-4 border-t dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Filter by tags</h4>
            {selectedTags.length > 0 && (
              <button
                onClick={handleClear}
                className="text-sm text-slate-500 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag: string) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`
                  px-3 py-1 rounded-full text-sm transition-colors
                  ${selectedTags.includes(tag)
                    ? 'bg-primary text-white'
                    : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}
                `}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
