'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid auto-rows-[22rem] grid-cols-3 gap-4',
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  name: string;
  description: string;
  icon?: ReactNode;
  background?: ReactNode;
  href?: string;
  cta?: string;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  className?: string;
}

export function BentoCard({
  name,
  description,
  icon,
  background,
  href,
  cta,
  colSpan = 1,
  rowSpan = 1,
  className,
}: BentoCardProps) {
  const colSpanClasses = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
  };

  const rowSpanClasses = {
    1: 'row-span-1',
    2: 'row-span-2',
  };

  const cardClassName = cn(
    'group relative flex flex-col justify-between overflow-hidden rounded-xl',
    'bg-tee-surface',
    'border border-tee-ink-light/10',
    'shadow-card',
    'transition-all duration-300 ease-out',
    'hover:shadow-lg hover:scale-[1.02]',
    colSpanClasses[colSpan],
    rowSpanClasses[rowSpan],
    className
  );

  const content = (
    <>
      {/* Background */}
      <div className="absolute inset-0 z-0">{background}</div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-2 p-6">
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-tee-accent-primary/10 text-tee-accent-primary">
            {icon}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex flex-col gap-1 p-6 pt-0">
        <h3 className="text-lg font-semibold text-tee-ink-strong">{name}</h3>
        <p className="text-sm text-tee-ink-light line-clamp-2">{description}</p>
        {cta && (
          <span className="mt-2 inline-flex items-center text-sm font-medium text-tee-accent-primary group-hover:underline">
            {cta}
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} className={cardClassName}>
        {content}
      </a>
    );
  }

  return (
    <div className={cardClassName}>
      {content}
    </div>
  );
}
