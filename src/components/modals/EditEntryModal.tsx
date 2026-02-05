import { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useCalendarEntriesWithFoods, useUpdateCalendarEntry } from '../../queries/useCalendarEntries';
import { useQueryClient } from '@tanstack/react-query';
import { CHECKLIST_QUERY_KEY } from '../../queries/useChecklist';
import { TEXTURES, CATEGORIES } from '../../lib/types';
import { getFoodEmoji } from '../../lib/constants';
import type { Texture } from '../../lib/types';

export function EditEntryModal() {
  const { editEntryId, closeEditEntryModal } = useUIStore();
  const { data: entries } = useCalendarEntriesWithFoods();
  const updateEntry = useUpdateCalendarEntry();
  const queryClient = useQueryClient();

  const entry = entries?.find((e) => e.id === editEntryId);

  const [date, setDate] = useState('');
  const [texture, setTexture] = useState<Texture>('puree');
  const [notes, setNotes] = useState('');
  const [reaction, setReaction] = useState('');

  useEffect(() => {
    if (entry) {
      setDate(entry.date);
      setTexture(entry.texture);
      setNotes(entry.notes || '');
      setReaction(entry.reaction || '');
    }
  }, [entry]);

  if (!entry) return null;

  const categoryInfo = CATEGORIES[entry.food.category as keyof typeof CATEGORIES];
  const foodEmoji = getFoodEmoji(entry.food.name, categoryInfo.icon);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateEntry.mutateAsync({
        entryId: entry.id,
        updates: {
          date,
          texture,
          notes: notes || null,
          reaction: reaction || null,
        },
      });
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEY });
      closeEditEntryModal();
    } catch (error) {
      console.error('Failed to update entry:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeEditEntryModal}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-lg font-semibold text-gray-900">Edit Entry</h2>
          <button
            onClick={closeEditEntryModal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
          {/* Food (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Food</label>
            <div className="flex items-center gap-2 p-3.5 bg-gray-50 rounded-xl">
              <span className="text-lg">{foodEmoji}</span>
              <span className="font-medium text-gray-900">{entry.food.name}</span>
            </div>
          </div>

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
            disabled={updateEntry.isPending}
            className="w-full px-4 py-3.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
          >
            {updateEntry.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
