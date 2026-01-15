import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../contexts/AuthContext';
import { t } from '../../lib/i18n';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { toast } from 'react-hot-toast';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { initialize } = useAuth();
  const language = profile?.language_preference ?? 'zh-CN';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success(t(language, 'registrationSuccess'));
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success(t(language, 'loginSuccess'));

        // 重新初始化认证状态
        await initialize();

        // 跳转到首页
        navigate('/', { replace: true });

        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.message || t(language, 'authFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 p-4 animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold animate-fadeIn">{isSignUp ? t(language, 'loginTitleSignup') : t(language, 'loginTitleSignin')}</h2>
        <p className="text-muted-foreground mt-2 animate-fadeIn" style={{ animationDelay: '100ms' }}>
          {isSignUp ? t(language, 'loginSubtitleSignup') : t(language, 'loginSubtitleSignin')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn" style={{ animationDelay: '200ms' }}>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
            {t(language, 'emailLabel')}
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
            {t(language, 'passwordLabel')}
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isSignUp ? t(language, 'signUp') : t(language, 'signIn')}
        </Button>
      </form>

      <div className="text-center text-sm">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary hover:underline"
          disabled={isLoading}
        >
          {isSignUp ? t(language, 'signupSwitch') : t(language, 'signinSwitch')}
        </button>
      </div>
    </div>
  );
}
