'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail } from '@/lib/auth';
import { AuthLayout } from '../components/AuthLayout';
import { AuthInput } from '../components/AuthInput';
import { AuthButton } from '../components/AuthButton';

export default function ResetPasswordPage() {
  const { requestPasswordReset, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    if (!validateEmail(email)) {
      setError('유효한 이메일 형식이 아닙니다.');
      return;
    }

    const result = await requestPasswordReset(email);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || '요청 처리 중 오류가 발생했습니다.');
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="이메일 발송 완료"
        subtitle="비밀번호 재설정 링크를 보내드렸습니다"
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d4af37]/20">
            <svg
              className="h-8 w-8 text-[#d4af37]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <p className="text-white/70">
            <span className="font-medium text-white">{email}</span>
            으로
            <br />
            비밀번호 재설정 링크를 발송했습니다.
          </p>

          <p className="text-sm text-white/50">
            이메일이 도착하지 않았다면 스팸 폴더를 확인해주세요.
          </p>

          <div className="pt-4">
            <Link
              href="/auth/login"
              className="font-medium text-[#d4af37] transition-colors hover:text-[#f4e5c2]"
            >
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="비밀번호 찾기"
      subtitle="가입하신 이메일로 재설정 링크를 보내드립니다"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <AuthInput
          label="이메일"
          name="email"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          autoComplete="email"
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
        />

        <AuthButton type="submit" isLoading={isLoading}>
          재설정 링크 받기
        </AuthButton>

        <div className="text-center text-sm text-white/60">
          비밀번호가 기억나셨나요?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-[#d4af37] transition-colors hover:text-[#f4e5c2]"
          >
            로그인
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
