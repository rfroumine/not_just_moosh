import type { CalendarEntryWithFood } from '../../lib/types';
import { CATEGORIES } from '../../lib/types';
import { CATEGORY_COLORS, getFoodEmoji } from '../../lib/constants';
import { useUIStore } from '../../stores/uiStore';

interface EntryCardProps {
  entry: CalendarEntryWithFood;
}

export function EntryCard({ entry }: EntryCardProps) {
  const { openDeleteConfirmation, openEditEntryModal } = useUIStore();
  const categoryInfo = CATEGORIES[entry.food.category as keyof typeof CATEGORIES];
  const colors = CATEGORY_COLORS[entry.food.category as keyof typeof CATEGORY_COLORS];
  const foodEmoji = entry.food.emoji || getFoodEmoji(entry.food.name, categoryInfo.icon);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEditEntryModal(entry.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDeleteConfirmation('entry', entry.id, entry.food.name);
  };

  return (
    <div className={`p-3 rounded-xl ${colors.bgLight}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{foodEmoji}</span>
          <div>
            <p className={`font-medium ${colors.text}`}>{entry.food.name}</p>
            <p className="text-xs text-gray-500 capitalize">{entry.texture}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleEdit}
            className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
            aria-label="Edit entry"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete entry"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {entry.notes && (
        <p className="text-sm text-gray-600 mt-2">{entry.notes}</p>
      )}

      {entry.reaction && (
        <div className="mt-2 text-sm">
          <span className="text-gray-500">Reaction: </span>
          <span className="text-gray-700">{entry.reaction}</span>
        </div>
      )}
    </div>
  );
}
