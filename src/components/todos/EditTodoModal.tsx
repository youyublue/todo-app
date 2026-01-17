import { useState, useEffect } from 'react';
import { Flag, Hash } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useCategories } from '../../hooks/useCategories';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { CustomSelect } from '../ui/CustomSelect';
import { toast } from 'react-hot-toast';
import type { Todo, TodoPriority } from '../../types';

interface EditTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo | null;
  onUpdate: () => void;
  language: string;
}

export function EditTodoModal({ isOpen, onClose, todo, onUpdate, language }: EditTodoModalProps) {
  const { categories, fetchCategories } = useCategories();
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [categoryId, setCategoryId] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setPriority(todo.priority);
      setCategoryId(todo.category_id || '');
      setDueDate(todo.due_date ? todo.due_date.split('T')[0] : '');
    }
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo || !title.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('todos')
        .update({
          title: title.trim(),
          description: description || null,
          priority,
          category_id: categoryId || null,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
        })
        .eq('id', todo.id);

      if (error) throw error;

      toast.success(language === 'zh-CN' ? '任务更新成功' : 'Task updated successfully');
      onUpdate();
      onClose();

      // 重置表单
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategoryId('');
      setDueDate('');
    } catch (error: any) {
      toast.error(error.message || (language === 'zh-CN' ? '更新失败' : 'Failed to update task'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={language === 'zh-CN' ? '编辑任务' : 'Edit Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{language === 'zh-CN' ? '任务标题' : 'Title'}</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={language === 'zh-CN' ? '输入任务标题' : 'Enter task title'}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{language === 'zh-CN' ? '备注' : 'Description'}</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={language === 'zh-CN' ? '添加备注（可选）' : 'Add description (optional)'}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{language === 'zh-CN' ? '优先级' : 'Priority'}</label>
          <CustomSelect
            value={priority}
            onChange={(value) => setPriority(value as TodoPriority)}
            options={[
              { value: 'low', label: language === 'zh-CN' ? '低' : 'Low' },
              { value: 'medium', label: language === 'zh-CN' ? '中' : 'Medium' },
              { value: 'high', label: language === 'zh-CN' ? '高' : 'High' },
            ]}
            placeholder={language === 'zh-CN' ? '选择优先级' : 'Select priority'}
            icon={<Flag className="h-4 w-4" />}
            className={`${
              priority !== 'medium'
                ? priority === 'high'
                  ? 'text-destructive bg-destructive/10'
                  : 'text-info bg-info/10'
                : 'text-muted-foreground'
            }`}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{language === 'zh-CN' ? '分类' : 'Category'}</label>
          <CustomSelect
            value={categoryId}
            onChange={setCategoryId}
            options={[
              { value: '', label: language === 'zh-CN' ? '无分类' : 'No Category' },
              ...categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
                color: cat.color,
              })),
            ]}
            placeholder={language === 'zh-CN' ? '选择分类' : 'Select category'}
            icon={<Hash className="h-4 w-4" />}
            className={categoryId ? 'bg-primary/10' : 'text-muted-foreground'}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{language === 'zh-CN' ? '截止日期' : 'Due Date'}</label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {language === 'zh-CN' ? '取消' : 'Cancel'}
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="flex-1"
          >
            {isLoading ? language === 'zh-CN' ? '保存中...' : 'Saving...' : language === 'zh-CN' ? '保存' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
