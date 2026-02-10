import { useEffect, useState } from 'react';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { useUIStore } from '../../stores/uiStore';
import { useFoods } from '../../queries/useFoods';
import { parseVoiceEntry } from '../../utils/parseVoiceEntry';

const HINT_STORAGE_KEY = 'voiceHintCount';
const MAX_HINTS = 10;

export function VoiceInputButton() {
  const { isListening, isSupported, transcript, error, startListening, stopListening, resetTranscript } = useVoiceInput();
  const { showToast, openVoiceConfirmModal } = useUIStore();
  const { data: foods } = useFoods();
  const [showHint, setShowHint] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  // Check if we should still show hints
  useEffect(() => {
    const count = parseInt(localStorage.getItem(HINT_STORAGE_KEY) || '0', 10);
    setShowHint(count < MAX_HINTS);
  }, []);

  // When listening starts, increment the counter
  useEffect(() => {
    if (isListening && showHint) {
      const count = parseInt(localStorage.getItem(HINT_STORAGE_KEY) || '0', 10);
      const newCount = count + 1;
      localStorage.setItem(HINT_STORAGE_KEY, String(newCount));
      if (newCount >= MAX_HINTS) {
        setShowHint(false);
      }
    }
  }, [isListening, showHint]);

  // Manage hint visibility with delay after listening stops
  useEffect(() => {
    if (isListening) {
      setHintVisible(true);
    } else {
      // Keep hint visible for 5 seconds after listening stops
      const timer = setTimeout(() => setHintVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isListening]);

  // Handle transcript when speech is recognized
  useEffect(() => {
    if (transcript && foods) {
      const parsed = parseVoiceEntry(transcript, foods);
      openVoiceConfirmModal(parsed);
      resetTranscript();
    }
  }, [transcript, foods, openVoiceConfirmModal, resetTranscript]);

  // Show error as toast
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error, showToast]);

  const handleClick = () => {
    if (!isSupported) {
      showToast('Voice input is not supported in this browser. Try Chrome or Safari.', 'error');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="relative">
      {/* Instruction bubble - shows when listening and stays for 5s after (first 3 times only) */}
      {hintVisible && showHint && (
        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg">
          Entry by voice, say something like "I gave mashed banana today"
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-800" />
        </div>
      )}
      <button
        onClick={handleClick}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-30 transition-all ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
        aria-label={isListening ? 'Stop listening' : 'Add entry by voice'}
      >
        {isListening ? (
          // Stop icon
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="1" />
          </svg>
        ) : (
          // Microphone icon
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>
    </div>
  );
}
