import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Food, CalendarEntry, ManualMark, CategoryGroup } from '../lib/types';
import { buildChecklist, groupByCategory, calculateSummary } from '../utils/deriveChecklist';

export const CHECKLIST_QUERY_KEY = ['checklist'];

interface ChecklistData {
  groups: CategoryGroup[];
  summary: {
    totalDone: number;
    totalCount: number;
    categoryStats: Array<{
      category: string;
      done: number;
      total: number;
      icon: string;
    }>;
  };
  isLoading: boolean;
  error: Error | null;
}

export function useChecklist(): ChecklistData {
  const { data, isLoading, error } = useQuery({
    queryKey: CHECKLIST_QUERY_KEY,
    queryFn: async () => {
      // Fetch all data in parallel
      const [foodsResult, entriesResult, marksResult] = await Promise.all([
        supabase
          .from('foods')
          .select('*')
          .is('deleted_at', null)
          .order('name'),
        supabase
          .from('calendar_entries')
          .select('*')
          .order('date', { ascending: false }),
        supabase
          .from('manual_marks')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      if (foodsResult.error) throw foodsResult.error;
      if (entriesResult.error) throw entriesResult.error;
      if (marksResult.error) throw marksResult.error;

      const foods = foodsResult.data as Food[];
      const entries = entriesResult.data as CalendarEntry[];
      const marks = marksResult.data as ManualMark[];

      // Build checklist with derived state
      const checklistFoods = buildChecklist(foods, entries, marks);
      const groups = groupByCategory(checklistFoods);
      const summary = calculateSummary(groups);

      return { groups, summary };
    },
  });

  return {
    groups: data?.groups || [],
    summary: data?.summary || { totalDone: 0, totalCount: 0, categoryStats: [] },
    isLoading,
    error: error as Error | null,
  };
}
