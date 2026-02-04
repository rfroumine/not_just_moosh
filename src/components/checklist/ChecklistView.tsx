import { useEffect, useRef } from 'react';
import { useChecklist } from '../../queries/useChecklist';
import { useUIStore } from '../../stores/uiStore';
import { CategoryCard } from './CategoryCard';

export function ChecklistView() {
  const { groups, isLoading, error } = useChecklist();
  const { checklistScrollPosition, setChecklistScrollPosition, openAddEntryModal } = useUIStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Restore scroll position
  useEffect(() => {
    if (scrollRef.current && checklistScrollPosition > 0) {
      scrollRef.current.scrollTop = checklistScrollPosition;
    }
  }, []);

  // Save scroll position on unmount
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      setChecklistScrollPosition(element.scrollTop);
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, [setChecklistScrollPosition]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load checklist</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-indigo-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-12 bg-gray-100 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No foods in your checklist yet</p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="space-y-4 pb-20">
      {groups.map((group) => (
        <CategoryCard key={group.category} group={group} />
      ))}

      {/* Floating add button */}
      <button
        onClick={() => openAddEntryModal()}
        className="fixed bottom-20 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center z-30"
        aria-label="Add entry"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
}
