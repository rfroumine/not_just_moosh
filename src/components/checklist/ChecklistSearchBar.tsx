import { useUIStore } from '../../stores/uiStore';

export function ChecklistSearchBar() {
  const { checklistSearchQuery, setChecklistSearchQuery, clearChecklistSearch } = useUIStore();

  return (
    <div className="sticky top-[57px] z-30 bg-gray-50 pb-3 -mx-4 px-4 pt-1">
      <div className="relative">
        {/* Search icon */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          value={checklistSearchQuery}
          onChange={(e) => setChecklistSearchQuery(e.target.value)}
          placeholder="Search foods..."
          className="w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
        />

        {/* Clear button */}
        {checklistSearchQuery && (
          <button
            onClick={clearChecklistSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
