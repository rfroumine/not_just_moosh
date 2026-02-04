import { useUIStore } from '../../stores/uiStore';
import { useDeleteFood } from '../../queries/useFoods';
import { useDeleteCalendarEntry } from '../../queries/useCalendarEntries';
import { useQueryClient } from '@tanstack/react-query';
import { CHECKLIST_QUERY_KEY } from '../../queries/useChecklist';

export function ConfirmDelete() {
  const { deleteConfirmation, closeDeleteConfirmation, closeEditFoodModal } = useUIStore();
  const deleteFood = useDeleteFood();
  const deleteEntry = useDeleteCalendarEntry();
  const queryClient = useQueryClient();

  const { type, id, name } = deleteConfirmation;

  const handleConfirm = async () => {
    if (!id) return;

    try {
      if (type === 'food') {
        await deleteFood.mutateAsync(id);
        closeEditFoodModal();
      } else if (type === 'entry') {
        await deleteEntry.mutateAsync(id);
      }
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEY });
      closeDeleteConfirmation();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const isLoading = deleteFood.isPending || deleteEntry.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeDeleteConfirmation}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-sm rounded-2xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete {type === 'food' ? 'Food' : 'Entry'}?
          </h3>
          <p className="text-gray-600 mb-6">
            {type === 'food'
              ? `This will remove "${name}" from your checklist and all related entries.`
              : `This will remove the entry for "${name}".`}
          </p>

          <div className="flex gap-3">
            <button
              onClick={closeDeleteConfirmation}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-red-400 transition-colors"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
