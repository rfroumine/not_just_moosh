import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLocalDateString } from '../lib/dateUtils';
import type { ParsedVoiceEntry } from '../utils/parseVoiceEntry';

type View = 'checklist' | 'calendar';

interface ToastState {
  isOpen: boolean;
  message: string;
  type: 'error' | 'success' | 'info';
}

interface UIState {
  // Current view
  currentView: View;
  setCurrentView: (view: View) => void;

  // Scroll positions for preserving state
  checklistScrollPosition: number;
  calendarScrollPosition: number;
  setChecklistScrollPosition: (position: number) => void;
  setCalendarScrollPosition: (position: number) => void;

  // Selected date for calendar
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;

  // Modal states
  isAddEntryModalOpen: boolean;
  addEntryModalDate: string | null;
  addEntryModalFoodId: string | null;
  openAddEntryModal: (date?: string, foodId?: string) => void;
  closeAddEntryModal: () => void;

  isEditFoodModalOpen: boolean;
  editFoodId: string | null;
  openEditFoodModal: (foodId: string) => void;
  closeEditFoodModal: () => void;

  isEditEntryModalOpen: boolean;
  editEntryId: string | null;
  openEditEntryModal: (entryId: string) => void;
  closeEditEntryModal: () => void;

  isAddFoodModalOpen: boolean;
  addFoodPrefillName: string | null;
  openAddFoodModal: (prefillName?: string) => void;
  closeAddFoodModal: () => void;

  // Voice confirm modal
  isVoiceConfirmModalOpen: boolean;
  voiceParsedEntry: ParsedVoiceEntry | null;
  openVoiceConfirmModal: (entry: ParsedVoiceEntry) => void;
  closeVoiceConfirmModal: () => void;

  // Toast notifications
  toast: ToastState;
  showToast: (message: string, type?: 'error' | 'success' | 'info') => void;
  hideToast: () => void;

  // Confirm delete
  deleteConfirmation: {
    isOpen: boolean;
    type: 'food' | 'entry' | null;
    id: string | null;
    name: string;
  };
  openDeleteConfirmation: (type: 'food' | 'entry', id: string, name: string) => void;
  closeDeleteConfirmation: () => void;

  // Food details modal
  isFoodDetailsModalOpen: boolean;
  foodDetailsId: string | null;
  openFoodDetailsModal: (foodId: string) => void;
  closeFoodDetailsModal: () => void;

  // Checklist search
  checklistSearchQuery: string;
  setChecklistSearchQuery: (query: string) => void;
  clearChecklistSearch: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // View
      currentView: 'calendar',
      setCurrentView: (view) => set({ currentView: view }),

      // Scroll positions
      checklistScrollPosition: 0,
      calendarScrollPosition: 0,
      setChecklistScrollPosition: (position) => set({ checklistScrollPosition: position }),
      setCalendarScrollPosition: (position) => set({ calendarScrollPosition: position }),

      // Selected date
      selectedDate: getLocalDateString(new Date()),
      setSelectedDate: (date) => set({ selectedDate: date }),

      // Add entry modal
      isAddEntryModalOpen: false,
      addEntryModalDate: null,
      addEntryModalFoodId: null,
      openAddEntryModal: (date, foodId) => set({
        isAddEntryModalOpen: true,
        addEntryModalDate: date || getLocalDateString(new Date()),
        addEntryModalFoodId: foodId || null,
      }),
      closeAddEntryModal: () => set({
        isAddEntryModalOpen: false,
        addEntryModalDate: null,
        addEntryModalFoodId: null,
      }),

      // Edit food modal
      isEditFoodModalOpen: false,
      editFoodId: null,
      openEditFoodModal: (foodId) => set({
        isEditFoodModalOpen: true,
        editFoodId: foodId,
      }),
      closeEditFoodModal: () => set({
        isEditFoodModalOpen: false,
        editFoodId: null,
      }),

      // Edit entry modal
      isEditEntryModalOpen: false,
      editEntryId: null,
      openEditEntryModal: (entryId) => set({
        isEditEntryModalOpen: true,
        editEntryId: entryId,
      }),
      closeEditEntryModal: () => set({
        isEditEntryModalOpen: false,
        editEntryId: null,
      }),

      // Add food modal
      isAddFoodModalOpen: false,
      addFoodPrefillName: null,
      openAddFoodModal: (prefillName) => set({
        isAddFoodModalOpen: true,
        addFoodPrefillName: prefillName || null,
      }),
      closeAddFoodModal: () => set({
        isAddFoodModalOpen: false,
        addFoodPrefillName: null,
      }),

      // Voice confirm modal
      isVoiceConfirmModalOpen: false,
      voiceParsedEntry: null,
      openVoiceConfirmModal: (entry) => set({
        isVoiceConfirmModalOpen: true,
        voiceParsedEntry: entry,
      }),
      closeVoiceConfirmModal: () => set({
        isVoiceConfirmModalOpen: false,
        voiceParsedEntry: null,
      }),

      // Toast notifications
      toast: {
        isOpen: false,
        message: '',
        type: 'info',
      },
      showToast: (message, type = 'info') => set({
        toast: { isOpen: true, message, type },
      }),
      hideToast: () => set({
        toast: { isOpen: false, message: '', type: 'info' },
      }),

      // Delete confirmation
      deleteConfirmation: {
        isOpen: false,
        type: null,
        id: null,
        name: '',
      },
      openDeleteConfirmation: (type, id, name) => set({
        deleteConfirmation: { isOpen: true, type, id, name },
      }),
      closeDeleteConfirmation: () => set({
        deleteConfirmation: { isOpen: false, type: null, id: null, name: '' },
      }),

      // Food details modal
      isFoodDetailsModalOpen: false,
      foodDetailsId: null,
      openFoodDetailsModal: (foodId) => set({
        isFoodDetailsModalOpen: true,
        foodDetailsId: foodId,
      }),
      closeFoodDetailsModal: () => set({
        isFoodDetailsModalOpen: false,
        foodDetailsId: null,
      }),

      // Checklist search
      checklistSearchQuery: '',
      setChecklistSearchQuery: (query) => set({ checklistSearchQuery: query }),
      clearChecklistSearch: () => set({ checklistSearchQuery: '' }),
    }),
    {
      name: 'moosh-ui-state',
      partialize: (state) => ({
        checklistScrollPosition: state.checklistScrollPosition,
        calendarScrollPosition: state.calendarScrollPosition,
      }),
    }
  )
);
