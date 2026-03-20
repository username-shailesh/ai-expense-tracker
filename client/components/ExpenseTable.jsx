/**
 * Expense Table Component
 * Displays expenses in table format, grouped by date
 * Shows category icons, amounts, descriptions
 */

import { Trash2, Edit2 } from 'lucide-react';

const CATEGORY_ICONS = {
  Food: '🍔',
  Travel: '🚗',
  Shopping: '🛍️',
  Bills: '📄',
  Other: '📌',
};

const CATEGORY_COLORS = {
  Food: 'text-orange-600 bg-orange-50',
  Travel: 'text-blue-600 bg-blue-50',
  Shopping: 'text-pink-600 bg-pink-50',
  Bills: 'text-purple-600 bg-purple-50',
  Other: 'text-gray-600 bg-gray-50',
};

export function ExpenseTable({ expenses, onEdit, onDelete, isLoading = false }) {
  // Group expenses by date
  const groupedByDate = expenses.reduce((acc, expense) => {
    const dateStr = new Date(expense.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(expense);
    return acc;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No expenses yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedDates.map((dateStr) => {
        const dayExpenses = groupedByDate[dateStr];
        const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

        return (
          <div key={dateStr} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Date Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">{dateStr}</h3>
                <span className="text-sm font-semibold text-gray-600">
                  {dayExpenses.length} transaction{dayExpenses.length !== 1 ? 's' : ''} • 
                  <span className="text-gray-900 ml-2">${dayTotal.toFixed(2)}</span>
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Category
                      </span>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Description
                      </span>
                    </th>
                    <th className="px-6 py-3 text-right">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </span>
                    </th>
                    <th className="px-6 py-3 text-center">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dayExpenses.map((expense) => (
                    <tr
                      key={expense._id}
                      className="hover:bg-gray-50 transition"
                    >
                      {/* Category with Icon */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl" title={expense.category}>
                            {CATEGORY_ICONS[expense.category] || '📌'}
                          </span>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${CATEGORY_COLORS[expense.category]}`}>
                            {expense.category}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-medium max-w-xs truncate">
                          {expense.description}
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-bold text-gray-900">
                          ${expense.amount.toFixed(2)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onEdit(expense)}
                            disabled={isLoading}
                            className="p-2 hover:bg-blue-100 rounded-lg transition disabled:opacity-50"
                            title="Edit expense"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => onDelete(expense._id)}
                            disabled={isLoading}
                            className="p-2 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                            title="Delete expense"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ExpenseTable;
