'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getCurrentUserProfile } from '@/actions/profiles';
import { AuthLayout } from '../components/AuthLayout';
import { AuthInput } from '../components/AuthInput';
import { AuthButton } from '../components/AuthButton';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
    clearError();
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = '이메일을 입력해주세요.';
    }
    if (!formData.password) {
      errors.password = '비밀번호를 입력해주세요.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await signIn({
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      // Check for redirect parameter
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        router.push(redirectUrl);
        return;
      }

      // Check if user is a pro and needs onboarding
      // The user data is fetched after sign in success
      const profileResult = await getCurrentUserProfile();
      if (profileResult.success && !profileResult.data) {
        // Pro user without profile - redirect to quick setup
        router.push('/onboarding/quick-setup');
        return;
      }

      // Default redirect
      router.push('/dashboard');
    }
  };

  return (
    <AuthLayout
      title="로그인"
      subtitle="TEE:UP 계정으로 로그인하세요"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div role="alert" aria-live="polite" className="alert-error">
            {error}
          </div>
        )}

        <AuthInput
          label="이메일"
          name="email"
          type="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          error={formErrors.email}
          autoComplete="email"
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
        />

        <AuthInput
          label="비밀번호"
          name="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleChange}
          error={formErrors.password}
          autoComplete="current-password"
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />

        <div className="flex items-center justify-between text-body-sm">
          <label className="flex cursor-pointer items-center gap-2 text-tee-ink-light">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-tee-stone bg-white text-accent focus:outline-none focus:ring-2 focus:ring-accent-light"
            />
            로그인 상태 유지
          </label>
          <Link
            href="/auth/reset-password"
            className="rounded px-1 text-accent transition-colors hover:text-accent-dark focus:outline-none focus:ring-2 focus:ring-accent-light"
          >
            비밀번호 찾기
          </Link>
        </div>

        <AuthButton type="submit" isLoading={isLoading}>
          로그인
        </AuthButton>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-tee-stone" />
          </div>
          <div className="relative flex justify-center text-body-sm">
            <span className="bg-tee-surface px-4 text-tee-ink-muted">또는</span>
          </div>
        </div>

        <div className="text-center text-body-sm text-tee-ink-light">
          계정이 없으신가요?{' '}
          <Link
            href="/auth/signup"
            className="rounded px-1 font-medium text-accent transition-colors hover:text-accent-dark focus:outline-none focus:ring-2 focus:ring-accent-light"
          >
            회원가입
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
