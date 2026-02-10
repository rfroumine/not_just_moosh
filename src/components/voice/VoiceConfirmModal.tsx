import { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useAuth } from '../../hooks/useAuth';
import { useFoods } from '../../queries/useFoods';
import { useAddCalendarEntry } from '../../queries/useCalendarEntries';
import { useQueryClient } from '@tanstack/react-query';
import { CHECKLIST_QUERY_KEY } from '../../queries/useChecklist';
import { TEXTURES, CATEGORIES } from '../../lib/types';
import { getFoodEmoji } from '../../lib/constants';
import type { Texture } from '../../lib/types';

export function VoiceConfirmModal() {
  const { user } = useAuth();
  const { voiceParsedEntry, closeVoiceConfirmModal, openAddEntryModal, showToast } = useUIStore();
  const { data: foods } = useFoods();
  const addEntry = useAddCalendarEntry();
  const queryClient = useQueryClient();

  const [selectedFoodId, setSelectedFoodId] = useState(voiceParsedEntry?.foodId || '');
  const [date, setDate] = useState(voiceParsedEntry?.date || '');
  const [texture, setTexture] = useState<Texture>(voiceParsedEntry?.texture || 'puree');

  // Update state when voiceParsedEntry changes
  useEffect(() => {
    if (voiceParsedEntry) {
      setSelectedFoodId(voiceParsedEntry.foodId || '');
      setDate(voiceParsedEntry.date);
      setTexture(voiceParsedEntry.texture);
    }
  }, [voiceParsedEntry]);

  if (!voiceParsedEntry) return null;

  const selectedFood = foods?.find(f => f.id === selectedFoodId);
  const foodEmoji = selectedFood
    ? (selectedFood.emoji || getFoodEmoji(selectedFood.name, CATEGORIES[selectedFood.category].icon))
    : '🍽️';

  const handleSave = async () => {
    if (!user?.id || !selectedFoodId) {
      showToast('Please select a food', 'error');
      return;
    }

    try {
      await addEntry.mutateAsync({
        form: {
          food_id: selectedFoodId,
          date,
          texture,
          notes: '',
          reaction: '',
        },
        userId: user.id,
      });
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEY });
      showToast('Entry added!', 'success');
      closeVoiceConfirmModal();
    } catch (error) {
      console.error('Failed to add entry:', error);
      showToast('Failed to add entry', 'error');
    }
  };

  const handleEdit = () => {
    closeVoiceConfirmModal();
    openAddEntryModal(date, selectedFoodId || undefined);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeVoiceConfirmModal}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Add Entry</h2>
            <button
              onClick={closeVoiceConfirmModal}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {voiceParsedEntry.confidence !== 'high' && (
            <p className="text-xs text-amber-600 mt-1">
              ⚠️ Please verify the details below
            </p>
          )}
        </div>

        {/* Content */}
        <div className="px-5 pb-4 space-y-4">
          {/* Heard text */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">I heard:</p>
            <p className="text-sm text-gray-700 italic">"{voiceParsedEntry.rawTranscript}"</p>
          </div>

          {/* Food selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Food</label>
            {selectedFood ? (
              <div className="flex items-center p-3 bg-indigo-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{foodEmoji}</span>
                  <span className="font-medium text-indigo-900">{selectedFood.name}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-amber-600">
                  No matching food found for "{voiceParsedEntry.foodName}"
                </p>
                <select
                  value={selectedFoodId}
                  onChange={(e) => setSelectedFoodId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                >
                  <option value="">Select a food...</option>
                  {foods?.map((food) => (
                    <option key={food.id} value={food.id}>
                      {food.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <span className="text-lg">📅</span>
              <span className="font-medium text-gray-900">{formatDate(date)}</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="ml-auto text-sm text-indigo-600 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Texture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Texture</label>
            <select
              value={texture}
              onChange={(e) => setTexture(e.target.value as Texture)}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none capitalize"
            >
              {TEXTURES.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={handleEdit}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedFoodId || addEntry.isPending}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
          >
            {addEntry.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
