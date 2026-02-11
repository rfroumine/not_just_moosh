import { useUIStore } from '../../stores/uiStore';
import { useChecklist } from '../../queries/useChecklist';
import { CATEGORIES } from '../../lib/types';
import type { ChecklistFood } from '../../lib/types';
import { getFoodEmoji } from '../../lib/constants';
import { formatLastGiven } from '../../utils/deriveChecklist';

export function FoodDetailsModal() {
  const { foodDetailsId, closeFoodDetailsModal, openEditFoodModal } = useUIStore();
  const { groups } = useChecklist();

  // Find the food in any category group
  let food: ChecklistFood | undefined;
  for (const group of groups) {
    food = group.foods.find((f) => f.id === foodDetailsId);
    if (food) break;
  }

  if (!food) return null;

  const categoryInfo = CATEGORIES[food.category];
  const foodEmoji = food.emoji || getFoodEmoji(food.name, categoryInfo.icon);
  const { timesGiven, lastGivenDate, needsReminder, nextPlannedDate } = food.foodStatus;

  // Format the next planned date
  const formatPlannedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleEdit = () => {
    closeFoodDetailsModal();
    openEditFoodModal(food.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeFoodDetailsModal}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{foodEmoji}</span>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{food.name}</h2>
              {food.is_allergen && (
                <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                  Allergen ({timesGiven}/3)
                </span>
              )}
            </div>
          </div>
          <button
            onClick={closeFoodDetailsModal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Times given */}
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>
              {timesGiven === 0 ? 'Not given yet' : `Given ${timesGiven} time${timesGiven !== 1 ? 's' : ''}`}
            </span>
          </div>

          {/* Last given */}
          {lastGivenDate && (
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Last given {formatLastGiven(lastGivenDate)}</span>
            </div>
          )}

          {/* Next planned */}
          {nextPlannedDate && (
            <div className="flex items-center gap-3 text-blue-600">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span>Planned for {formatPlannedDate(nextPlannedDate)}</span>
            </div>
          )}

          {/* Needs reminder */}
          {needsReminder && (
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Over 2 weeks have passed since this allergen was last given</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleEdit}
            className="w-full px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Edit Food
          </button>
        </div>
      </div>
    </div>
  );
}
