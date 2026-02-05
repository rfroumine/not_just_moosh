import { useEffect } from 'react';
import { useUIStore } from '../stores/uiStore';

export function Toast() {
  const { toast, hideToast } = useUIStore();

  useEffect(() => {
    if (toast.isOpen) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.isOpen, hideToast]);

  if (!toast.isOpen) return null;

  const bgColor = {
    error: 'bg-red-600',
    success: 'bg-green-600',
    info: 'bg-gray-800',
  }[toast.type];

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div
        className={`${bgColor} text-white px-4 py-3 rounded-xl shadow-lg max-w-sm text-sm pointer-events-auto animate-slide-up`}
      >
        {toast.message}
      </div>
    </div>
  );
}
