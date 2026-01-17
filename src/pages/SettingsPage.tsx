import { useState } from 'react';
import { Lock, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useProfile } from '../hooks/useProfile';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from 'react-hot-toast';

export function SettingsPage() {
  const { profile, updateLanguage } = useProfile();
  const language = profile?.language_preference ?? 'zh-CN';
  const [isUpdating, setIsUpdating] = useState(false);

  // 修改密码表单
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error(language === 'zh-CN' ? '请填写所有字段' : 'Please fill all fields');
      return;
    }

    if (newPassword.length < 6) {
      toast.error(language === 'zh-CN' ? '新密码至少需要6个字符' : 'New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(language === 'zh-CN' ? '两次输入的密码不一致' : 'Passwords do not match');
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success(language === 'zh-CN' ? '密码修改成功' : 'Password updated successfully');

      // 清空表单
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || (language === 'zh-CN' ? '密码修改失败' : 'Failed to update password'));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {language === 'zh-CN' ? '设置' : 'Settings'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'zh-CN' ? '管理您的账户设置和偏好' : 'Manage your account settings and preferences'}
        </p>
      </div>

      {/* 语言设置 */}
      <div className="bg-card rounded-lg border p-6 space-y-4 animate-fadeIn" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-2 pb-2 border-b">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">
            {language === 'zh-CN' ? '语言设置' : 'Language Settings'}
          </h3>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {language === 'zh-CN' ? '选择您偏好的界面语言' : 'Select your preferred interface language'}
          </p>
          <div className="flex items-center gap-3">
            <select
              className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={language}
              onChange={(e) => updateLanguage(e.target.value as 'zh-CN' | 'en-US')}
              disabled={isUpdating}
            >
              <option value="zh-CN">中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* 修改密码 */}
      <div className="bg-card rounded-lg border p-6 space-y-4 animate-fadeIn" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-2 pb-2 border-b">
          <Lock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">
            {language === 'zh-CN' ? '修改密码' : 'Change Password'}
          </h3>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === 'zh-CN' ? '新密码' : 'New Password'}
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={language === 'zh-CN' ? '至少6个字符' : 'At least 6 characters'}
              minLength={6}
              disabled={isUpdating}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === 'zh-CN' ? '确认新密码' : 'Confirm New Password'}
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={language === 'zh-CN' ? '再次输入新密码' : 'Enter new password again'}
              minLength={6}
              disabled={isUpdating}
            />
          </div>

          <Button type="submit" disabled={isUpdating || !newPassword || !confirmPassword}>
            {isUpdating
              ? language === 'zh-CN' ? '更新中...' : 'Updating...'
              : language === 'zh-CN' ? '修改密码' : 'Update Password'
            }
          </Button>
        </form>
      </div>
    </div>
  );
}
