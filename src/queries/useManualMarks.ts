import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { ManualMark } from '../lib/types';
import { CALENDAR_ENTRIES_QUERY_KEY } from './useCalendarEntries';

export const MANUAL_MARKS_QUERY_KEY = ['manual_marks'];

export function useManualMarks() {
  return useQuery({
    queryKey: MANUAL_MARKS_QUERY_KEY,
    queryFn: async (): Promise<ManualMark[]> => {
      const { data, error } = await supabase
        .from('manual_marks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ManualMark[];
    },
  });
}

export function useAddManualMark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ foodId, userId }: { foodId: string; userId: string }) => {
      const { data, error } = await supabase
        .from('manual_marks')
        .insert({
          user_id: userId,
          food_id: foodId,
        })
        .select()
        .single();

      if (error) throw error;
      return data as ManualMark;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANUAL_MARKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CALENDAR_ENTRIES_QUERY_KEY });
    },
  });
}

export function useDeleteManualMark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (markId: string) => {
      const { error } = await supabase
        .from('manual_marks')
        .delete()
        .eq('id', markId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANUAL_MARKS_QUERY_KEY });
    },
  });
}
