/**
 * 사용자 인증 라이브러리
 * @description Supabase Auth를 사용한 인증 기능
 */

import { createClient } from '@/lib/supabase/client';
import type { IUser, ISignUpData, ILoginCredentials, UserRole } from '@/types';

// ============================================
// Types
// ============================================

export interface IAuthResult {
  success: boolean;
  data?: {
    user: IUser;
    session?: unknown;
  };
  error?: {
    code: string;
    message: string;
  };
}

// ============================================
// Error Codes
// ============================================

export const AUTH_ERROR_CODES = {
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_EMAIL: 'INVALID_EMAIL',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// ============================================
// Validation
// ============================================

/**
 * 이메일 유효성 검사
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 강도 검사
 * - 최소 8자
 * - 대문자 포함
 * - 소문자 포함
 * - 숫자 포함
 * - 특수문자 포함
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('비밀번호는 최소 8자 이상이어야 합니다.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('대문자를 포함해야 합니다.');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('소문자를 포함해야 합니다.');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('숫자를 포함해야 합니다.');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('특수문자를 포함해야 합니다.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 전화번호 유효성 검사 (한국)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/-/g, ''));
}

/**
 * 전화번호 포맷팅
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

// ============================================
// Authentication Functions
// ============================================

/**
 * 회원가입
 */
export async function signUp(data: ISignUpData): Promise<IAuthResult> {
  const supabase = createClient();

  // 이메일 검증
  if (!validateEmail(data.email)) {
    return {
      success: false,
      error: {
        code: AUTH_ERROR_CODES.INVALID_EMAIL,
        message: '유효하지 않은 이메일 형식입니다.',
      },
    };
  }

  // 비밀번호 검증
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    return {
      success: false,
      error: {
        code: AUTH_ERROR_CODES.WEAK_PASSWORD,
        message: passwordValidation.errors.join(' '),
      },
    };
  }

  // 전화번호 검증 (제공된 경우)
  if (data.phone && !validatePhone(data.phone)) {
    return {
      success: false,
      error: {
        code: 'INVALID_PHONE',
        message: '유효하지 않은 전화번호 형식입니다.',
      },
    };
  }

  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          phone: data.phone ? formatPhone(data.phone) : undefined,
          role: data.role,
        },
      },
    });

    if (error) {
      // Supabase 에러 코드 매핑
      if (error.message.includes('already registered')) {
        return {
          success: false,
          error: {
            code: AUTH_ERROR_CODES.EMAIL_ALREADY_EXISTS,
            message: '이미 등록된 이메일입니다.',
          },
        };
      }

      return {
        success: false,
        error: {
          code: AUTH_ERROR_CODES.UNKNOWN_ERROR,
          message: error.message,
        },
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: {
          code: AUTH_ERROR_CODES.UNKNOWN_ERROR,
          message: '회원가입에 실패했습니다.',
        },
      };
    }

    return {
      success: true,
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          role: data.role,
          full_name: data.full_name,
          phone: data.phone,
          created_at: authData.user.created_at,
          updated_at: authData.user.updated_at || authData.user.created_at,
        },
        session: authData.session,
      },
    };
  } catch {
    return {
      success: false,
      error: {
        code: AUTH_ERROR_CODES.NETWORK_ERROR,
        message: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
    };
  }
}

/**
 * 로그인
 */
export async function signIn(credentials: ILoginCredentials): Promise<IAuthResult> {
  const supabase = createClient();

  if (!validateEmail(credentials.email)) {
    return {
      success: false,
      error: {
        code: AUTH_ERROR_CODES.INVALID_EMAIL,
        message: '유효하지 않은 이메일 형식입니다.',
      },
    };
  }

  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return {
        success: false,
        error: {
          code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
          message: '이메일 또는 비밀번호가 올바르지 않습니다.',
        },
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: {
          code: AUTH_ERROR_CODES.USER_NOT_FOUND,
          message: '사용자를 찾을 수 없습니다.',
        },
      };
    }

    // 프로필 정보 가져오기
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    return {
      success: true,
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          role: profile?.role || 'golfer',
          full_name: profile?.full_name || authData.user.user_metadata.full_name || 'User',
          phone: profile?.phone,
          avatar_url: profile?.avatar_url,
          created_at: authData.user.created_at,
          updated_at: profile?.updated_at || authData.user.created_at,
        },
        session: authData.session,
      },
    };
  } catch {
    return {
      success: false,
      error: {
        code: AUTH_ERROR_CODES.NETWORK_ERROR,
        message: '네트워크 오류가 발생했습니다.',
      },
    };
  }
}

/**
 * 로그아웃
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: '로그아웃 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 현재 사용자 가져오기
 */
export async function getCurrentUser(): Promise<IUser | null> {
  const supabase = createClient();

  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return null;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    return {
      id: authUser.id,
      email: authUser.email!,
      role: profile?.role || 'golfer',
      full_name: profile?.full_name || authUser.user_metadata.full_name || 'User',
      phone: profile?.phone,
      avatar_url: profile?.avatar_url,
      created_at: authUser.created_at,
      updated_at: profile?.updated_at || authUser.created_at,
    };
  } catch {
    return null;
  }
}

/**
 * 비밀번호 재설정 요청
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  if (!validateEmail(email)) {
    return {
      success: false,
      error: '유효하지 않은 이메일 형식입니다.',
    };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: '비밀번호 재설정 요청 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 비밀번호 업데이트
 */
export async function updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    return {
      success: false,
      error: passwordValidation.errors.join(' '),
    };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: '비밀번호 변경 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 프로필 업데이트
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Pick<IUser, 'full_name' | 'phone' | 'avatar_url'>>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: '프로필 업데이트 중 오류가 발생했습니다.',
    };
  }
}
