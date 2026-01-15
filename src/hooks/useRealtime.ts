import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTodos } from './useTodos';
import { useCategories } from './useCategories';
import { useAuth } from '../contexts/AuthContext';

export function useRealtime() {
  const { user } = useAuth();
  const { fetchTodos } = useTodos();
  const { fetchCategories } = useCategories();

  useEffect(() => {
    if (!user) return;

    // Channel for Todos
    const todoChannel = supabase
      .channel('public:todos')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Ideally we would optimistically update the state here based on payload
          // But refetching is safer for ensuring consistency, though slightly slower
          console.log('Todo change received!', payload);
          fetchTodos();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to Todo changes');
        }
      });

    // Channel for Categories
    const categoryChannel = supabase
      .channel('public:categories')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Category change received!', payload);
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(todoChannel);
      supabase.removeChannel(categoryChannel);
    };
  }, [user, fetchTodos, fetchCategories]);
}
