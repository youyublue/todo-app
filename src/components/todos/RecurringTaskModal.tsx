import { useState, useEffect } from 'react';
import { t } from '../../lib/i18n';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export type RecurrenceFormValues = {
  mode: 'scheduled' | 'after_completion';
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  startDate: string;
  reminderTime: string;
};

interface RecurringTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: RecurrenceFormValues | null;
  onSave: (value: RecurrenceFormValues | null) => void;
  language: 'zh-CN' | 'en-US';
}

const defaultValues: RecurrenceFormValues = {
  mode: 'scheduled',
  frequency: 'daily',
  interval: 1,
  startDate: '',
  reminderTime: '',
};

export function RecurringTaskModal({ isOpen, onClose, value, onSave, language }: RecurringTaskModalProps) {
  const [formValues, setFormValues] = useState<RecurrenceFormValues>(value ?? defaultValues);

  useEffect(() => {
    setFormValues(value ?? defaultValues);
  }, [value]);

  const updateField = <K extends keyof RecurrenceFormValues>(key: K, newValue: RecurrenceFormValues[K]) => {
    setFormValues((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleSave = () => {
    onSave({
      ...formValues,
      interval: Math.max(1, Number(formValues.interval) || 1),
    });
    onClose();
  };

  const handleClear = () => {
    onSave(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t(language, 'repeatTitle')}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t(language, 'repeatMode')}</label>
          <div className="flex gap-2">
            <button
              type="button"
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${formValues.mode === 'scheduled' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'}`}
              onClick={() => updateField('mode', 'scheduled')}
            >
              {t(language, 'repeatScheduled')}
            </button>
            <button
              type="button"
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${formValues.mode === 'after_completion' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'}`}
              onClick={() => updateField('mode', 'after_completion')}
            >
              {t(language, 'repeatAfterCompletion')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t(language, 'repeatFrequency')}</label>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={formValues.frequency}
              onChange={(e) => updateField('frequency', e.target.value as RecurrenceFormValues['frequency'])}
            >
              <option value="daily">{t(language, 'repeatDaily')}</option>
              <option value="weekly">{t(language, 'repeatWeekly')}</option>
              <option value="monthly">{t(language, 'repeatMonthly')}</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t(language, 'repeatInterval')}</label>
            <input
              type="number"
              min={1}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={formValues.interval}
              onChange={(e) => updateField('interval', Number(e.target.value))}
            />
          </div>
        </div>

        {formValues.mode === 'scheduled' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">{t(language, 'repeatStartDate')}</label>
            <input
              type="date"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={formValues.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{t(language, 'repeatStartDateHint')}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">{t(language, 'repeatReminderTime')}</label>
          <input
            type="time"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={formValues.reminderTime}
            onChange={(e) => updateField('reminderTime', e.target.value)}
          />
        </div>

        <div className="flex justify-between gap-2 pt-2">
          <Button variant="ghost" onClick={handleClear}>
            {t(language, 'repeatClear')}
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              {t(language, 'repeatCancel')}
            </Button>
            <Button onClick={handleSave}>
              {t(language, 'repeatSave')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
