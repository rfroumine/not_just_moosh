import { useUIStore } from '../../stores/uiStore';

export function ViewToggle() {
  const { currentView, setCurrentView } = useUIStore();

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setCurrentView('checklist')}
        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          currentView === 'checklist'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Checklist
      </button>
      <button
        onClick={() => setCurrentView('calendar')}
        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          currentView === 'calendar'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Calendar
      </button>
    </div>
  );
}
