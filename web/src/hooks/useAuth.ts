'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  requestPasswordReset,
  updatePassword,
  updateProfile,
} from '@/lib/auth';
import type { IUser, ISignUpData, ILoginCredentials, IAuthState } from '@/types';

/**
 * 인증 상태 관리 훅
 */
export function useAuth() {
  const [state, setState] = useState<IAuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const supabase = createClient();

  // 초기 사용자 로드
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setState({
          user,
          isLoading: false,
          isAuthenticated: !!user,
          error: null,
        });
      } catch {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: '사용자 정보를 불러오는데 실패했습니다.',
        });
      }
    };

    loadUser();

    // Auth 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const user = await getCurrentUser();
          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // 회원가입
  const handleSignUp = useCallback(async (data: ISignUpData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await signUp(data);

    if (result.success && result.data) {
      setState({
        user: result.data.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
      return { success: true };
    }

    setState((prev) => ({
      ...prev,
      isLoading: false,
      error: result.error?.message || '회원가입에 실패했습니다.',
    }));

    return {
      success: false,
      error: result.error,
    };
  }, []);

  // 로그인
  const handleSignIn = useCallback(async (credentials: ILoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await signIn(credentials);

    if (result.success && result.data) {
      setState({
        user: result.data.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
      return { success: true };
    }

    setState((prev) => ({
      ...prev,
      isLoading: false,
      error: result.error?.message || '로그인에 실패했습니다.',
    }));

    return {
      success: false,
      error: result.error,
    };
  }, []);

  // 로그아웃
  const handleSignOut = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const result = await signOut();

    if (result.success) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    } else {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: result.error || '로그아웃에 실패했습니다.',
      }));
    }

    return result;
  }, []);

  // 비밀번호 재설정 요청
  const handlePasswordResetRequest = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await requestPasswordReset(email);

    setState((prev) => ({
      ...prev,
      isLoading: false,
      error: result.success ? null : result.error || '요청에 실패했습니다.',
    }));

    return result;
  }, []);

  // 비밀번호 변경
  const handlePasswordUpdate = useCallback(async (newPassword: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await updatePassword(newPassword);

    setState((prev) => ({
      ...prev,
      isLoading: false,
      error: result.success ? null : result.error || '변경에 실패했습니다.',
    }));

    return result;
  }, []);

  // 프로필 업데이트
  const handleProfileUpdate = useCallback(
    async (updates: Partial<Pick<IUser, 'full_name' | 'phone' | 'avatar_url'>>) => {
      if (!state.user) {
        return { success: false, error: '로그인이 필요합니다.' };
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await updateProfile(state.user.id, updates);

      if (result.success) {
        setState((prev) => ({
          ...prev,
          user: prev.user ? { ...prev.user, ...updates } : null,
          isLoading: false,
          error: null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: result.error || '업데이트에 실패했습니다.',
        }));
      }

      return result;
    },
    [state.user]
  );

  // 에러 초기화
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    requestPasswordReset: handlePasswordResetRequest,
    updatePassword: handlePasswordUpdate,
    updateProfile: handleProfileUpdate,
    clearError,
  };
}
