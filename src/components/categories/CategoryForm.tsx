import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useCategories } from '../../hooks/useCategories';
import { useProfile } from '../../hooks/useProfile';
import { t } from '../../lib/i18n';

const PRESET_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Cyan', value: '#06B6D4' },
];

export function CategoryForm() {
  const { addCategory } = useCategories();
  const { profile } = useProfile();
  const language = profile?.language_preference ?? 'zh-CN';
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    await addCategory({ name, color });
    setName('');
    setColor('#3B82F6');
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="space-y-3">
        <div>
          <label htmlFor="name" className="text-sm font-medium mb-2 block">
            {t(language, 'categoryNameLabel')}
          </label>
          <Input
            id="name"
            placeholder={t(language, 'categoryNamePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="color" className="text-sm font-medium mb-2 block">
            {t(language, 'categoryColorLabel')}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-14 rounded-lg border-2 cursor-pointer bg-background transition-all hover:scale-105"
            />
            <div className="flex-1 flex gap-2 flex-wrap">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setColor(preset.value)}
                  className={`w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-md relative ${
                    color === preset.value ? 'ring-2 ring-offset-2 ring-foreground' : ''
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.name}
                >
                  {color === preset.value && (
                    <Check className="h-4 w-4 text-white absolute inset-0 m-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading || !name.trim()} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        {t(language, 'categoryAdd')}
      </Button>
    </form>
  );
}
