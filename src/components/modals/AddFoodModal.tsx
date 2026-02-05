import { useState, useMemo, useRef } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useAuth } from '../../hooks/useAuth';
import { useFoods, useAddFood } from '../../queries/useFoods';
import { useQueryClient } from '@tanstack/react-query';
import { CHECKLIST_QUERY_KEY } from '../../queries/useChecklist';
import { CATEGORIES, CATEGORY_ORDER } from '../../lib/types';
import type { Category } from '../../lib/types';

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

export function AddFoodModal() {
  const { user } = useAuth();
  const { closeAddFoodModal } = useUIStore();
  const { data: foods } = useFoods();
  const addFood = useAddFood();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('vegetables');
  const [emoji, setEmoji] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [error, setError] = useState('');
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  // Check for duplicate (case insensitive)
  const isDuplicate = useMemo(() => {
    if (!name.trim() || !foods) return false;
    return foods.some(
      (f) => f.name.toLowerCase() === name.trim().toLowerCase()
    );
  }, [name, foods]);

  // Get the default emoji for current category
  const defaultEmoji = CATEGORIES[category].icon;
  const displayEmoji = emoji || defaultEmoji;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !name.trim()) return;

    if (isDuplicate) {
      setError('Food already exists');
      return;
    }

    try {
      await addFood.mutateAsync({
        form: {
          name: capitalizeName(name),
          category,
          is_allergen: category === 'allergens',
          emoji: emoji || undefined,
        },
        userId: user.id,
      });
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEY });
      closeAddFoodModal();
    } catch (err) {
      console.error('Failed to add food:', err);
      setError('Failed to add food');
    }
  };

  const handleEmojiSelect = (selectedEmoji: string) => {
    setEmoji(selectedEmoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeAddFoodModal}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-lg font-semibold text-gray-900">Add Food</h2>
          <button
            onClick={closeAddFoodModal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
          {/* Food name with emoji */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Food Name</label>
            <div className="flex gap-2">
              {/* Emoji picker button */}
              <div className="relative">
                <button
                  ref={emojiButtonRef}
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="w-12 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-xl hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  {displayEmoji}
                </button>
                {showEmojiPicker && (
                  <div className="absolute top-full left-0 mt-1 z-10 bg-white rounded-xl shadow-lg border border-gray-200 p-2 w-64">
                    <div className="grid grid-cols-8 gap-1">
                      {EMOJI_OPTIONS.map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => handleEmojiSelect(e)}
                          className={`w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 ${
                            displayEmoji === e ? 'bg-indigo-100' : ''
                          }`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                    {emoji && (
                      <button
                        type="button"
                        onClick={() => {
                          setEmoji('');
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
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="e.g., Avocado"
                className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-colors"
                autoFocus
              />
            </div>
            {(isDuplicate || error) && (
              <p className="mt-1.5 text-sm text-red-600">
                {error || 'Food already exists'}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as Category);
                // Reset custom emoji when category changes (unless user explicitly set one)
                if (!emoji) setEmoji('');
              }}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-colors"
            >
              {CATEGORY_ORDER.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORIES[cat].icon} {CATEGORIES[cat].label}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Footer */}
        <div className="px-5 pb-5 pt-3">
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || isDuplicate || addFood.isPending}
            className="w-full px-4 py-3.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
          >
            {addFood.isPending ? 'Adding...' : 'Add Food'}
          </button>
        </div>
      </div>
    </div>
  );
}
