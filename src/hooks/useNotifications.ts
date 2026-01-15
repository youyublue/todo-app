import { useEffect, useRef } from 'react';
import { useTodos } from './useTodos';
import { toast } from 'react-hot-toast';

export function useNotifications() {
  const { todos } = useTodos();
  const notifiedTasks = useRef<Set<string>>(new Set());

  // Request permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Check for due tasks every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      todos.forEach((todo) => {
        if (!todo.reminder_time || todo.is_completed) return;
        
        const reminderTime = new Date(todo.reminder_time);
        const timeDiff = reminderTime.getTime() - now.getTime();
        
        // Notify if within 1 minute (and not in the past by more than 1 min)
        // 60000ms = 1 minute
        if (timeDiff <= 60000 && timeDiff > -60000) {
          if (notifiedTasks.current.has(todo.id)) return;

          notifiedTasks.current.add(todo.id);

          // Browser Notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Task Reminder', {
              body: `Reminder: ${todo.title}`,
              icon: '/vite.svg', // Just a placeholder
            });
          }

          // Toast fallback
          toast(`Reminder: ${todo.title}`, {
            icon: '⏰',
            duration: 5000,
          });
        }
      });
    };

    const intervalId = setInterval(checkReminders, 30000); // Check every 30s
    checkReminders(); // Check immediately

    return () => clearInterval(intervalId);
  }, [todos]);
}
