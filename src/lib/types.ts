// Database types matching Supabase schema

export interface Profile {
  id: string;
  baby_name: string | null;
  created_at: string;
}

export interface Food {
  id: string;
  user_id: string;
  name: string;
  category: Category;
  is_allergen: boolean;
  is_default: boolean;
  created_at: string;
  deleted_at: string | null;
}

export interface CalendarEntry {
  id: string;
  user_id: string;
  food_id: string;
  date: string; // ISO date string YYYY-MM-DD
  texture: Texture;
  notes: string | null;
  reaction: string | null;
  created_at: string;
}

export interface ManualMark {
  id: string;
  user_id: string;
  food_id: string;
  created_at: string;
}

// Enums and constants
export const TEXTURES = [
  'puree',
  'paste',
  'mashed',
  'soft chunks',
  'finger food',
  'mixed'
] as const;

export type Texture = typeof TEXTURES[number];

export const CATEGORIES = {
  allergens: { icon: '⚠️', color: 'red', label: 'Allergens' },
  vegetables: { icon: '🥕', color: 'green', label: 'Vegetables' },
  fruit: { icon: '🍎', color: 'pink', label: 'Fruit' },
  dairy: { icon: '🧀', color: 'yellow', label: 'Dairy' },
  grains: { icon: '🌾', color: 'amber', label: 'Grains' },
  protein: { icon: '🍖', color: 'brown', label: 'Protein' },
  other: { icon: '🫒', color: 'gray', label: 'Other' },
} as const;

export type Category = keyof typeof CATEGORIES;

export const CATEGORY_ORDER: Category[] = [
  'allergens',
  'vegetables',
  'fruit',
  'dairy',
  'grains',
  'protein',
  'other'
];

// Derived state types
export type FoodStatusType = 'nothing' | 'started' | 'done';

export interface FoodStatus {
  timesGiven: number;
  lastGivenDate: string | null;
  status: FoodStatusType;
  hasPlanned: boolean;
  needsReminder: boolean;
}

export interface ChecklistFood extends Food {
  foodStatus: FoodStatus;
}

export interface CategoryGroup {
  category: Category;
  foods: ChecklistFood[];
  doneCount: number;
  totalCount: number;
}

// Form types
export interface AddEntryForm {
  food_id: string;
  date: string;
  texture: Texture;
  notes: string;
  reaction: string;
}

export interface AddFoodForm {
  name: string;
  category: Category;
  is_allergen: boolean;
}

// Calendar types
export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  entries: CalendarEntryWithFood[];
}

export interface CalendarEntryWithFood extends CalendarEntry {
  food: Food;
}
