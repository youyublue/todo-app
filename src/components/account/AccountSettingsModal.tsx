import { useState, useEffect } from 'react';
import { User, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useProfile } from '../../hooks/useProfile';
import { t } from '../../lib/i18n';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { toast } from 'react-hot-toast';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export function AccountSettingsModal({ isOpen, onClose, language }: AccountSettingsModalProps) {
  const { profile, updateProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);

  // 用户名表单
  const [fullName, setFullName] = useState('');

  // 修改密码表单
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isOpen && profile) {
      setFullName(profile.full_name || '');
    }
  }, [isOpen, profile]);

  // 更新用户名
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsLoading(true);
    try {
      await updateProfile({ full_name: fullName.trim() });
      toast.success(language === 'zh-CN' ? '用户名更新成功' : 'Name updated successfully');
    } catch (error: any) {
      toast.error(error.message || (language === 'zh-CN' ? '更新失败' : 'Update failed'));
    } finally {
      setIsLoading(false);
    }
  };

  // 修改密码
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
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

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success(language === 'zh-CN' ? '密码修改成功' : 'Password updated successfully');

      // 清空表单
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || (language === 'zh-CN' ? '密码修改失败' : 'Failed to update password'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={language === 'zh-CN' ? '账户设置' : 'Account Settings'}>
      <div className="space-y-6">
        {/* 更新用户名 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">{language === 'zh-CN' ? '用户名' : 'Display Name'}</h3>
          </div>

          <form onSubmit={handleUpdateName} className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === 'zh-CN' ? '新的用户名' : 'New Display Name'}
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={language === 'zh-CN' ? '输入你的用户名' : 'Enter your name'}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading || !fullName.trim()} className="w-full">
              {isLoading ? language === 'zh-CN' ? '更新中...' : 'Updating...' : language === 'zh-CN' ? '更新用户名' : 'Update Name'}
            </Button>
          </form>
        </div>

        {/* 修改密码 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Lock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">{language === 'zh-CN' ? '修改密码' : 'Change Password'}</h3>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-3">
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <Button type="submit" disabled={isLoading || !newPassword || !confirmPassword} className="w-full">
              {isLoading ? language === 'zh-CN' ? '更新中...' : 'Updating...' : language === 'zh-CN' ? '修改密码' : 'Update Password'}
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
