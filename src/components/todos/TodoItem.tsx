import { format } from 'date-fns';
import { useState, useRef, useEffect } from 'react';
import { Calendar, Trash2, Check, Clock } from 'lucide-react';
import type { Todo } from '../../types';
import { cn } from '../../lib/utils';
import { useProfile } from '../../hooks/useProfile';
import { t } from '../../lib/i18n';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useTodos } from '../../hooks/useTodos';
import { useCategories } from '../../hooks/useCategories';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleComplete, deleteTodo, updateTodo } = useTodos();
  const { categories } = useCategories();
  const { profile } = useProfile();
  const language = profile?.language_preference ?? 'zh-CN';
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // 编辑状态
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingDueDate, setEditingDueDate] = useState(false);
  const [editingPriority, setEditingPriority] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

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

  const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
    if (editingDescription && descInputRef.current) {
      descInputRef.current.focus();
    }
    if (editingDueDate && dateInputRef.current) {
      dateInputRef.current.focus();
    }
  }, [editingTitle, editingDescription, editingDueDate]);

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

  const handleSaveTitle = (value: string) => {
    if (value.trim() && value !== todo.title) {
      updateTodo(todo.id, { title: value.trim() });
    }
    setEditingTitle(false);
  };

  const handleSaveDescription = (value: string) => {
    const trimmed = value.trim();
    if (trimmed !== (todo.description || '')) {
      updateTodo(todo.id, { description: trimmed || null });
    }
    setEditingDescription(false);
  };

  const handleSaveDueDate = (value: string) => {
    if (value) {
      updateTodo(todo.id, { due_date: new Date(value).toISOString() });
    } else {
      updateTodo(todo.id, { due_date: null });
    }
    setEditingDueDate(false);
  };

  const handlePriorityChange = (priority: 'low' | 'medium' | 'high') => {
    updateTodo(todo.id, { priority });
    setEditingPriority(false);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    updateTodo(todo.id, { category_id: categoryId });
    setEditingCategory(false);
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

      <div className="flex-1 space-y-2">
        {/* 标题 - 双击编辑 */}
        <div className="flex items-start justify-between gap-2">
          {editingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              defaultValue={todo.title}
              className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-sm font-medium"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle(e.currentTarget.value);
                if (e.key === 'Escape') setEditingTitle(false);
              }}
              onBlur={(e) => handleSaveTitle(e.currentTarget.value)}
            />
          ) : (
            <span
              onDoubleClick={() => !todo.is_completed && setEditingTitle(true)}
              className={cn(
                "flex-1 font-medium leading-none transition-all cursor-text",
                todo.is_completed && "text-muted-foreground line-through"
              )}
            >
              {todo.title}
            </span>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-0"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* 描述 - 双击编辑 */}
        {editingDescription ? (
          <textarea
            ref={descInputRef}
            defaultValue={todo.description || ''}
            className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setEditingDescription(false);
              if (e.key === 'Enter' && e.ctrlKey) handleSaveDescription(e.currentTarget.value);
            }}
            onBlur={(e) => handleSaveDescription(e.currentTarget.value)}
          />
        ) : (
          <>
            {todo.description && (
              <p
                onDoubleClick={() => !todo.is_completed && setEditingDescription(true)}
                className={cn(
                  "text-sm text-muted-foreground cursor-text",
                  todo.is_completed && "line-through opacity-70"
                )}
              >
                {todo.description}
              </p>
            )}
            {!todo.description && !todo.is_completed && (
              <p
                onDoubleClick={() => setEditingDescription(true)}
                className="text-sm text-muted-foreground italic cursor-text hover:text-muted-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {language === 'zh-CN' ? '双击添加描述...' : 'Double-click to add description...'}
              </p>
            )}
          </>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* 优先级 - 点击切换 */}
          {editingPriority ? (
            <div className="flex gap-1">
              {priorities.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePriorityChange(p)}
                  className={cn(
                    "px-2 py-1 text-xs rounded-md border transition-colors",
                    todo.priority === p
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/50 hover:border-primary"
                  )}
                >
                  {priorityLabels[p]}
                </button>
              ))}
            </div>
          ) : (
            <Badge
              variant={priorityColors[todo.priority]}
              className="capitalize cursor-pointer hover:opacity-80"
              onClick={() => !todo.is_completed && setEditingPriority(true)}
              title={language === 'zh-CN' ? '点击修改优先级' : 'Click to change priority'}
            >
              {priorityLabels[todo.priority]}
            </Badge>
          )}

          {/* 截止日期 - 点击编辑 */}
          {editingDueDate ? (
            <input
              ref={dateInputRef}
              type="date"
              defaultValue={todo.due_date ? new Date(todo.due_date).toISOString().split('T')[0] : ''}
              className="text-xs rounded-md border border-input bg-background px-2 py-1 cursor-pointer text-foreground"
              onChange={(e) => handleSaveDueDate(e.target.value)}
              onBlur={() => setEditingDueDate(false)}
            />
          ) : (
            todo.due_date && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs cursor-pointer hover:bg-muted px-2 py-1 rounded transition-colors",
                  new Date(todo.due_date) < new Date() && !todo.is_completed ? "text-destructive" : "text-foreground/70"
                )}
                onClick={() => !todo.is_completed && setEditingDueDate(true)}
                title={language === 'zh-CN' ? '点击修改日期' : 'Click to change date'}
              >
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(todo.due_date), 'MMM d, yyyy')}</span>
              </div>
            )
          )}

          {!todo.due_date && !todo.is_completed && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setEditingDueDate(true)}
            >
              <Calendar className="h-3 w-3 mr-1" />
              {language === 'zh-CN' ? '添加日期' : 'Add date'}
            </Button>
          )}

          {/* 提醒时间 */}
          {todo.reminder_time && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(todo.reminder_time), 'h:mm a')}</span>
            </div>
          )}

          {/* 分类 - 点击切换 */}
          {editingCategory ? (
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => handleCategoryChange(null)}
                className={cn(
                  "px-2 py-1 text-xs rounded-md border transition-colors",
                  !todo.category_id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/50 hover:border-primary"
                )}
              >
                {language === 'zh-CN' ? '无' : 'None'}
              </button>
              {categories.map((cat: typeof categories[0]) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={cn(
                    "px-2 py-1 text-xs rounded-md border transition-colors",
                    todo.category_id === cat.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/50 hover:border-primary"
                  )}
                  style={todo.category_id === cat.id ? {} : { borderColor: cat.color, color: cat.color }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          ) : (
            todo.category && (
              <Badge
                variant="outline"
                className="text-xs cursor-pointer hover:opacity-80"
                style={{ borderColor: todo.category.color, color: todo.category.color }}
                onClick={() => !todo.is_completed && setEditingCategory(true)}
                title={language === 'zh-CN' ? '点击修改分类' : 'Click to change category'}
              >
                {todo.category.name}
              </Badge>
            )
          )}

          {!todo.category && !todo.is_completed && categories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setEditingCategory(true)}
            >
              {language === 'zh-CN' ? '添加标签' : 'Add tag'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
