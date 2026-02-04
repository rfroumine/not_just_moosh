import type { ChecklistFood } from '../../lib/types';
import { CATEGORY_COLORS } from '../../lib/constants';
import { formatLastGiven } from '../../utils/deriveChecklist';
import { useUIStore } from '../../stores/uiStore';
import { useAddManualMark } from '../../queries/useManualMarks';
import { useAuth } from '../../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { CHECKLIST_QUERY_KEY } from '../../queries/useChecklist';

interface FoodCardProps {
  food: ChecklistFood;
}

export function FoodCard({ food }: FoodCardProps) {
  const { user } = useAuth();
  const { openAddEntryModal, openEditFoodModal } = useUIStore();
  const addManualMark = useAddManualMark();
  const queryClient = useQueryClient();
  const colors = CATEGORY_COLORS[food.category];

  const { status, timesGiven, lastGivenDate, hasPlanned, needsReminder } = food.foodStatus;

  const handleTap = () => {
    // Open add entry modal with this food pre-selected
    openAddEntryModal(undefined, food.id);
  };

  const handleQuickMark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id) return;

    try {
      await addManualMark.mutateAsync({ foodId: food.id, userId: user.id });
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEY });
    } catch (error) {
      console.error('Failed to add mark:', error);
    }
  };

  const handleLongPress = () => {
    openEditFoodModal(food.id);
  };

  // Status indicator styles
  const getStatusIndicator = () => {
    switch (status) {
      case 'done':
        return (
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'started':
        return (
          <div className="w-6 h-6 rounded-full border-2 border-yellow-500 bg-yellow-50 flex items-center justify-center">
            <span className="text-xs font-bold text-yellow-600">{timesGiven}</span>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white" />
        );
    }
  };

  return (
    <div
      onClick={handleTap}
      onContextMenu={(e) => {
        e.preventDefault();
        handleLongPress();
      }}
      className={`flex items-center gap-3 p-3 bg-white rounded-lg border ${colors.border} hover:shadow-sm transition-shadow cursor-pointer active:bg-gray-50`}
    >
      {/* Status indicator */}
      <div className="flex-shrink-0">
        {getStatusIndicator()}
      </div>

      {/* Food info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 truncate">
            {food.name}
          </span>
          {food.is_allergen && (
            <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
              {timesGiven}/3
            </span>
          )}
        </div>
        {lastGivenDate && (
          <p className="text-xs text-gray-500 mt-0.5">
            {formatLastGiven(lastGivenDate)}
          </p>
        )}
      </div>

      {/* Icons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {needsReminder && (
          <span className="text-amber-500" title="Give again soon">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        )}
        {hasPlanned && (
          <span className="text-blue-500" title="Planned">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
        )}
        {status !== 'done' && (
          <button
            onClick={handleQuickMark}
            disabled={addManualMark.isPending}
            className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-full transition-colors"
            title="Quick mark as given"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
