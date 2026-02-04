import { useState, useEffect, useRef } from 'react';
import { useCalendarEntriesWithFoods } from '../../queries/useCalendarEntries';
import { useUIStore } from '../../stores/uiStore';
import { MonthCalendar } from './MonthCalendar';
import { DatePopup } from './DatePopup';

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const { data: entries, isLoading, error } = useCalendarEntriesWithFoods();
  const { selectedDate, setSelectedDate, calendarScrollPosition, setCalendarScrollPosition } = useUIStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Restore scroll position
  useEffect(() => {
    if (scrollRef.current && calendarScrollPosition > 0) {
      scrollRef.current.scrollTop = calendarScrollPosition;
    }
  }, []);

  // Save scroll position
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      setCalendarScrollPosition(element.scrollTop);
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, [setCalendarScrollPosition]);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setSelectedDate(null);
      }
    };

    if (selectedDate) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [selectedDate, setSelectedDate]);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleSelectDate = (date: string) => {
    if (selectedDate === date) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load calendar</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-indigo-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-4 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded" />
            <div className="h-8 w-8 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="pb-20">
      <MonthCalendar
        currentMonth={currentMonth}
        entries={entries || []}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      {/* Date popup */}
      {selectedDate && (
        <div ref={popupRef}>
          <DatePopup
            date={selectedDate}
            onClose={() => setSelectedDate(null)}
          />
        </div>
      )}
    </div>
  );
}
