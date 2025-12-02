'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseScrollVisibilityOptions {
  /** 스크롤 멈춤 후 요소가 다시 나타나기까지의 지연 시간 (ms) */
  delay?: number;
  /** 초기 표시 상태 */
  initialVisible?: boolean;
}

interface UseScrollVisibilityReturn {
  /** 현재 표시 상태 */
  isVisible: boolean;
  /** 수동으로 표시 상태 설정 */
  setIsVisible: (visible: boolean) => void;
  /** 수동으로 숨기기 (사용자가 닫기 버튼 클릭 시) */
  hide: () => void;
  /** 수동으로 보이기 */
  show: () => void;
}

/**
 * useScrollVisibility - 스크롤 시 요소를 숨기고, 스크롤 멈춤 후 다시 표시하는 훅
 *
 * 사용 예:
 * ```tsx
 * const { isVisible } = useScrollVisibility({ delay: 1000 });
 *
 * return (
 *   <div className={isVisible ? 'opacity-100' : 'opacity-0'}>
 *     Floating CTA
 *   </div>
 * );
 * ```
 *
 * @param options.delay - 스크롤 멈춤 후 표시까지 지연 시간 (기본: 1000ms)
 * @param options.initialVisible - 초기 표시 상태 (기본: true)
 */
export function useScrollVisibility({
  delay = 1000,
  initialVisible = true,
}: UseScrollVisibilityOptions = {}): UseScrollVisibilityReturn {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [isManuallyHidden, setIsManuallyHidden] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);

  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    setIsManuallyHidden(true);
    setIsVisible(false);
    clearTimeoutRef();
  }, [clearTimeoutRef]);

  const show = useCallback(() => {
    setIsManuallyHidden(false);
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // 수동으로 숨긴 경우 스크롤 이벤트 무시
    if (isManuallyHidden) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);

      // 작은 스크롤은 무시 (떨림 방지)
      if (scrollDelta < 10) return;

      lastScrollY.current = currentScrollY;

      // 스크롤 중에는 숨김
      setIsVisible(false);
      clearTimeoutRef();

      // 스크롤 멈추면 지연 후 표시
      timeoutRef.current = setTimeout(() => {
        if (!isManuallyHidden) {
          setIsVisible(true);
        }
      }, delay);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeoutRef();
    };
  }, [delay, isManuallyHidden, clearTimeoutRef]);

  // 컴포넌트 언마운트 시 타임아웃 정리
  useEffect(() => {
    return () => {
      clearTimeoutRef();
    };
  }, [clearTimeoutRef]);

  return {
    isVisible,
    setIsVisible,
    hide,
    show,
  };
}

export default useScrollVisibility;
