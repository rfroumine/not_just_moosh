import { useMemo } from 'react';
import type { CalendarEntryWithFood, Category } from '../../lib/types';
import { CATEGORY_COLORS } from '../../lib/constants';

interface MonthCalendarProps {
  currentMonth: Date;
  entries: CalendarEntryWithFood[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onDoubleClickDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function MonthCalendar({
  currentMonth,
  entries,
  selectedDate,
  onSelectDate,
  onDoubleClickDate,
  onPrevMonth,
  onNextMonth,
}: MonthCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      dateStr: string;
    }> = [];

    // Add days from previous month
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        isCurrentMonth: false,
        dateStr: date.toISOString().split('T')[0],
      });
    }

    // Add days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        dateStr: date.toISOString().split('T')[0],
      });
    }

    // Add days from next month to complete the grid
    const endPadding = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= endPadding; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        dateStr: date.toISOString().split('T')[0],
      });
    }

    return days;
  }, [currentMonth]);

  // Group entries by date
  const entriesByDate = useMemo(() => {
    const map = new Map<string, CalendarEntryWithFood[]>();
    entries.forEach((entry) => {
      const existing = map.get(entry.date) || [];
      existing.push(entry);
      map.set(entry.date, existing);
    });
    return map;
  }, [entries]);

  // Get unique category dots for a date
  const getCategoryDots = (dateStr: string): Category[] => {
    const dateEntries = entriesByDate.get(dateStr) || [];
    const categories = new Set<Category>();
    dateEntries.forEach((entry) => {
      if (entry.food) {
        categories.add(entry.food.category as Category);
      }
    });
    return Array.from(categories).slice(0, 4); // Max 4 dots
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Month header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <button
          onClick={onPrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 px-2 mb-1">
        {dayNames.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 px-2 pb-3">
        {calendarDays.map((day, index) => {
          const isToday = day.date.getTime() === today.getTime();
          const isSelected = day.dateStr === selectedDate;
          const categoryDots = getCategoryDots(day.dateStr);

          return (
            <button
              key={index}
              onClick={() => onSelectDate(day.dateStr)}
              onDoubleClick={() => onDoubleClickDate(day.dateStr)}
              className={`relative aspect-[1/0.9] p-1 flex flex-col items-center justify-start rounded-xl transition-all ${
                !day.isCurrentMonth ? 'text-gray-300' : 'text-gray-900'
              } ${
                isSelected
                  ? 'bg-indigo-50 ring-1 ring-indigo-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span
                className={`w-6 h-6 flex items-center justify-center text-sm rounded-full ${
                  isToday
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : isSelected
                    ? 'text-indigo-700 font-medium'
                    : ''
                }`}
              >
                {day.date.getDate()}
              </span>

              {/* Category dots */}
              {categoryDots.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {categoryDots.map((cat, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${CATEGORY_COLORS[cat].dot}`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
