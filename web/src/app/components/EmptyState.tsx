'use client';

import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

/**
 * EmptyState component for displaying empty data states
 *
 * @example
 * <EmptyState
 *   icon={<SearchIcon />}
 *   title="검색 결과가 없습니다"
 *   description="다른 검색어로 시도해보세요"
 *   action={{ label: "전체 보기", href: "/browse" }}
 * />
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  const defaultIcon = (
    <svg width="56" height="56" viewBox="0 0 100 100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0,10)">
        <path d="M14 56 Q 40 64, 78 50" stroke="#CFCFCA" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M40 58 L 40 72" stroke="#CFCFCA" strokeWidth="5" strokeLinecap="round" fill="none" />
        <circle cx="74" cy="44" r="8" fill="#E3E3DF" />
      </g>
    </svg>
  );

  return (
    <div
      className={`empty-state ${className}`} /* Apply base empty-state class */
      role="status"
      aria-live="polite"
    >
      <div className="empty-icon">
        {icon || defaultIcon}
      </div>

      <h3 className="empty-title">
        {title}
      </h3>

      {description && (
        <p className="empty-text">
          {description}
        </p>
      )}

      {action && (
        action.href ? (
          <Link href={action.href} className="btn btn-primary"> {/* Use btn and btn-primary classes */}
            {action.label}
          </Link>
        ) : (
          <button onClick={action.onClick} className="btn btn-primary"> {/* Use btn and btn-primary classes */}
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

// Preset empty states for common scenarios
export function NoSearchResults({
  searchTerm,
  onClear,
}: {
  searchTerm?: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      icon={
        <svg
          className="h-12 w-12 text-tee-fog" /* Updated color */
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title="검색 결과가 없습니다"
      description={
        searchTerm
          ? `"${searchTerm}"에 대한 결과를 찾을 수 없습니다. 다른 검색어를 시도해보세요.`
          : '검색어를 입력해주세요.'
      }
      action={onClear ? { label: '검색 초기화', onClick: onClear } : undefined}
    />
  );
}

export function NoConversations() {
  return (
    <EmptyState
      icon={
        <svg
          className="h-12 w-12 text-tee-fog" /* Updated color */
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      }
      title="대화가 없습니다"
      description="아직 시작한 대화가 없습니다. 프로에게 먼저 문의해보세요."
      action={{ label: '프로 찾아보기', href: '/profile' }}
    />
  );
}

export function NoProfiles() {
  return (
    <EmptyState
      icon={
        <svg
          className="h-12 w-12 text-tee-fog" /* Updated color */
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      }
      title="등록된 프로가 없습니다"
      description="현재 조건에 맞는 프로가 없습니다. 필터를 조정해보세요."
    />
  );
}

export default EmptyState;
