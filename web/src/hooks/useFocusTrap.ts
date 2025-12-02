'use client';

import { useEffect, useCallback, RefObject } from 'react';

const FOCUSABLE_ELEMENTS = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

interface UseFocusTrapOptions {
  containerRef: RefObject<HTMLElement | null>;
  isActive: boolean;
  onClose?: () => void;
}

/**
 * useFocusTrap - 모달/다이얼로그에서 포커스를 컨테이너 내부에 가두는 훅
 *
 * @param containerRef - 포커스를 가둘 컨테이너 요소 ref
 * @param isActive - 포커스 트랩 활성화 여부
 * @param onClose - Escape 키 눌렀을 때 호출할 콜백
 */
export function useFocusTrap({ containerRef, isActive, onClose }: UseFocusTrapOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!containerRef.current) return;

      // Escape 키로 닫기
      if (event.key === 'Escape' && onClose) {
        event.preventDefault();
        onClose();
        return;
      }

      // Tab 키 트랩
      if (event.key === 'Tab') {
        const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
          FOCUSABLE_ELEMENTS
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift + Tab: 첫 번째 요소에서 마지막으로 이동
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
          return;
        }

        // Tab: 마지막 요소에서 첫 번째로 이동
        if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
          return;
        }
      }
    },
    [containerRef, onClose]
  );

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // 첫 번째 포커스 가능한 요소로 포커스 이동
    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      FOCUSABLE_ELEMENTS
    );

    if (focusableElements.length > 0) {
      // 약간의 지연으로 모달 애니메이션 후 포커스
      requestAnimationFrame(() => {
        focusableElements[0].focus();
      });
    }

    // 키보드 이벤트 리스너 등록
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, containerRef, handleKeyDown]);
}

export default useFocusTrap;
