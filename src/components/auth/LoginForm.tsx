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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(language === 'zh-CN' ? '请输入有效的邮箱地址' : 'Please enter a valid email address');
      return;
    }

    // 注册时额外的验证
    if (isSignUp) {
      // 密码长度验证
      if (password.length < 6) {
        toast.error(language === 'zh-CN' ? '密码至少需要6个字符' : 'Password must be at least 6 characters');
        return;
      }

      // 密码确认验证
      if (password !== confirmPassword) {
        toast.error(language === 'zh-CN' ? '两次输入的密码不一致' : 'Passwords do not match');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // 先尝试登录，检查邮箱是否已注册
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        console.log('Sign in check:', { signInData, signInError });

        // 如果登录成功（有 session），说明邮箱已注册且密码正确
        if (signInData.session) {
          throw new Error(language === 'zh-CN'
            ? '该邮箱已被注册，请直接登录'
            : 'This email is already registered, please sign in');
        }

        // 注册用户
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        console.log('Sign up result:', { data, error });

        // 处理各种错误情况
        if (error) {
          console.log('Sign up error:', error.message);
          // 邮箱已存在的各种错误消息
          if (error.message.includes('User already registered') ||
              error.message.includes('already been registered') ||
              error.message.includes('already been taken') ||
              error.message.includes('A user with this email address has already been registered') ||
              error.message.includes('duplicate') ||
              error.message.includes('already_exists')) {
            throw new Error(language === 'zh-CN'
              ? '该邮箱已被注册，请直接登录'
              : 'This email is already registered, please sign in');
          }
          throw error;
        }

        // 如果 signUp 返回了已存在的用户但没有错误
        // 这通常发生在邮箱已注册但未验证的情况
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          throw new Error(language === 'zh-CN'
            ? '该邮箱已被注册，请直接登录'
            : 'This email is already registered, please sign in');
        }

        // 如果有 session，说明自动登录成功（邮箱验证已关闭）
        if (data.session) {
          toast.success(language === 'zh-CN' ? '注册成功！' : 'Registration successful!');
          await initialize();
          navigate('/', { replace: true });
          onSuccess?.();
        } else if (data.user) {
          // 如果有 user 但没有 session，尝试自动登录
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (loginData.session && !loginError) {
            toast.success(language === 'zh-CN' ? '注册成功！' : 'Registration successful!');
            await initialize();
            navigate('/', { replace: true });
            onSuccess?.();
          } else {
            // 真的需要邮箱验证的情况
            toast.success(t(language, 'registrationSuccess'));
          }
        }
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
        {isSignUp && (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="confirmPassword">
              {language === 'zh-CN' ? '确认密码' : 'Confirm Password'}
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={language === 'zh-CN' ? '再次输入密码' : 'Enter password again'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
        )}
        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isSignUp ? t(language, 'signUp') : t(language, 'signIn')}
        </Button>
      </form>

      <div className="text-center text-sm">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setConfirmPassword(''); // 切换模式时清空确认密码
          }}
          className="text-primary hover:underline"
          disabled={isLoading}
        >
          {isSignUp ? t(language, 'signupSwitch') : t(language, 'signinSwitch')}
        </button>
      </div>
    </div>
  );
}
