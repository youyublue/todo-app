import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Category } from '../types';
import { toast } from 'react-hot-toast';

type CategoryState = {
  categories: Category[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

export const useCategories = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ categories: data as Category[] });
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      // Don't show toast on initial load to avoid clutter
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: async (newCategory) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('categories')
        .insert({
          ...newCategory,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ categories: [...state.categories, data as Category] }));
      toast.success('Category added');
    } catch (error: any) {
      toast.error('Failed to add category');
      console.error(error);
    }
  },

  deleteCategory: async (id) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
      toast.success('Category deleted');
    } catch (error: any) {
      toast.error('Failed to delete category');
      console.error(error);
    }
  },
}));
