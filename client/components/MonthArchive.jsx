/**
 * Month Archive Component
 * Displays all months with saved expense data in latest-first order
 * Allows clicking to navigate to a specific month
 */

import { FolderOpen, Calendar, DollarSign } from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function MonthArchive({
  months = [],
  isLoading = false,
  onMonthSelect = () => {},
  selectedMonth = null,
  selectedYear = null,
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <FolderOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Month Archive</h2>
        </div>
        <div className="text-center py-8">
          <div className="inline-block animate-spin">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-gray-600 mt-2">Loading archive...</p>
        </div>
      </div>
    );
  }

  if (!months || months.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <FolderOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Month Archive</h2>
        </div>
        <div className="text-center py-8">
          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No expenses recorded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <FolderOpen className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">
          Month Archive
          <span className="text-sm text-gray-500 font-normal ml-2">({months.length} months)</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {months.map((monthData, index) => {
          const [year, monthNum] = monthData.month.split('-');
          const yearNum = parseInt(year);
          const monthNumber = parseInt(monthNum);
          const monthName = MONTHS[monthNumber - 1];
          const isRecent = index === 0; // Latest month
          const isSelected = selectedMonth === monthNumber && selectedYear === yearNum; // Currently viewing month

          return (
            <button
              key={monthData.month}
              onClick={() => onMonthSelect(monthNumber, yearNum)}
              className={`p-4 rounded-xl border-2 transition transform hover:scale-105 cursor-pointer text-left ${
                isSelected
                  ? 'border-green-500 bg-green-50 hover:bg-green-100 ring-2 ring-green-300 shadow-lg'
                  : isRecent
                  ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className={`w-5 h-5 ${isSelected ? 'text-green-600' : 'text-blue-600'}`} />
                    <h3 className={`font-bold text-lg ${
                      isSelected
                        ? 'text-green-900'
                        : isRecent
                        ? 'text-blue-900'
                        : 'text-gray-900'
                    }`}>
                      {monthName} {year}
                    </h3>
                  </div>
                  {isSelected && (
                    <span className="inline-block text-xs font-semibold text-green-700 bg-green-200 px-2 py-1 rounded mb-3">
                      ✓ Selected
                    </span>
                  )}
                  {isRecent && !isSelected && (
                    <span className="inline-block text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-1 rounded mb-3">
                      Latest
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Spent</span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-green-700">${monthData.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Transactions</span>
                  <span className="font-semibold text-gray-900">{monthData.count}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info */}
      <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <p className="text-sm text-gray-600">
          📁 Click any month to view and manage expenses for that period
        </p>
      </div>
    </div>
  );
}

export default MonthArchive;
