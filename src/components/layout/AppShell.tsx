import { useState, useRef, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../stores/uiStore';
import { BottomNav } from './BottomNav';
import { SummaryBar } from './SummaryBar';
import { ChecklistView } from '../checklist/ChecklistView';
import { CalendarView } from '../calendar/CalendarView';
import { AddEntryModal } from '../modals/AddEntryModal';
import { EditFoodModal } from '../modals/EditFoodModal';
import { ConfirmDelete } from '../modals/ConfirmDelete';

export function AppShell() {
  const { profile, signOut } = useAuth();
  const { currentView, setCurrentView, isAddEntryModalOpen, isEditFoodModalOpen, deleteConfirmation } = useUIStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const babyInitial = profile?.baby_name?.charAt(0).toUpperCase() || '?';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentView === 'calendar') {
        setCurrentView('checklist');
      }
    },
    onSwipedRight: () => {
      if (currentView === 'checklist') {
        setCurrentView('calendar');
      }
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50,
    preventScrollOnSwipe: false,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3">
          {/* Title row */}
          <div className="flex items-center justify-between mb-3">
            <h1
              className="text-2xl text-gray-900"
              style={{ fontFamily: 'Pacifico, cursive' }}
            >
              Not just Moosh
            </h1>

            {/* Baby avatar with dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm hover:shadow-md transition-shadow"
              >
                {babyInitial}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{profile?.baby_name}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Compact summary */}
          <SummaryBar compact />
        </div>
      </header>

      {/* Main content */}
      <main
        {...swipeHandlers}
        className="max-w-lg mx-auto px-4 py-4 pb-20 swipe-container"
      >
        {/* View content */}
        <div className="relative">
          <div
            className={`transition-opacity duration-200 ${
              currentView === 'checklist' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
            }`}
          >
            {currentView === 'checklist' && <ChecklistView />}
          </div>
          <div
            className={`transition-opacity duration-200 ${
              currentView === 'calendar' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
            }`}
          >
            {currentView === 'calendar' && <CalendarView />}
          </div>
        </div>
      </main>

      {/* Floating add button - calendar view only */}
      {currentView === 'calendar' && (
        <button
          onClick={() => useUIStore.getState().openAddEntryModal()}
          className="fixed bottom-20 right-4 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all flex items-center justify-center z-30"
          aria-label="Add entry"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      )}

      {/* Bottom navigation */}
      <BottomNav />

      {/* Modals */}
      {isAddEntryModalOpen && <AddEntryModal />}
      {isEditFoodModalOpen && <EditFoodModal />}
      {deleteConfirmation.isOpen && <ConfirmDelete />}
    </div>
  );
}
