import type { Category } from './types';

// Default foods to seed for new users
export const DEFAULT_FOODS: Array<{
  name: string;
  category: Category;
  is_allergen: boolean;
}> = [
  // Allergens (Top 9)
  { name: 'Peanut', category: 'allergens', is_allergen: true },
  { name: 'Tree Nuts', category: 'allergens', is_allergen: true },
  { name: 'Milk', category: 'allergens', is_allergen: true },
  { name: 'Egg', category: 'allergens', is_allergen: true },
  { name: 'Wheat', category: 'allergens', is_allergen: true },
  { name: 'Soy', category: 'allergens', is_allergen: true },
  { name: 'Fish', category: 'allergens', is_allergen: true },
  { name: 'Shellfish', category: 'allergens', is_allergen: true },
  { name: 'Sesame', category: 'allergens', is_allergen: true },

  // Vegetables
  { name: 'Carrot', category: 'vegetables', is_allergen: false },
  { name: 'Sweet Potato', category: 'vegetables', is_allergen: false },
  { name: 'Peas', category: 'vegetables', is_allergen: false },
  { name: 'Green Beans', category: 'vegetables', is_allergen: false },
  { name: 'Squash', category: 'vegetables', is_allergen: false },
  { name: 'Zucchini', category: 'vegetables', is_allergen: false },
  { name: 'Broccoli', category: 'vegetables', is_allergen: false },
  { name: 'Spinach', category: 'vegetables', is_allergen: false },
  { name: 'Avocado', category: 'vegetables', is_allergen: false },
  { name: 'Cauliflower', category: 'vegetables', is_allergen: false },
  { name: 'Beets', category: 'vegetables', is_allergen: false },
  { name: 'Cucumber', category: 'vegetables', is_allergen: false },
  { name: 'Bell Pepper', category: 'vegetables', is_allergen: false },

  // Fruits
  { name: 'Banana', category: 'fruit', is_allergen: false },
  { name: 'Apple', category: 'fruit', is_allergen: false },
  { name: 'Pear', category: 'fruit', is_allergen: false },
  { name: 'Peach', category: 'fruit', is_allergen: false },
  { name: 'Mango', category: 'fruit', is_allergen: false },
  { name: 'Blueberries', category: 'fruit', is_allergen: false },
  { name: 'Strawberries', category: 'fruit', is_allergen: false },
  { name: 'Raspberries', category: 'fruit', is_allergen: false },
  { name: 'Watermelon', category: 'fruit', is_allergen: false },
  { name: 'Cantaloupe', category: 'fruit', is_allergen: false },
  { name: 'Papaya', category: 'fruit', is_allergen: false },
  { name: 'Plum', category: 'fruit', is_allergen: false },
  { name: 'Grapes', category: 'fruit', is_allergen: false },
  { name: 'Kiwi', category: 'fruit', is_allergen: false },

  // Dairy
  { name: 'Yogurt', category: 'dairy', is_allergen: false },
  { name: 'Cheese', category: 'dairy', is_allergen: false },
  { name: 'Cottage Cheese', category: 'dairy', is_allergen: false },
  { name: 'Butter', category: 'dairy', is_allergen: false },
  { name: 'Cream Cheese', category: 'dairy', is_allergen: false },

  // Grains
  { name: 'Rice Cereal', category: 'grains', is_allergen: false },
  { name: 'Oatmeal', category: 'grains', is_allergen: false },
  { name: 'Barley', category: 'grains', is_allergen: false },
  { name: 'Quinoa', category: 'grains', is_allergen: false },
  { name: 'Pasta', category: 'grains', is_allergen: false },
  { name: 'Bread', category: 'grains', is_allergen: false },
  { name: 'Crackers', category: 'grains', is_allergen: false },
  { name: 'Pancakes', category: 'grains', is_allergen: false },

  // Protein
  { name: 'Chicken', category: 'protein', is_allergen: false },
  { name: 'Turkey', category: 'protein', is_allergen: false },
  { name: 'Beef', category: 'protein', is_allergen: false },
  { name: 'Pork', category: 'protein', is_allergen: false },
  { name: 'Lamb', category: 'protein', is_allergen: false },
  { name: 'Salmon', category: 'protein', is_allergen: false },
  { name: 'Cod', category: 'protein', is_allergen: false },
  { name: 'Tilapia', category: 'protein', is_allergen: false },
  { name: 'Tofu', category: 'protein', is_allergen: false },
  { name: 'Lentils', category: 'protein', is_allergen: false },
  { name: 'Black Beans', category: 'protein', is_allergen: false },
  { name: 'Chickpeas', category: 'protein', is_allergen: false },

  // Other
  { name: 'Olive Oil', category: 'other', is_allergen: false },
  { name: 'Coconut', category: 'other', is_allergen: false },
  { name: 'Hummus', category: 'other', is_allergen: false },
  { name: 'Nut Butter', category: 'other', is_allergen: false },
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
    bg: 'bg-yellow-500',
    bgLight: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    dot: 'bg-yellow-400',
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

// Allergen reminder threshold (days)
export const ALLERGEN_REMINDER_DAYS = 14;

// Number of times an allergen needs to be given to be "done"
export const ALLERGEN_DONE_THRESHOLD = 3;
