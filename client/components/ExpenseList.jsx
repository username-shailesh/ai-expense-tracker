/**
 * Expense List Component
 * Displays expenses in a table/list format with edit and delete actions
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
  Food: 'text-orange-600',
  Travel: 'text-blue-600',
  Shopping: 'text-pink-600',
  Bills: 'text-purple-600',
  Other: 'text-gray-600',
};

export function ExpenseList({ expenses, onEdit, onDelete, isLoading = false }) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No expenses yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense._id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition flex items-center justify-between"
        >
          <div className="flex items-center gap-4 flex-1">
            {/* Category Icon */}
            <div className="text-2xl">
              {CATEGORY_ICONS[expense.category] || '📌'}
            </div>

            {/* Expense Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {expense.description}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <span className={`font-medium ${CATEGORY_COLORS[expense.category]}`}>
                  {expense.category}
                </span>
                <span>•</span>
                <span>
                  {new Date(expense.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Amount and Actions */}
          <div className="flex items-center gap-4 ml-4">
            <span className="font-bold text-lg text-gray-900 min-w-fit">
              ${expense.amount.toFixed(2)}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(expense)}
                disabled={isLoading}
                className="p-2 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                title="Edit expense"
              >
                <Edit2 className="w-4 h-4 text-blue-600" />
              </button>
              <button
                onClick={() => onDelete(expense._id)}
                disabled={isLoading}
                className="p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                title="Delete expense"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;
