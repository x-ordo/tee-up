'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface AdminNavItem {
  label: string;
  href: string;
}

export interface AdminNavProps extends React.HTMLAttributes<HTMLElement> {
  items: AdminNavItem[];
}

const AdminNav = React.forwardRef<HTMLElement, AdminNavProps>(
  ({ className, items, ...props }, ref) => {
    const pathname = usePathname();

    return (
      <nav
        ref={ref}
        className={cn('border-b border-tee-stone bg-white', className)}
        {...props}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-8">
            {items.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'border-b-2 px-4 py-4 text-sm font-medium transition-colors',
                    isActive
                      ? 'border-tee-accent-primary text-tee-accent-primary font-semibold'
                      : 'border-transparent text-tee-ink-light hover:text-tee-accent-primary'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    );
  }
);
AdminNav.displayName = 'AdminNav';

// Default admin navigation items
const defaultAdminNavItems: AdminNavItem[] = [
  { label: '대시보드', href: '/admin' },
  { label: '프로 관리', href: '/admin/pros' },
  { label: '채팅 관리', href: '/admin/chats' },
  { label: '사용자 관리', href: '/admin/users' },
  { label: '분석', href: '/admin/analytics' },
];

export { AdminNav, defaultAdminNavItems };
