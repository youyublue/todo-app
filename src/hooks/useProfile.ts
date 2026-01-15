import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';
import { toast } from 'react-hot-toast';

type ProfileState = {
  profile: Profile | null;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  updateLanguage: (language: Profile['language_preference']) => Promise<void>;
};

export const useProfile = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      set({ profile: data as Profile });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateLanguage: async (language) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({ language_preference: language })
        .eq('id', user.id);

      if (error) throw error;

      set((state) => ({
        profile: state.profile ? { ...state.profile, language_preference: language } : state.profile,
      }));
      toast.success('语言已更新');
    } catch (error: any) {
      toast.error('更新语言失败');
      console.error(error);
    }
  },
}));
