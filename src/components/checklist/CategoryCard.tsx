import { useState } from 'react';
import type { CategoryGroup } from '../../lib/types';
import { CATEGORIES } from '../../lib/types';
import { CATEGORY_COLORS } from '../../lib/constants';
import { FoodCard } from './FoodCard';

interface CategoryCardProps {
  group: CategoryGroup;
}

export function CategoryCard({ group }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const categoryInfo = CATEGORIES[group.category];
  const colors = CATEGORY_COLORS[group.category];

  return (
    <div className={`rounded-xl overflow-hidden border ${colors.border} bg-white`}>
      {/* Category header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-4 ${colors.bgLight} hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoryInfo.icon}</span>
          <div className="text-left">
            <h3 className={`font-semibold ${colors.text}`}>
              {categoryInfo.label}
            </h3>
            <p className="text-sm text-gray-600">
              {group.doneCount} of {group.totalCount} introduced
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress pie chart */}
          <div className="w-10 h-10">
            <svg className="w-10 h-10" viewBox="0 0 40 40">
              {/* Background circle */}
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="#e5e7eb"
              />
              {/* Filled pie wedge */}
              {group.doneCount > 0 && (
                <path
                  d={(() => {
                    const percentage = group.doneCount / group.totalCount;
                    if (percentage >= 1) {
                      // Full circle
                      return 'M 20 20 m -16 0 a 16 16 0 1 0 32 0 a 16 16 0 1 0 -32 0';
                    }
                    const angle = percentage * 2 * Math.PI;
                    const x = 20 + 16 * Math.sin(angle);
                    const y = 20 - 16 * Math.cos(angle);
                    const largeArc = percentage > 0.5 ? 1 : 0;
                    return `M 20 20 L 20 4 A 16 16 0 ${largeArc} 1 ${x} ${y} Z`;
                  })()}
                  fill="currentColor"
                  className={colors.text}
                />
              )}
            </svg>
          </div>
          {/* Expand/collapse icon */}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Food list */}
      {isExpanded && (
        <div className={`p-3 space-y-2 ${colors.bgLight}`}>
          {group.foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
}
