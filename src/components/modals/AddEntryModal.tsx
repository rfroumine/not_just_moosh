import { useState, useEffect, useMemo } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useAuth } from '../../hooks/useAuth';
import { useFoods, useAddFood } from '../../queries/useFoods';
import { useAddCalendarEntry } from '../../queries/useCalendarEntries';
import { useQueryClient } from '@tanstack/react-query';
import { CHECKLIST_QUERY_KEY } from '../../queries/useChecklist';
import { TEXTURES, CATEGORIES, CATEGORY_ORDER } from '../../lib/types';
import { getFoodEmoji } from '../../lib/constants';
import { getLocalDateString } from '../../lib/dateUtils';
import type { Texture, Category } from '../../lib/types';

// Common food emojis for picker
const EMOJI_OPTIONS = [
  '🥕', '🍎', '🥦', '🍌', '🥚', '🧀', '🍗', '🥛', '🍞', '🥜',
  '🫘', '🥒', '🍠', '🥬', '🥭', '🍇', '🍓', '🥝', '🍑', '🍐',
  '🌽', '🥑', '🫑', '🧆', '🥩', '🍣', '🦐', '🐟', '🌾', '🥣',
  '🍝', '🥞', '🧈', '🥥', '🫒', '🍈', '🍉', '🎃', '🦃', '🍖',
];

const capitalizeName = (name: string): string => {
  return name.trim().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export function AddEntryModal() {
  const { user } = useAuth();
  const { addEntryModalDate, addEntryModalFoodId, closeAddEntryModal } = useUIStore();
  const { data: foods } = useFoods();
  const addEntry = useAddCalendarEntry();
  const addFood = useAddFood();
  const queryClient = useQueryClient();

  const [selectedFoodId, setSelectedFoodId] = useState(addEntryModalFoodId || '');
  const [date, setDate] = useState(addEntryModalDate || getLocalDateString(new Date()));
  const [texture, setTexture] = useState<Texture>('puree');
  const [notes, setNotes] = useState('');
  const [reaction, setReaction] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodCategory, setNewFoodCategory] = useState<Category>('other');
  const [newFoodIsAllergen, setNewFoodIsAllergen] = useState(false);
  const [newFoodEmoji, setNewFoodEmoji] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
          name: capitalizeName(newFoodName),
          category: newFoodCategory,
          is_allergen: newFoodIsAllergen,
          emoji: newFoodEmoji || undefined,
        },
        userId: user.id,
      });
      setSelectedFoodId(newFood.id);
      setIsAddingNew(false);
      setNewFoodName('');
      setNewFoodEmoji('');
      setShowEmojiPicker(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to add food:', error);
    }
  };

  // Get the default emoji for current category
  const defaultNewFoodEmoji = CATEGORIES[newFoodCategory].icon;
  const displayNewFoodEmoji = newFoodEmoji || defaultNewFoodEmoji;

  const selectedFood = foods?.find((f) => f.id === selectedFoodId);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeAddEntryModal}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-lg font-semibold text-gray-900">Add Entry</h2>
          <button
            onClick={closeAddEntryModal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-colors"
            />
          </div>

          {/* Food selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Food</label>

            {isAddingNew ? (
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                {/* Food name with emoji picker */}
                <div className="flex gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-xl hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      {displayNewFoodEmoji}
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute top-full left-0 mt-1 z-20 bg-white rounded-xl shadow-lg border border-gray-200 p-2 w-64">
                        <div className="grid grid-cols-8 gap-1">
                          {EMOJI_OPTIONS.map((e) => (
                            <button
                              key={e}
                              type="button"
                              onClick={() => {
                                setNewFoodEmoji(e);
                                setShowEmojiPicker(false);
                              }}
                              className={`w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 ${
                                displayNewFoodEmoji === e ? 'bg-indigo-100' : ''
                              }`}
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                        {newFoodEmoji && (
                          <button
                            type="button"
                            onClick={() => {
                              setNewFoodEmoji('');
                              setShowEmojiPicker(false);
                            }}
                            className="w-full mt-2 text-xs text-gray-500 hover:text-gray-700"
                          >
                            Reset to default
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={newFoodName}
                    onChange={(e) => setNewFoodName(e.target.value)}
                    placeholder="Food name"
                    className="flex-1 px-4 py-2.5 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    autoFocus
                  />
                </div>
                <select
                  value={newFoodCategory}
                  onChange={(e) => {
                    setNewFoodCategory(e.target.value as Category);
                    if (!newFoodEmoji) setNewFoodEmoji('');
                  }}
                  className="w-full px-4 py-2.5 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
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
                    className="rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">This is an allergen</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNew(false);
                      setNewFoodEmoji('');
                      setShowEmojiPicker(false);
                    }}
                    className="flex-1 px-4 py-2.5 bg-white rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNewFood}
                    disabled={!newFoodName.trim() || addFood.isPending}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
                  >
                    {addFood.isPending ? 'Adding...' : 'Add Food'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {selectedFood ? (
                  <div className="flex items-center justify-between p-3.5 bg-indigo-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span>{getFoodEmoji(selectedFood.name, CATEGORIES[selectedFood.category as keyof typeof CATEGORIES].icon)}</span>
                      <span className="font-medium text-indigo-900">{selectedFood.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFoodId('')}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
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
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-colors"
                    />
                    <div className="mt-2 max-h-48 overflow-y-auto bg-gray-50 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setIsAddingNew(true)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-indigo-600 hover:bg-indigo-50 rounded-t-xl transition-colors"
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
                          className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100 transition-colors text-left"
                        >
                          <span>{getFoodEmoji(food.name, CATEGORIES[food.category as keyof typeof CATEGORIES].icon)}</span>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Texture</label>
            <select
              value={texture}
              onChange={(e) => setTexture(e.target.value as Texture)}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none capitalize transition-colors"
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it go?"
              rows={2}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none resize-none transition-colors"
            />
          </div>

          {/* Reaction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reaction (optional)</label>
            <input
              type="text"
              value={reaction}
              onChange={(e) => setReaction(e.target.value)}
              placeholder="Any reactions observed?"
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-colors"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-5 pb-5 pt-3">
          <button
            onClick={handleSubmit}
            disabled={!selectedFoodId || addEntry.isPending}
            className="w-full px-4 py-3.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
          >
            {addEntry.isPending ? 'Adding...' : 'Add Entry'}
          </button>
        </div>
      </div>
    </div>
  );
}
