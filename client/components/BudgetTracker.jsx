/**
 * Budget Tracker Component
 * Shows budget status, remaining amount, and overspending warnings
 */

import { AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

export function BudgetTracker({ 
  currentSpending = 0, 
  monthlyBudget = 5000,
  budgetAlert = null,
  onUpdateBudget = null,
  isEditing = false,
  onEditClick = null,
}) {
  const percentageUsed = (currentSpending / monthlyBudget) * 100;
  const remaining = Math.max(0, monthlyBudget - currentSpending);
  const isOverBudget = currentSpending > monthlyBudget;

  // Determine color based on budget status
  let statusColor = 'text-green-600';
  let statusBg = 'bg-green-50';
  let progressColor = 'bg-green-500';

  if (percentageUsed >= 80) {
    statusColor = 'text-amber-600';
    statusBg = 'bg-amber-50';
    progressColor = 'bg-amber-500';
  }

  if (isOverBudget) {
    statusColor = 'text-red-600';
    statusBg = 'bg-red-50';
    progressColor = 'bg-red-500';
  }

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className={`rounded-xl p-6 ${statusBg} border-2 ${statusColor.replace('text-', 'border-')}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Monthly Budget Status</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                ${currentSpending.toFixed(2)}
              </span>
              <span className={`text-lg font-semibold ${statusColor}`}>
                / ${monthlyBudget.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOverBudget ? (
              <AlertTriangle className="w-8 h-8 text-red-600" />
            ) : (
              <DollarSign className="w-8 h-8 text-green-600" />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColor} transition-all`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
        </div>

        {/* Status Text */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${statusColor}`}>
            {percentageUsed.toFixed(1)}% of budget used
          </span>
          <span className={`text-sm font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
            {isOverBudget
              ? `Over budget by $${(currentSpending - monthlyBudget).toFixed(2)}`
              : `$${remaining.toFixed(2)} remaining`}
          </span>
        </div>

        {/* Edit Budget Button */}
        {onEditClick && (
          <button
            onClick={onEditClick}
            className="mt-4 w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Edit Budget Limit
          </button>
        )}
      </div>

      {/* Alert Message */}
      {budgetAlert?.shouldAlert && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Budget Alert</h4>
              <p className="text-sm text-red-700 mt-1">{budgetAlert.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Warning Threshold Info */}
      {percentageUsed > 0 && percentageUsed < 80 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <div className="flex gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">On Track</h4>
              <p className="text-sm text-blue-700 mt-1">
                You're spending responsibly. Keep up the good budgeting!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetTracker;
