/**
 * Date Wise Summary Component
 * Shows daily expense totals in a visual card layout
 */

import { Calendar } from 'lucide-react';

export function DateWiseSummary({ expenses = [] }) {
  // Group expenses by date and calculate totals
  const groupedByDate = expenses.reduce((acc, expense) => {
    const dateStr = expense.date.split('T')[0]; // YYYY-MM-DD
    if (!acc[dateStr]) {
      acc[dateStr] = { total: 0, count: 0, date: new Date(expense.date) };
    }
    acc[dateStr].total += expense.amount;
    acc[dateStr].count += 1;
    return acc;
  }, {});

  // Sort dates in descending order and get top 5
  const topDates = Object.entries(groupedByDate)
    .sort(([, a], [, b]) => b.date - a.date)
    .slice(0, 5)
    .map(([dateStr, data]) => ({
      dateStr,
      ...data,
    }));

  if (topDates.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Recent Days Summary</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {topDates.map(({ dateStr, total, count, date }) => {
          const displayDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          const dayName = date.toLocaleDateString('en-US', {
            weekday: 'short',
          });

          return (
            <div
              key={dateStr}
              className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200 hover:shadow-md transition"
            >
              <p className="text-xs font-bold text-gray-600 uppercase mb-1">
                {dayName}
              </p>
              <p className="text-lg font-bold text-gray-900 mb-2">
                {displayDate}
              </p>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-600">
                  ${total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-600">
                  {count} transaction{count !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DateWiseSummary;
