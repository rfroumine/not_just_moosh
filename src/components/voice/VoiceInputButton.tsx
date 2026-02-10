import { useEffect } from 'react';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { useUIStore } from '../../stores/uiStore';
import { useFoods } from '../../queries/useFoods';
import { parseVoiceEntry } from '../../utils/parseVoiceEntry';

export function VoiceInputButton() {
  const { isListening, isSupported, transcript, error, startListening, stopListening, resetTranscript } = useVoiceInput();
  const { showToast, openVoiceConfirmModal } = useUIStore();
  const { data: foods } = useFoods();

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
  );
}
