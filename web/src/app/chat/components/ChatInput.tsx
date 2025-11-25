'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => Promise<{ success: boolean }>;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onTyping,
  disabled = false,
  placeholder = '메시지를 입력하세요...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [message]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
      onTyping?.(e.target.value.length > 0);
    },
    [onTyping]
  );

  const handleSubmit = useCallback(async () => {
    if (!message.trim() || isSending || disabled) return;

    setIsSending(true);
    const result = await onSend(message.trim());

    if (result.success) {
      setMessage('');
      onTyping?.(false);
    }

    setIsSending(false);
  }, [message, isSending, disabled, onSend, onTyping]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Enter로 전송, Shift+Enter로 줄바꿈
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="border-t border-white/10 bg-[#0a0e27]/90 p-4 backdrop-blur-xl">
      <div className="flex items-end gap-3">
        {/* 텍스트 입력 */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending}
            rows={1}
            className="
              max-h-[120px] w-full resize-none rounded-2xl border border-white/10
              bg-white/5 px-4 py-3 pr-12 text-white placeholder-white/30
              transition-colors focus:border-[#d4af37] focus:outline-none
              disabled:cursor-not-allowed disabled:opacity-50
            "
          />

          {/* 이모지 버튼 (옵션) */}
          <button
            type="button"
            className="absolute bottom-3 right-3 text-white/40 transition-colors hover:text-white/60"
            aria-label="이모지 선택"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>

        {/* 전송 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || isSending || disabled}
          className="
            flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full
            bg-gradient-to-r from-[#d4af37] to-[#f4e5c2] text-[#0a0e27]
            transition-all duration-200
            hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]
            disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none
          "
          aria-label="메시지 전송"
        >
          {isSending ? (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </div>

      {/* 안내 텍스트 */}
      <p className="mt-2 text-center text-xs text-white/30">
        Enter로 전송, Shift+Enter로 줄바꿈
      </p>
    </div>
  );
}
