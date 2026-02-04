import { useSwipeable } from 'react-swipeable';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../stores/uiStore';
import { ViewToggle } from './ViewToggle';
import { SummaryBar } from './SummaryBar';
import { ChecklistView } from '../checklist/ChecklistView';
import { CalendarView } from '../calendar/CalendarView';
import { AddEntryModal } from '../modals/AddEntryModal';
import { EditFoodModal } from '../modals/EditFoodModal';
import { ConfirmDelete } from '../modals/ConfirmDelete';

export function AppShell() {
  const { profile, signOut } = useAuth();
  const { currentView, setCurrentView, isAddEntryModalOpen, isEditFoodModalOpen, deleteConfirmation } = useUIStore();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentView === 'checklist') {
        setCurrentView('calendar');
      }
    },
    onSwipedRight: () => {
      if (currentView === 'calendar') {
        setCurrentView('checklist');
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
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {profile?.baby_name}'s Food Journey
              </h1>
            </div>
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign out
            </button>
          </div>
          <ViewToggle />
        </div>
      </header>

      {/* Main content */}
      <main
        {...swipeHandlers}
        className="max-w-lg mx-auto px-4 py-4 swipe-container"
      >
        {/* Summary */}
        <div className="mb-4">
          <SummaryBar />
        </div>

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

      {/* Modals */}
      {isAddEntryModalOpen && <AddEntryModal />}
      {isEditFoodModalOpen && <EditFoodModal />}
      {deleteConfirmation.isOpen && <ConfirmDelete />}
    </div>
  );
}
