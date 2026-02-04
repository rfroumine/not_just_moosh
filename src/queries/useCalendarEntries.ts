import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { CalendarEntry, CalendarEntryWithFood, AddEntryForm, Texture } from '../lib/types';
import { FOODS_QUERY_KEY } from './useFoods';

export const CALENDAR_ENTRIES_QUERY_KEY = ['calendar_entries'];

export function useCalendarEntries() {
  return useQuery({
    queryKey: CALENDAR_ENTRIES_QUERY_KEY,
    queryFn: async (): Promise<CalendarEntry[]> => {
      const { data, error } = await supabase
        .from('calendar_entries')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as CalendarEntry[];
    },
  });
}

export function useCalendarEntriesWithFoods() {
  return useQuery({
    queryKey: [...CALENDAR_ENTRIES_QUERY_KEY, 'with_foods'],
    queryFn: async (): Promise<CalendarEntryWithFood[]> => {
      const { data, error } = await supabase
        .from('calendar_entries')
        .select(`
          *,
          food:foods(*)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      return data as CalendarEntryWithFood[];
    },
  });
}

export function useEntriesByDate(date: string | null) {
  return useQuery({
    queryKey: [...CALENDAR_ENTRIES_QUERY_KEY, 'by_date', date],
    queryFn: async (): Promise<CalendarEntryWithFood[]> => {
      if (!date) return [];

      const { data, error } = await supabase
        .from('calendar_entries')
        .select(`
          *,
          food:foods(*)
        `)
        .eq('date', date)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CalendarEntryWithFood[];
    },
    enabled: !!date,
  });
}

export function useAddCalendarEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ form, userId }: { form: AddEntryForm; userId: string }) => {
      const { data, error } = await supabase
        .from('calendar_entries')
        .insert({
          user_id: userId,
          food_id: form.food_id,
          date: form.date,
          texture: form.texture,
          notes: form.notes || null,
          reaction: form.reaction || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as CalendarEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_ENTRIES_QUERY_KEY });
    },
  });
}

export function useUpdateCalendarEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      entryId,
      updates,
    }: {
      entryId: string;
      updates: { texture?: Texture; notes?: string | null; reaction?: string | null };
    }) => {
      const { data, error } = await supabase
        .from('calendar_entries')
        .update(updates)
        .eq('id', entryId)
        .select()
        .single();

      if (error) throw error;
      return data as CalendarEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_ENTRIES_QUERY_KEY });
    },
  });
}

export function useDeleteCalendarEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: string) => {
      const { error } = await supabase
        .from('calendar_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_ENTRIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: FOODS_QUERY_KEY });
    },
  });
}
