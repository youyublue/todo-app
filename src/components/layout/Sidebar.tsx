import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  ListTodo,
  LogOut,
  Hash,
  Star,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { t } from '../../lib/i18n';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { ThemeToggle } from './ThemeToggle';
import { AccountSettingsModal } from '../account/AccountSettingsModal';

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const { signOut, user } = useAuth();
  const { profile, fetchProfile, updateLanguage, isLoading } = useProfile();
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const languageValue = profile?.language_preference ?? 'zh-CN';

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const languageValue = profile?.language_preference ?? 'zh-CN';

  const links = [
    { to: '/', icon: LayoutDashboard, label: t(languageValue, 'dashboard') },
    { to: '/today', icon: ListTodo, label: t(languageValue, 'today') },
    { to: '/upcoming', icon: Calendar, label: t(languageValue, 'upcoming') },
    { to: '/important', icon: Star, label: t(languageValue, 'important') },
  ];

  return (
    <aside className={cn("flex h-screen w-64 flex-col border-r bg-card px-3 py-4", className)}>
      <div className="mb-8 flex items-center px-2 justify-between">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ListTodo className="h-5 w-5" />
          </div>
          <span className="ml-3 text-lg font-bold">{t(languageValue, 'appName')}</span>
        </div>
        {/* Mobile close button if needed, though usually handled by overlay */}
      </div>

      <div className="flex-1 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98]",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )
            }
          >
            <link.icon className="mr-3 h-4 w-4" />
            {link.label}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t">
          <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t(languageValue, 'categories')}
          </p>
          <NavLink
            to="/categories"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98]",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )
            }
          >
            <Hash className="mr-3 h-4 w-4" />
            {t(languageValue, 'manageCategories')}
          </NavLink>
        </div>
      </div>

      <div className="border-t pt-4 space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate max-w-[100px]">
                {profile?.full_name || user?.email?.split('@')[0]}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                {user?.email}
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-medium text-muted-foreground">{t(languageValue, 'language')}</span>
          <select
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            value={languageValue}
            onChange={(e) => updateLanguage(e.target.value as 'zh-CN' | 'en-US')}
            disabled={!user || isLoading}
          >
            <option value="zh-CN">中文</option>
            <option value="en-US">English</option>
          </select>
        </div>

        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground"
          onClick={() => setIsAccountSettingsOpen(true)}
        >
          <Settings className="mr-2 h-4 w-4" />
          {languageValue === 'zh-CN' ? '账户设置' : 'Account Settings'}
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t(languageValue, 'signOut')}
        </Button>
      </div>

      <AccountSettingsModal
        isOpen={isAccountSettingsOpen}
        onClose={() => setIsAccountSettingsOpen(false)}
        language={languageValue}
      />
    </aside>
  );
}
