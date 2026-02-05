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
    mutationFn: async ({ foodId, userId, isAutoComplete = false }: { foodId: string; userId: string; isAutoComplete?: boolean }) => {
      const { data, error } = await supabase
        .from('manual_marks')
        .insert({
          user_id: userId,
          food_id: foodId,
          is_auto_complete: isAutoComplete,
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

export function useAddMultipleManualMarks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ foodId, userId, count, isAutoComplete = false }: { foodId: string; userId: string; count: number; isAutoComplete?: boolean }) => {
      const marks = Array(count).fill(null).map(() => ({
        user_id: userId,
        food_id: foodId,
        is_auto_complete: isAutoComplete,
      }));

      const { data, error } = await supabase
        .from('manual_marks')
        .insert(marks)
        .select();

      if (error) throw error;
      return data as ManualMark[];
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

export function useRemoveManualMarksForFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (foodId: string) => {
      const { error } = await supabase
        .from('manual_marks')
        .delete()
        .eq('food_id', foodId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANUAL_MARKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CALENDAR_ENTRIES_QUERY_KEY });
    },
  });
}

export function useRemoveAutoCompleteMarksForFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (foodId: string) => {
      const { error } = await supabase
        .from('manual_marks')
        .delete()
        .eq('food_id', foodId)
        .eq('is_auto_complete', true);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANUAL_MARKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CALENDAR_ENTRIES_QUERY_KEY });
    },
  });
}
