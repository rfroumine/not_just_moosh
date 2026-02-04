import { useUIStore } from '../../stores/uiStore';

export function BottomNav() {
  const { currentView, setCurrentView } = useUIStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-lg mx-auto flex">
        <button
          onClick={() => setCurrentView('calendar')}
          className={`flex-1 flex flex-col items-center py-2 ${
            currentView === 'calendar'
              ? 'text-indigo-600'
              : 'text-gray-500'
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={currentView === 'calendar' ? 2.5 : 2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className={`text-xs mt-1 ${
            currentView === 'calendar' ? 'font-semibold' : 'font-medium'
          }`}>
            Calendar
          </span>
        </button>
        <button
          onClick={() => setCurrentView('checklist')}
          className={`flex-1 flex flex-col items-center py-2 ${
            currentView === 'checklist'
              ? 'text-indigo-600'
              : 'text-gray-500'
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={currentView === 'checklist' ? 2.5 : 2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className={`text-xs mt-1 ${
            currentView === 'checklist' ? 'font-semibold' : 'font-medium'
          }`}>
            Checklist
          </span>
        </button>
      </div>
    </nav>
  );
}
