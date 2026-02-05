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
          {/* Progress ring */}
          <div className="relative w-10 h-10">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${(group.doneCount / group.totalCount) * 100.53} 100.53`}
                className={colors.text}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
              {Math.round((group.doneCount / group.totalCount) * 100)}%
            </span>
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
