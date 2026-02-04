import { useChecklist } from '../../queries/useChecklist';
import { CATEGORY_COLORS } from '../../lib/constants';
import type { Category } from '../../lib/types';

export function SummaryBar() {
  const { summary, isLoading } = useChecklist();

  if (isLoading) {
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
