import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pwa-install-state';
const SESSION_THRESHOLD = 3;

interface StoredState {
  sessionCount: number;
  neverShowAgain: boolean;
  lastSessionTimestamp: number;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function getStoredState(): StoredState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return {
    sessionCount: 0,
    neverShowAgain: false,
    lastSessionTimestamp: 0,
  };
}

function setStoredState(state: StoredState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function isNewSession(lastTimestamp: number): boolean {
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  return now - lastTimestamp > hourInMs;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [sessionCount, setSessionCount] = useState(1);
  const [bannerDismissedThisSession, setBannerDismissedThisSession] = useState(false);
  const [modalDismissedThisSession, setModalDismissedThisSession] = useState(false);
  const [neverShowAgain, setNeverShowAgain] = useState(false);

  // Initialize on mount
  useEffect(() => {
    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !('MSStream' in window);
    setIsIOS(isIOSDevice);

    // Handle session counting
    const stored = getStoredState();
    setNeverShowAgain(stored.neverShowAgain);

    if (isNewSession(stored.lastSessionTimestamp)) {
      const newCount = stored.sessionCount + 1;
      setSessionCount(newCount);
      setStoredState({
        ...stored,
        sessionCount: newCount,
        lastSessionTimestamp: Date.now(),
      });
    } else {
      setSessionCount(stored.sessionCount || 1);
      setStoredState({
        ...stored,
        lastSessionTimestamp: Date.now(),
      });
    }
  }, []);

  // Listen for beforeinstallprompt event (Chrome/Android)
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const canInstall = deferredPrompt !== null || isIOS;

  const triggerInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const dismissBanner = useCallback(() => {
    setBannerDismissedThisSession(true);
  }, []);

  const dismissModal = useCallback((permanently = false) => {
    setModalDismissedThisSession(true);
    if (permanently) {
      setNeverShowAgain(true);
      const stored = getStoredState();
      setStoredState({ ...stored, neverShowAgain: true });
    }
  }, []);

  // Determine what to show
  const showBanner = canInstall
    && !isInstalled
    && !neverShowAgain
    && !bannerDismissedThisSession
    && sessionCount < SESSION_THRESHOLD;

  const showModal = canInstall
    && !isInstalled
    && !neverShowAgain
    && !modalDismissedThisSession
    && sessionCount >= SESSION_THRESHOLD
    && bannerDismissedThisSession;

  return {
    canInstall,
    isInstalled,
    isIOS,
    showBanner,
    showModal,
    sessionCount,
    triggerInstall,
    dismissBanner,
    dismissModal,
  };
}
