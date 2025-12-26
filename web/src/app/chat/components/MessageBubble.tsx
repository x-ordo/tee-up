'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import Image from 'next/image';
import type { IMessage, IUser } from '@/types';

interface MessageBubbleProps {
  message: IMessage;
  isOwn: boolean;
  sender?: IUser;
  showAvatar?: boolean;
}

export function MessageBubble({
  message,
  isOwn,
  sender,
  showAvatar = true,
}: MessageBubbleProps) {
  return (
    <div
      className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <div className="relative h-10 w-10 flex-shrink-0">
          {sender?.avatar_url ? (
            <Image
              src={sender.avatar_url}
              alt={sender.full_name || '사용자'}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-tee-accent-primary/10 text-sm font-bold text-tee-accent-primary">
              {sender?.full_name?.charAt(0) || '?'}
            </div>
          )}
        </div>
      )}

      {/* Spacer for own messages */}
      {showAvatar && isOwn && <div className="w-10" />}

      {/* Message Content */}
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender Name (for received messages) */}
        {!isOwn && sender && (
          <p className="mb-1 text-xs font-medium text-tee-ink-light">
            {sender.full_name}
          </p>
        )}

        <div
          className={`
            rounded-2xl px-4 py-2.5
            ${
              isOwn
                ? 'rounded-tr-sm bg-tee-accent-primary text-white'
                : 'rounded-tl-sm bg-tee-surface text-tee-ink-strong'
            }
          `}
        >
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.content}
          </p>
        </div>

        {/* Time and Read Status */}
        <div
          className={`mt-1 flex items-center gap-1 text-xs text-tee-ink-muted ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}
        >
          <span>
            {format(new Date(message.created_at), 'a h:mm', { locale: ko })}
          </span>
          {isOwn && (
            <span>
              {message.is_read ? (
                <svg
                  className="h-4 w-4 text-tee-accent-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// 타이핑 인디케이터
interface TypingIndicatorProps {
  userName?: string;
}

export function TypingIndicator({ userName }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tee-surface">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-tee-ink-muted" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-tee-ink-muted" style={{ animationDelay: '150ms' }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-tee-ink-muted" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      <span className="text-sm text-tee-ink-muted">
        {userName ? `${userName}님이 입력 중...` : '입력 중...'}
      </span>
    </div>
  );
}

// 날짜 구분선
interface DateDividerProps {
  date: Date;
}

export function DateDivider({ date }: DateDividerProps) {
  return (
    <div className="relative py-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-tee-stone" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-tee-surface px-4 text-xs text-tee-ink-muted">
          {format(date, 'yyyy년 M월 d일 EEEE', { locale: ko })}
        </span>
      </div>
    </div>
  );
}
