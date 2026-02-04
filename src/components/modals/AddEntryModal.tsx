import { useState, useEffect, useMemo } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useAuth } from '../../hooks/useAuth';
import { useFoods, useAddFood } from '../../queries/useFoods';
import { useAddCalendarEntry } from '../../queries/useCalendarEntries';
import { useQueryClient } from '@tanstack/react-query';
import { CHECKLIST_QUERY_KEY } from '../../queries/useChecklist';
import { TEXTURES, CATEGORIES, CATEGORY_ORDER } from '../../lib/types';
import type { Texture, Category } from '../../lib/types';

export function AddEntryModal() {
  const { user } = useAuth();
  const { addEntryModalDate, addEntryModalFoodId, closeAddEntryModal } = useUIStore();
  const { data: foods } = useFoods();
  const addEntry = useAddCalendarEntry();
  const addFood = useAddFood();
  const queryClient = useQueryClient();

  const [selectedFoodId, setSelectedFoodId] = useState(addEntryModalFoodId || '');
  const [date, setDate] = useState(addEntryModalDate || new Date().toISOString().split('T')[0]);
  const [texture, setTexture] = useState<Texture>('puree');
  const [notes, setNotes] = useState('');
  const [reaction, setReaction] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodCategory, setNewFoodCategory] = useState<Category>('other');
  const [newFoodIsAllergen, setNewFoodIsAllergen] = useState(false);

  // Filter foods by search query
  const filteredFoods = useMemo(() => {
    if (!foods) return [];
    if (!searchQuery) return foods;
    return foods.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [foods, searchQuery]);

  // Pre-select food if provided
  useEffect(() => {
    if (addEntryModalFoodId) {
      setSelectedFoodId(addEntryModalFoodId);
    }
  }, [addEntryModalFoodId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !selectedFoodId) return;

    try {
      await addEntry.mutateAsync({
        form: {
          food_id: selectedFoodId,
          date,
          texture,
          notes,
          reaction,
        },
        userId: user.id,
      });
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEY });
      closeAddEntryModal();
    } catch (error) {
      console.error('Failed to add entry:', error);
    }
  };

  const handleAddNewFood = async () => {
    if (!user?.id || !newFoodName.trim()) return;

    try {
      const newFood = await addFood.mutateAsync({
        form: {
          name: newFoodName.trim(),
          category: newFoodCategory,
          is_allergen: newFoodIsAllergen,
        },
        userId: user.id,
      });
      setSelectedFoodId(newFood.id);
      setIsAddingNew(false);
      setNewFoodName('');
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to add food:', error);
    }
  };

  const selectedFood = foods?.find((f) => f.id === selectedFoodId);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeAddEntryModal}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Add Entry</h2>
          <button
            onClick={closeAddEntryModal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Food selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food</label>

            {isAddingNew ? (
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  placeholder="Food name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  autoFocus
                />
                <select
                  value={newFoodCategory}
                  onChange={(e) => setNewFoodCategory(e.target.value as Category)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  {CATEGORY_ORDER.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORIES[cat].icon} {CATEGORIES[cat].label}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newFoodIsAllergen}
                    onChange={(e) => setNewFoodIsAllergen(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">This is an allergen</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNewFood}
                    disabled={!newFoodName.trim() || addFood.isPending}
                    className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
                  >
                    {addFood.isPending ? 'Adding...' : 'Add Food'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {selectedFood ? (
                  <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>{CATEGORIES[selectedFood.category as keyof typeof CATEGORIES].icon}</span>
                      <span className="font-medium text-indigo-900">{selectedFood.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFoodId('')}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search foods..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                    <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setIsAddingNew(true)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add new food
                      </button>
                      {filteredFoods.map((food) => (
                        <button
                          key={food.id}
                          type="button"
                          onClick={() => setSelectedFoodId(food.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                        >
                          <span>{CATEGORIES[food.category as keyof typeof CATEGORIES].icon}</span>
                          <span className="text-gray-900">{food.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Texture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Texture</label>
            <select
              value={texture}
              onChange={(e) => setTexture(e.target.value as Texture)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none capitalize"
            >
              {TEXTURES.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it go?"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Reaction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reaction (optional)</label>
            <input
              type="text"
              value={reaction}
              onChange={(e) => setReaction(e.target.value)}
              placeholder="Any reactions observed?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={!selectedFoodId || addEntry.isPending}
            className="w-full px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
          >
            {addEntry.isPending ? 'Adding...' : 'Add Entry'}
          </button>
        </div>
      </div>
    </div>
  );
}
