import { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useFoods, useUpdateFood } from '../../queries/useFoods';
import { useQueryClient } from '@tanstack/react-query';
import { CHECKLIST_QUERY_KEY } from '../../queries/useChecklist';
import { CATEGORIES, CATEGORY_ORDER } from '../../lib/types';
import type { Category } from '../../lib/types';

export function EditFoodModal() {
  const { editFoodId, closeEditFoodModal, openDeleteConfirmation } = useUIStore();
  const { data: foods } = useFoods();
  const updateFood = useUpdateFood();
  const queryClient = useQueryClient();

  const food = foods?.find((f) => f.id === editFoodId);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [isAllergen, setIsAllergen] = useState(false);

  useEffect(() => {
    if (food) {
      setName(food.name);
      setCategory(food.category as Category);
      setIsAllergen(food.is_allergen);
    }
  }, [food]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFoodId || !name.trim()) return;

    try {
      await updateFood.mutateAsync({
        foodId: editFoodId,
        updates: {
          name: name.trim(),
          category,
          is_allergen: isAllergen,
        },
      });
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEY });
      closeEditFoodModal();
    } catch (error) {
      console.error('Failed to update food:', error);
    }
  };

  const handleDelete = () => {
    if (food) {
      openDeleteConfirmation('food', food.id, food.name);
    }
  };

  if (!food) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeEditFoodModal}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Edit Food</h2>
          <button
            onClick={closeEditFoodModal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              {CATEGORY_ORDER.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORIES[cat].icon} {CATEGORIES[cat].label}
                </option>
              ))}
            </select>
          </div>

          {/* Allergen checkbox */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAllergen}
              onChange={(e) => setIsAllergen(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">This is an allergen (requires 3 introductions)</span>
          </label>

          {/* Default food warning */}
          {food.is_default && (
            <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              This is a default food. You can edit or delete it if needed.
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
          >
            Delete
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || updateFood.isPending}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
          >
            {updateFood.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
