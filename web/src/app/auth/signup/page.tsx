'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail, validatePassword, validatePhone } from '@/lib/auth';
import { AuthLayout } from '../components/AuthLayout';
import { AuthInput } from '../components/AuthInput';
import { AuthButton } from '../components/AuthButton';
import type { UserRole } from '@/types';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'golfer' as UserRole,
    agreeTerms: false,
    agreePrivacy: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
    clearError();
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      errors.full_name = '이름을 입력해주세요.';
    }

    if (!formData.email) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!validateEmail(formData.email)) {
      errors.email = '유효한 이메일 형식이 아닙니다.';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = '유효한 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
    }

    if (!formData.password) {
      errors.password = '비밀번호를 입력해주세요.';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.errors[0];
      }
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = '이용약관에 동의해주세요.';
    }

    if (!formData.agreePrivacy) {
      errors.agreePrivacy = '개인정보처리방침에 동의해주세요.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await signUp({
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone || undefined,
      password: formData.password,
      role: formData.role,
    });

    if (result.success) {
      router.push('/auth/verify-email');
    }
  };

  return (
    <AuthLayout
      title="회원가입"
      subtitle="TEE:UP에서 최고의 프로를 만나보세요"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* 사용자 유형 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/80">
            가입 유형
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`
                flex cursor-pointer items-center justify-center rounded-lg border p-4
                transition-all duration-200
                ${
                  formData.role === 'golfer'
                    ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]'
                    : 'border-white/10 text-white/60 hover:border-white/30'
                }
              `}
            >
              <input
                type="radio"
                name="role"
                value="golfer"
                checked={formData.role === 'golfer'}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="font-medium">골퍼</span>
            </label>
            <label
              className={`
                flex cursor-pointer items-center justify-center rounded-lg border p-4
                transition-all duration-200
                ${
                  formData.role === 'pro'
                    ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]'
                    : 'border-white/10 text-white/60 hover:border-white/30'
                }
              `}
            >
              <input
                type="radio"
                name="role"
                value="pro"
                checked={formData.role === 'pro'}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="font-medium">프로 골퍼</span>
            </label>
          </div>
        </div>

        <AuthInput
          label="이름"
          name="full_name"
          type="text"
          placeholder="홍길동"
          value={formData.full_name}
          onChange={handleChange}
          error={formErrors.full_name}
          autoComplete="name"
        />

        <AuthInput
          label="이메일"
          name="email"
          type="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          error={formErrors.email}
          autoComplete="email"
        />

        <AuthInput
          label="전화번호 (선택)"
          name="phone"
          type="tel"
          placeholder="010-1234-5678"
          value={formData.phone}
          onChange={handleChange}
          error={formErrors.phone}
          autoComplete="tel"
        />

        <AuthInput
          label="비밀번호"
          name="password"
          type="password"
          placeholder="영문, 숫자, 특수문자 포함 8자 이상"
          value={formData.password}
          onChange={handleChange}
          error={formErrors.password}
          autoComplete="new-password"
        />

        <AuthInput
          label="비밀번호 확인"
          name="confirmPassword"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={formErrors.confirmPassword}
          autoComplete="new-password"
        />

        {/* 약관 동의 */}
        <div className="space-y-3">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-white/60">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-[#d4af37] focus:ring-[#d4af37]/20"
            />
            <span>
              <Link href="/terms" className="text-[#d4af37] hover:underline">
                이용약관
              </Link>
              에 동의합니다. (필수)
            </span>
          </label>
          {formErrors.agreeTerms && (
            <p className="ml-7 text-sm text-red-400">{formErrors.agreeTerms}</p>
          )}

          <label className="flex cursor-pointer items-start gap-3 text-sm text-white/60">
            <input
              type="checkbox"
              name="agreePrivacy"
              checked={formData.agreePrivacy}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-[#d4af37] focus:ring-[#d4af37]/20"
            />
            <span>
              <Link href="/privacy" className="text-[#d4af37] hover:underline">
                개인정보처리방침
              </Link>
              에 동의합니다. (필수)
            </span>
          </label>
          {formErrors.agreePrivacy && (
            <p className="ml-7 text-sm text-red-400">{formErrors.agreePrivacy}</p>
          )}
        </div>

        <AuthButton type="submit" isLoading={isLoading}>
          회원가입
        </AuthButton>

        <div className="text-center text-sm text-white/60">
          이미 계정이 있으신가요?{' '}
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
