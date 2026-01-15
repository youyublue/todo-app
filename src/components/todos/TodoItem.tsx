import { format } from 'date-fns';
import { useState } from 'react';
import { Calendar, Trash2, Check, Clock } from 'lucide-react';
import type { Todo } from '../../types';
import { cn } from '../../lib/utils';
import { useProfile } from '../../hooks/useProfile';
import { t } from '../../lib/i18n';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useTodos } from '../../hooks/useTodos';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleComplete, deleteTodo } = useTodos();
  const { profile } = useProfile();
  const language = profile?.language_preference ?? 'zh-CN';
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const priorityLabels = {
    low: t(language, 'lowPriority'),
    medium: t(language, 'mediumPriority'),
    high: t(language, 'highPriority'),
  } as const;

  const priorityColors = {
    low: 'info',
    medium: 'warning',
    high: 'destructive',
  } as const;

  const handleToggleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
      toggleComplete(todo.id, !todo.is_completed);
      setIsCompleting(false);
    }, 300);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteTodo(todo.id);
    }, 300);
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-lg border bg-card p-4 transition-all duration-300 hover:shadow-sm animate-fadeIn hover:scale-[1.01]",
        todo.is_completed && "bg-muted/50",
        isDeleting && "animate-fadeOut",
        isCompleting && todo.is_completed && "animate-bounce"
      )}
    >
      <button
        onClick={handleToggleComplete}
        className={cn(
          "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:scale-110 active:scale-95",
          todo.is_completed
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground hover:border-primary"
        )}
      >
        {todo.is_completed && <Check className="h-3.5 w-3.5 animate-checkmark" />}
      </button>

      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <span 
            className={cn(
              "font-medium leading-none transition-all",
              todo.is_completed && "text-muted-foreground line-through"
            )}
          >
            {todo.title}
          </span>
          <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {todo.description && (
          <p className={cn(
            "text-sm text-muted-foreground",
            todo.is_completed && "line-through opacity-70"
          )}>
            {todo.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant={priorityColors[todo.priority]} className="capitalize">
            {priorityLabels[todo.priority]}
          </Badge>

          {todo.due_date && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              new Date(todo.due_date) < new Date() && !todo.is_completed ? "text-destructive" : "text-muted-foreground"
            )}>
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(todo.due_date), 'MMM d, yyyy')}</span>
            </div>
          )}

          {todo.reminder_time && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(todo.reminder_time), 'h:mm a')}</span>
            </div>
          )}
          
          {todo.categories && (
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ borderColor: todo.categories.color, color: todo.categories.color }}
            >
              {todo.categories.name}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
