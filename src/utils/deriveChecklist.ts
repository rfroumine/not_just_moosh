import type {
  Food,
  CalendarEntry,
  ManualMark,
  FoodStatus,
  ChecklistFood,
  CategoryGroup,
  Category,
} from '../lib/types';
import { CATEGORY_ORDER, CATEGORIES } from '../lib/types';
import { ALLERGEN_REMINDER_DAYS, ALLERGEN_DONE_THRESHOLD } from '../lib/constants';
import { getLocalDateString } from '../lib/dateUtils';

/**
 * Calculate days since a given date
 */
export function daysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - date.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayString(): string {
  return getLocalDateString(new Date());
}

/**
 * Check if a date is in the past (before today)
 */
export function isPastDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

/**
 * Check if a date is in the future (after today)
 */
export function isFutureDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return date.getTime() > today.getTime();
}

/**
 * Check if a date is today
 */
export function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return date.getTime() === today.getTime();
}

/**
 * Compute the status for a single food item
 */
export function computeFoodStatus(
  food: Food,
  entries: CalendarEntry[],
  marks: ManualMark[]
): FoodStatus {
  // Filter entries for this food
  const foodEntries = entries.filter((e) => e.food_id === food.id);
  const foodMarks = marks.filter((m) => m.food_id === food.id);

  // Only count past entries (including today) towards times given
  const pastEntries = foodEntries.filter(
    (e) => !isFutureDate(e.date)
  );

  const timesGiven = pastEntries.length + foodMarks.length;

  // Find the most recent date the food was given
  const allDates = [
    ...pastEntries.map((e) => e.date),
    ...foodMarks.map((m) => m.created_at.split('T')[0]),
  ];

  const sortedDates = allDates.sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  const lastGivenDate = sortedDates[0] || null;

  // Determine status
  let status: 'nothing' | 'started' | 'done';
  if (food.is_allergen) {
    if (timesGiven >= ALLERGEN_DONE_THRESHOLD) {
      status = 'done';
    } else if (timesGiven >= 1) {
      status = 'started';
    } else {
      status = 'nothing';
    }
  } else {
    status = timesGiven >= 1 ? 'done' : 'nothing';
  }

  // Check if there are future planned entries
  const hasPlanned = foodEntries.some((e) => isFutureDate(e.date));

  // Check if allergen needs reminder (>14 days since last given)
  const needsReminder =
    food.is_allergen &&
    status !== 'done' &&
    lastGivenDate !== null &&
    daysSince(lastGivenDate) > ALLERGEN_REMINDER_DAYS;

  return {
    timesGiven,
    lastGivenDate,
    status,
    hasPlanned,
    needsReminder,
  };
}

/**
 * Build the complete checklist with derived status for all foods
 */
export function buildChecklist(
  foods: Food[],
  entries: CalendarEntry[],
  marks: ManualMark[]
): ChecklistFood[] {
  return foods.map((food) => ({
    ...food,
    foodStatus: computeFoodStatus(food, entries, marks),
  }));
}

/**
 * Group checklist foods by category
 */
export function groupByCategory(foods: ChecklistFood[]): CategoryGroup[] {
  const groups: Map<Category, ChecklistFood[]> = new Map();

  // Initialize all categories
  CATEGORY_ORDER.forEach((cat) => {
    groups.set(cat, []);
  });

  // Group foods
  foods.forEach((food) => {
    const category = food.category as Category;
    const existing = groups.get(category) || [];
    existing.push(food);
    groups.set(category, existing);
  });

  // Build category groups with counts
  return CATEGORY_ORDER.map((category) => {
    const categoryFoods = groups.get(category) || [];
    const doneCount = categoryFoods.filter(
      (f) => f.foodStatus.status === 'done'
    ).length;

    return {
      category,
      foods: categoryFoods.sort((a, b) => a.name.localeCompare(b.name)),
      doneCount,
      totalCount: categoryFoods.length,
    };
  }).filter((group) => group.totalCount > 0);
}

/**
 * Calculate overall summary statistics
 */
export function calculateSummary(groups: CategoryGroup[]): {
  totalDone: number;
  totalCount: number;
  categoryStats: Array<{
    category: Category;
    done: number;
    total: number;
    icon: string;
  }>;
} {
  let totalDone = 0;
  let totalCount = 0;

  const categoryStats = groups.map((group) => {
    totalDone += group.doneCount;
    totalCount += group.totalCount;

    return {
      category: group.category,
      done: group.doneCount,
      total: group.totalCount,
      icon: CATEGORIES[group.category].icon,
    };
  });

  return { totalDone, totalCount, categoryStats };
}

/**
 * Format last given date for display
 */
export function formatLastGiven(dateStr: string | null): string {
  if (!dateStr) return 'Never given';

  const days = daysSince(dateStr);

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return '1 month ago';

  return `${Math.floor(days / 30)} months ago`;
}
