interface PWAInstallModalProps {
  isIOS: boolean;
  onInstall: () => void;
  onDismiss: (permanently?: boolean) => void;
}

export function PWAInstallModal({ isIOS, onInstall, onDismiss }: PWAInstallModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onDismiss()}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-sm rounded-2xl overflow-hidden">
        <div className="p-6">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">🥕</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Add to Home Screen
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-center mb-6">
            Install Not Just Moosh for quick access and a better experience
          </p>

          {/* iOS Instructions */}
          {isIOS && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-semibold text-indigo-600 shadow-sm">
                  1
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm text-gray-700">Tap the</span>
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="text-sm text-gray-700">Share button</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-semibold text-indigo-600 shadow-sm">
                  2
                </div>
                <span className="text-sm text-gray-700">Scroll down and tap "Add to Home Screen"</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-semibold text-indigo-600 shadow-sm">
                  3
                </div>
                <span className="text-sm text-gray-700">Tap "Add" to confirm</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-3">
            {!isIOS && (
              <button
                onClick={onInstall}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                Install App
              </button>
            )}
            <button
              onClick={() => onDismiss()}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={() => onDismiss(true)}
              className="w-full px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Don't show again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
