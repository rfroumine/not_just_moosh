import { useRef } from 'react';
import type { ChecklistFood } from '../../lib/types';
import { CATEGORIES } from '../../lib/types';
import { CATEGORY_COLORS, getFoodEmoji, ALLERGEN_DONE_THRESHOLD } from '../../lib/constants';
import { formatLastGiven } from '../../utils/deriveChecklist';
import { useUIStore } from '../../stores/uiStore';
import { useAddManualMark, useAddMultipleManualMarks, useRemoveManualMarksForFood, useRemoveAutoCompleteMarksForFood } from '../../queries/useManualMarks';
import { useCalendarEntries } from '../../queries/useCalendarEntries';
import { useAuth } from '../../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { CHECKLIST_QUERY_KEY } from '../../queries/useChecklist';

interface FoodCardProps {
  food: ChecklistFood;
}

export function FoodCard({ food }: FoodCardProps) {
  const { user } = useAuth();
  const { openEditFoodModal, showToast } = useUIStore();
  const addManualMark = useAddManualMark();
  const addMultipleManualMarks = useAddMultipleManualMarks();
  const removeManualMarks = useRemoveManualMarksForFood();
  const removeAutoCompleteMarks = useRemoveAutoCompleteMarksForFood();
  const { data: allEntries } = useCalendarEntries();
  const queryClient = useQueryClient();
  const colors = CATEGORY_COLORS[food.category];
  const categoryInfo = CATEGORIES[food.category];
  const foodEmoji = food.emoji || getFoodEmoji(food.name, categoryInfo.icon);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { timesGiven, lastGivenDate, hasPlanned, needsReminder } = food.foodStatus;

  // Check if this food has any calendar entries
  const foodCalendarEntries = allEntries?.filter((e) => e.food_id === food.id) || [];
  const hasCalendarEntries = foodCalendarEntries.length > 0;

  const handleTick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id) return;

    try {
      // For allergens, auto-complete to 3/3
      if (food.is_allergen) {
        const marksNeeded = ALLERGEN_DONE_THRESHOLD - timesGiven;
        if (marksNeeded > 0) {
          await addMultipleManualMarks.mutateAsync({
            foodId: food.id,
            userId: user.id,
            count: marksNeeded,
            isAutoComplete: true,
          });
        }
      } else {
        await addManualMark.mutateAsync({ foodId: food.id, userId: user.id });
      }
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEY });
    } catch (error) {
      console.error('Failed to add mark:', error);
    }
  };

  const handleUntick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id) return;

    // Check if food has calendar entries
    if (hasCalendarEntries) {
      const dates = foodCalendarEntries
        .map((e) => {
          const date = new Date(e.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        })
        .slice(0, 3);
      const dateList = dates.join(', ');
      const suffix = foodCalendarEntries.length > 3 ? ` and ${foodCalendarEntries.length - 3} more` : '';
      showToast(`Cannot untick. Calendar entries on: ${dateList}${suffix}`, 'error');
      return;
    }

    try {
      // For allergens, only remove auto-complete marks (restore previous state)
      if (food.is_allergen) {
        await removeAutoCompleteMarks.mutateAsync(food.id);
      } else {
        await removeManualMarks.mutateAsync(food.id);
      }
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEY });
    } catch (error) {
      console.error('Failed to remove marks:', error);
    }
  };

  const handleLongPress = () => {
    openEditFoodModal(food.id);
  };

  // Long-press handlers for icon tooltips
  const handleIconTouchStart = (message: string) => {
    longPressTimerRef.current = setTimeout(() => {
      showToast(message, 'info');
    }, 500);
  };

  const handleIconTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleIconContextMenu = (e: React.MouseEvent, message: string) => {
    e.preventDefault();
    e.stopPropagation();
    showToast(message, 'info');
  };

  // Format times given with last date
  const getTimesGivenText = () => {
    if (timesGiven === 0) return null;
    const lastGivenText = lastGivenDate ? formatLastGiven(lastGivenDate) : '';
    return `${timesGiven}x${lastGivenText ? ` · ${lastGivenText}` : ''}`;
  };

  // Determine if ticked (has any marks)
  const isTicked = timesGiven > 0;

  const isPending = addManualMark.isPending || addMultipleManualMarks.isPending || removeManualMarks.isPending || removeAutoCompleteMarks.isPending;

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        handleLongPress();
      }}
      className={`flex items-center gap-3 p-2 bg-white rounded-lg border ${colors.border} hover:shadow-sm transition-shadow cursor-pointer active:bg-gray-50`}
    >
      {/* Tick/Untick button - LEFT side */}
      <button
        onClick={isTicked ? handleUntick : handleTick}
        disabled={isPending}
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
          isTicked
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'border-2 border-gray-300 text-gray-300 hover:border-gray-400 hover:text-gray-400'
        }`}
        title={isTicked ? 'Untick' : 'Mark as given'}
      >
        {isTicked ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : null}
      </button>

      {/* Food info */}
      <div className="flex-1 min-w-0" onClick={handleLongPress}>
        <div className="flex items-center gap-2">
          <span className="text-base">{foodEmoji}</span>
          <span className="font-medium text-gray-900 truncate">
            {food.name}
          </span>
          {food.is_allergen && (
            <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
              {timesGiven}/3
            </span>
          )}
          {!food.is_default && (
            <span className="text-[10px] px-1 py-0.5 bg-purple-100 text-purple-600 rounded">
              custom
            </span>
          )}
        </div>
        {getTimesGivenText() && (
          <p className="text-xs text-gray-500 mt-0.5 ml-6">
            {getTimesGivenText()}
          </p>
        )}
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {needsReminder && (
          <span
            className="text-amber-500"
            title="Give again soon"
            onTouchStart={() => handleIconTouchStart('Give this allergen again soon (14+ days since last)')}
            onTouchEnd={handleIconTouchEnd}
            onContextMenu={(e) => handleIconContextMenu(e, 'Give this allergen again soon (14+ days since last)')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        )}
        {hasPlanned && (
          <span
            className="text-blue-500"
            title="Planned"
            onTouchStart={() => handleIconTouchStart('This food has a future entry planned')}
            onTouchEnd={handleIconTouchEnd}
            onContextMenu={(e) => handleIconContextMenu(e, 'This food has a future entry planned')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
        )}
        {/* Edit button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLongPress();
          }}
          className="text-gray-400 hover:text-gray-600 p-1 -mr-1"
          title="Edit food"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
