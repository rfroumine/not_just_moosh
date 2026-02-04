import { useChecklist } from '../../queries/useChecklist';
import { CATEGORY_COLORS } from '../../lib/constants';
import type { Category } from '../../lib/types';

interface SummaryBarProps {
  compact?: boolean;
}

export function SummaryBar({ compact = false }: SummaryBarProps) {
  const { summary, isLoading } = useChecklist();

  if (isLoading) {
    if (compact) {
      return (
        <div className="animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-1"></div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-5 bg-gray-200 rounded w-12"></div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 bg-gray-200 rounded w-16"></div>
          ))}
        </div>
      </div>
    );
  }

  const progressPercent = summary.totalCount > 0
    ? Math.round((summary.totalDone / summary.totalCount) * 100)
    : 0;

  if (compact) {
    return (
      <div>
        <div className="text-xs text-gray-500 mb-1">
          {summary.totalDone} of {summary.totalCount} foods
          <span className="mx-1">•</span>
          <span className="font-semibold text-indigo-600">{progressPercent}%</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {summary.categoryStats.map((stat) => {
            const colors = CATEGORY_COLORS[stat.category as Category];
            return (
              <div
                key={stat.category}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${colors.bgLight} ${colors.text}`}
              >
                <span>{stat.icon}</span>
                <span>{stat.done}/{stat.total}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">
          {summary.totalDone} of {summary.totalCount} foods introduced
        </span>
        <span className="text-sm font-bold text-indigo-600">
          {progressPercent}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {summary.categoryStats.map((stat) => {
          const colors = CATEGORY_COLORS[stat.category as Category];
          return (
            <div
              key={stat.category}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bgLight} ${colors.text}`}
            >
              <span>{stat.icon}</span>
              <span>
                {stat.done}/{stat.total}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
