interface PWAInstallBannerProps {
  isIOS: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

export function PWAInstallBanner({ isIOS, onInstall, onDismiss }: PWAInstallBannerProps) {
  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 px-4 pb-2">
      <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <span className="text-xl">🥕</span>
          </div>

          <div className="flex-1 min-w-0">
            {isIOS ? (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Add to Home Screen:</span>{' '}
                tap{' '}
                <svg className="inline w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {' '}then "Add to Home Screen"
              </p>
            ) : (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Install the app</span> for quick access
              </p>
            )}
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            {!isIOS && (
              <button
                onClick={onInstall}
                className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Install
              </button>
            )}
            <button
              onClick={onDismiss}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
