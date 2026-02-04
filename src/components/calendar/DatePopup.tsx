import { useEntriesByDate } from '../../queries/useCalendarEntries';
import { useUIStore } from '../../stores/uiStore';
import { EntryCard } from './EntryCard';

interface DatePopupProps {
  date: string;
  onClose: () => void;
}

export function DatePopup({ date, onClose }: DatePopupProps) {
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-900">{formatDate(date)}</h3>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : entries && entries.length > 0 ? (
          <div className="space-y-2">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No entries for this day</p>
        )}

        {/* Add entry button */}
        <button
          onClick={handleAddEntry}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
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
