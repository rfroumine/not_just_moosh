import { useEntriesByDate } from '../../queries/useCalendarEntries';
import { useUIStore } from '../../stores/uiStore';
import { EntryCard } from './EntryCard';

interface DayEntriesProps {
  date: string;
}

export function DayEntries({ date }: DayEntriesProps) {
  const { data: entries, isLoading } = useEntriesByDate(date);
  const { openAddEntryModal } = useUIStore();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleAddEntry = () => {
    openAddEntryModal(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h3 className="font-semibold text-gray-900">{formatDate(date)}</h3>
      </div>

      {/* Content */}
      <div className="px-3 pb-3">
        {isLoading ? (
          <div className="space-y-2 p-1">
            {[1, 2].map((i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : entries && entries.length > 0 ? (
          <div className="space-y-2 p-1">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">No entries for this day</p>
        )}

        {/* Add entry button */}
        <button
          onClick={handleAddEntry}
          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Entry
        </button>
      </div>
    </div>
  );
}
