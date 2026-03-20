/**
 * Month Year Selector Component with Day Navigation
 * Allows users to select month/year via dropdowns and navigate day-by-day
 * Fully user-friendly with dropdown selectors and daily navigation buttons
 */

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export function MonthYearSelector({ 
  selectedDate, 
  onMonthChange, 
  onYearChange,
  onNavigatePrevious,
  onNavigateNext,
  onToday,
}) {
  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    yearOptions.push(i);
  }

  // Extract components from selectedDate
  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();
  const day = selectedDate.getDate();
  const dayName = DAYS[selectedDate.getDay()];

  // Format date string for display
  const dateString = selectedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Select Month & Year</h2>
        </div>

        {/* Selectors */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Month Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase">Month</label>
            <select
              value={month}
              onChange={(e) => onMonthChange(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
            >
              {MONTHS.map((m, index) => (
                <option key={m} value={index + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Year Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase">Year</label>
            <select
              value={year}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer w-24"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Day Navigation Buttons */}
          <div className="flex items-center gap-2 border-l-2 border-gray-300 pl-4">
            <button
              onClick={onNavigatePrevious}
              className="p-2 hover:bg-gray-100 rounded-lg transition border border-gray-300"
              title="Previous day"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={onToday}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition border border-gray-300"
            >
              Today
            </button>
            
            <button
              onClick={onNavigateNext}
              className="p-2 hover:bg-gray-100 rounded-lg transition border border-gray-300"
              title="Next day"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Text */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>📅 Currently viewing:</strong> {dayName}, {dateString}
          {' • '}
          <span className="text-xs">All new expenses will be added to this date</span>
        </p>
      </div>
    </div>
  );
}

export default MonthYearSelector;
