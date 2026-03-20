/**
 * Category Breakdown Component
 * Shows expense breakdown by category with visual percentages
 */

const CATEGORY_CONFIG = {
  Food: { icon: '🍔', color: 'bg-orange-100', textColor: 'text-orange-700', barColor: 'bg-orange-500' },
  Travel: { icon: '🚗', color: 'bg-blue-100', textColor: 'text-blue-700', barColor: 'bg-blue-500' },
  Shopping: { icon: '🛍️', color: 'bg-pink-100', textColor: 'text-pink-700', barColor: 'bg-pink-500' },
  Bills: { icon: '📄', color: 'bg-purple-100', textColor: 'text-purple-700', barColor: 'bg-purple-500' },
  Other: { icon: '📌', color: 'bg-gray-100', textColor: 'text-gray-700', barColor: 'bg-gray-500' },
};

export function CategoryBreakdown({ categoryBreakdown = [], totalAmount = 0 }) {
  if (categoryBreakdown.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No expenses to show
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {categoryBreakdown.map((cat) => {
        const percentage = totalAmount > 0 ? (cat.amount / totalAmount) * 100 : 0;
        const config = CATEGORY_CONFIG[cat.category] || CATEGORY_CONFIG.Other;

        return (
          <div key={cat.category} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{config.icon}</span>
                <span className="font-medium text-gray-900">{cat.category}</span>
              </div>
              <span className="font-semibold text-gray-900">
                ${cat.amount.toFixed(2)}
                <span className="text-gray-600 text-sm ml-2">({percentage.toFixed(1)}%)</span>
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${config.barColor} transition-all`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CategoryBreakdown;
