/**
 * Insight Card Component
 * Displays AI-generated spending insights and recommendations
 */

import { Lightbulb, Sparkles } from 'lucide-react';

export function InsightCard({ insights = null, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-200">
        <div className="flex gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-blue-200 rounded animate-pulse"></div>
          <div className="h-4 bg-blue-200 rounded animate-pulse"></div>
          <div className="h-4 bg-blue-200 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-200">
      <div className="flex gap-3 mb-4">
        <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0" />
        <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
      </div>
      <p className="text-gray-700 leading-relaxed">
        {insights}
      </p>
    </div>
  );
}

export default InsightCard;
