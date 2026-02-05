import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { DEFAULT_FOODS } from '../lib/constants';
import type { Food, AddFoodForm, Category } from '../lib/types';

export const FOODS_QUERY_KEY = ['foods'];

export function useFoods() {
  return useQuery({
    queryKey: FOODS_QUERY_KEY,
    queryFn: async (): Promise<Food[]> => {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .is('deleted_at', null)
        .order('name');

      if (error) throw error;
      return data as Food[];
    },
  });
}

export function useAddFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ form, userId }: { form: AddFoodForm; userId: string }) => {
      const { data, error } = await supabase
        .from('foods')
        .insert({
          user_id: userId,
          name: form.name,
          category: form.category,
          is_allergen: form.is_allergen,
          is_default: false,
          emoji: form.emoji || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Food;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOODS_QUERY_KEY });
    },
  });
}

export function useUpdateFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      foodId,
      updates,
    }: {
      foodId: string;
      updates: { name?: string; category?: Category; is_allergen?: boolean; emoji?: string };
    }) => {
      const { data, error } = await supabase
        .from('foods')
        .update(updates)
        .eq('id', foodId)
        .select()
        .single();

      if (error) throw error;
      return data as Food;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOODS_QUERY_KEY });
    },
  });
}

export function useDeleteFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (foodId: string) => {
      // Soft delete by setting deleted_at
      const { error } = await supabase
        .from('foods')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', foodId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOODS_QUERY_KEY });
    },
  });
}

export function useSeedDefaultFoods() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      // Check if user already has foods
      const { data: existing } = await supabase
        .from('foods')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (existing && existing.length > 0) {
        return; // User already has foods
      }

      // Insert default foods
      const foodsToInsert = DEFAULT_FOODS.map((food) => ({
        user_id: userId,
        name: food.name,
        category: food.category,
        is_allergen: food.is_allergen,
        is_default: true,
      }));

      const { error } = await supabase.from('foods').insert(foodsToInsert);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOODS_QUERY_KEY });
    },
  });
}
