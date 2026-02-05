import type { Category } from './types';

// Default foods to seed for new users
export const DEFAULT_FOODS: Array<{
  name: string;
  category: Category;
  is_allergen: boolean;
  emoji: string;
}> = [
  // Allergens (Top 9)
  { name: 'Peanut', category: 'allergens', is_allergen: true, emoji: '🥜' },
  { name: 'Tree Nuts', category: 'allergens', is_allergen: true, emoji: '🌰' },
  { name: 'Milk', category: 'allergens', is_allergen: true, emoji: '🥛' },
  { name: 'Egg', category: 'allergens', is_allergen: true, emoji: '🥚' },
  { name: 'Wheat', category: 'allergens', is_allergen: true, emoji: '🌾' },
  { name: 'Soy', category: 'allergens', is_allergen: true, emoji: '🫘' },
  { name: 'Fish', category: 'allergens', is_allergen: true, emoji: '🐟' },
  { name: 'Shellfish', category: 'allergens', is_allergen: true, emoji: '🦐' },
  { name: 'Sesame', category: 'allergens', is_allergen: true, emoji: '🫛' },

  // Vegetables
  { name: 'Carrot', category: 'vegetables', is_allergen: false, emoji: '🥕' },
  { name: 'Sweet Potato', category: 'vegetables', is_allergen: false, emoji: '🍠' },
  { name: 'Peas', category: 'vegetables', is_allergen: false, emoji: '🫛' },
  { name: 'Green Beans', category: 'vegetables', is_allergen: false, emoji: '🫛' },
  { name: 'Squash', category: 'vegetables', is_allergen: false, emoji: '🎃' },
  { name: 'Zucchini', category: 'vegetables', is_allergen: false, emoji: '🥒' },
  { name: 'Broccoli', category: 'vegetables', is_allergen: false, emoji: '🥦' },
  { name: 'Spinach', category: 'vegetables', is_allergen: false, emoji: '🥬' },
  { name: 'Avocado', category: 'vegetables', is_allergen: false, emoji: '🥑' },
  { name: 'Cauliflower', category: 'vegetables', is_allergen: false, emoji: '🥬' },
  { name: 'Beets', category: 'vegetables', is_allergen: false, emoji: '🫐' },
  { name: 'Cucumber', category: 'vegetables', is_allergen: false, emoji: '🥒' },
  { name: 'Bell Pepper', category: 'vegetables', is_allergen: false, emoji: '🫑' },

  // Fruits
  { name: 'Banana', category: 'fruit', is_allergen: false, emoji: '🍌' },
  { name: 'Apple', category: 'fruit', is_allergen: false, emoji: '🍎' },
  { name: 'Pear', category: 'fruit', is_allergen: false, emoji: '🍐' },
  { name: 'Peach', category: 'fruit', is_allergen: false, emoji: '🍑' },
  { name: 'Mango', category: 'fruit', is_allergen: false, emoji: '🥭' },
  { name: 'Blueberries', category: 'fruit', is_allergen: false, emoji: '🫐' },
  { name: 'Strawberries', category: 'fruit', is_allergen: false, emoji: '🍓' },
  { name: 'Raspberries', category: 'fruit', is_allergen: false, emoji: '🫐' },
  { name: 'Watermelon', category: 'fruit', is_allergen: false, emoji: '🍉' },
  { name: 'Cantaloupe', category: 'fruit', is_allergen: false, emoji: '🍈' },
  { name: 'Papaya', category: 'fruit', is_allergen: false, emoji: '🥭' },
  { name: 'Plum', category: 'fruit', is_allergen: false, emoji: '🫐' },
  { name: 'Grapes', category: 'fruit', is_allergen: false, emoji: '🍇' },
  { name: 'Kiwi', category: 'fruit', is_allergen: false, emoji: '🥝' },

  // Dairy
  { name: 'Yogurt', category: 'dairy', is_allergen: false, emoji: '🥛' },
  { name: 'Cheese', category: 'dairy', is_allergen: false, emoji: '🧀' },
  { name: 'Cottage Cheese', category: 'dairy', is_allergen: false, emoji: '🧀' },
  { name: 'Butter', category: 'dairy', is_allergen: false, emoji: '🧈' },
  { name: 'Cream Cheese', category: 'dairy', is_allergen: false, emoji: '🧀' },

  // Grains
  { name: 'Rice Cereal', category: 'grains', is_allergen: false, emoji: '🍚' },
  { name: 'Oatmeal', category: 'grains', is_allergen: false, emoji: '🥣' },
  { name: 'Barley', category: 'grains', is_allergen: false, emoji: '🌾' },
  { name: 'Quinoa', category: 'grains', is_allergen: false, emoji: '🌾' },
  { name: 'Pasta', category: 'grains', is_allergen: false, emoji: '🍝' },
  { name: 'Bread', category: 'grains', is_allergen: false, emoji: '🍞' },
  { name: 'Crackers', category: 'grains', is_allergen: false, emoji: '🥠' },
  { name: 'Pancakes', category: 'grains', is_allergen: false, emoji: '🥞' },

  // Protein
  { name: 'Chicken', category: 'protein', is_allergen: false, emoji: '🍗' },
  { name: 'Turkey', category: 'protein', is_allergen: false, emoji: '🦃' },
  { name: 'Beef', category: 'protein', is_allergen: false, emoji: '🥩' },
  { name: 'Pork', category: 'protein', is_allergen: false, emoji: '🥓' },
  { name: 'Lamb', category: 'protein', is_allergen: false, emoji: '🍖' },
  { name: 'Salmon', category: 'protein', is_allergen: false, emoji: '🍣' },
  { name: 'Cod', category: 'protein', is_allergen: false, emoji: '🐟' },
  { name: 'Tilapia', category: 'protein', is_allergen: false, emoji: '🐟' },
  { name: 'Tofu', category: 'protein', is_allergen: false, emoji: '🧈' },
  { name: 'Lentils', category: 'protein', is_allergen: false, emoji: '🫘' },
  { name: 'Black Beans', category: 'protein', is_allergen: false, emoji: '🫘' },
  { name: 'Chickpeas', category: 'protein', is_allergen: false, emoji: '🧆' },

  // Other
  { name: 'Olive Oil', category: 'other', is_allergen: false, emoji: '🫒' },
  { name: 'Coconut', category: 'other', is_allergen: false, emoji: '🥥' },
  { name: 'Hummus', category: 'other', is_allergen: false, emoji: '🧆' },
  { name: 'Nut Butter', category: 'other', is_allergen: false, emoji: '🥜' },
];

// Tailwind color classes for categories
export const CATEGORY_COLORS: Record<Category, {
  bg: string;
  bgLight: string;
  text: string;
  border: string;
  dot: string;
}> = {
  allergens: {
    bg: 'bg-red-500',
    bgLight: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-400',
  },
  vegetables: {
    bg: 'bg-green-500',
    bgLight: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-400',
  },
  fruit: {
    bg: 'bg-pink-500',
    bgLight: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    dot: 'bg-pink-400',
  },
  dairy: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-400',
  },
  grains: {
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
  },
  protein: {
    bg: 'bg-orange-500',
    bgLight: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    dot: 'bg-orange-400',
  },
  other: {
    bg: 'bg-gray-500',
    bgLight: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  },
};

// Helper to get food emoji by name (falls back to category icon)
export const getFoodEmoji = (foodName: string, categoryIcon: string): string => {
  const food = DEFAULT_FOODS.find(f => f.name.toLowerCase() === foodName.toLowerCase());
  return food?.emoji || categoryIcon;
};

// Allergen reminder threshold (days)
export const ALLERGEN_REMINDER_DAYS = 14;

// Number of times an allergen needs to be given to be "done"
export const ALLERGEN_DONE_THRESHOLD = 3;
