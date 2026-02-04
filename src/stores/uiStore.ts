import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type View = 'checklist' | 'calendar';

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

  // Confirm delete
  deleteConfirmation: {
    isOpen: boolean;
    type: 'food' | 'entry' | null;
    id: string | null;
    name: string;
  };
  openDeleteConfirmation: (type: 'food' | 'entry', id: string, name: string) => void;
  closeDeleteConfirmation: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // View
      currentView: 'checklist',
      setCurrentView: (view) => set({ currentView: view }),

      // Scroll positions
      checklistScrollPosition: 0,
      calendarScrollPosition: 0,
      setChecklistScrollPosition: (position) => set({ checklistScrollPosition: position }),
      setCalendarScrollPosition: (position) => set({ calendarScrollPosition: position }),

      // Selected date
      selectedDate: null,
      setSelectedDate: (date) => set({ selectedDate: date }),

      // Add entry modal
      isAddEntryModalOpen: false,
      addEntryModalDate: null,
      addEntryModalFoodId: null,
      openAddEntryModal: (date, foodId) => set({
        isAddEntryModalOpen: true,
        addEntryModalDate: date || new Date().toISOString().split('T')[0],
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
    }),
    {
      name: 'moosh-ui-state',
      partialize: (state) => ({
        currentView: state.currentView,
        checklistScrollPosition: state.checklistScrollPosition,
        calendarScrollPosition: state.calendarScrollPosition,
      }),
    }
  )
);
