import { useEffect } from 'react';
import { Trash2, Hash } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useProfile } from '../../hooks/useProfile';
import { t } from '../../lib/i18n';
import { Button } from '../ui/Button';
import { CategoryForm } from './CategoryForm';
import { Spinner } from '../ui/Spinner';

export function CategoryList() {
  const { categories, isLoading, fetchCategories, deleteCategory } = useCategories();
  const { profile } = useProfile();
  const language = profile?.language_preference ?? 'zh-CN';

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">{t(language, 'categoryManageTitle')}</h2>
        <CategoryForm />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t(language, 'categoryYourTitle')}</h3>
        
        {isLoading && categories.length === 0 ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 border rounded-lg border-dashed">
            {t(language, 'categoryEmpty')}
          </p>
        ) : (
          <div className="grid gap-3">
            {categories.map((category, index) => (
              <div
                key={category.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fadeIn"
              >
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card transition-all duration-200 hover:bg-accent/50 hover:scale-[1.01] hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      <Hash className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      if (confirm(t(language, 'categoryDeleteConfirm'))) {
                        deleteCategory(category.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
