'use client';

import { cn } from '@/lib/utils';
import { ComponentPropsWithoutRef } from 'react';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to animate vertically
   * @default false
   */
  vertical?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
  /**
   * Duration of the animation in seconds
   * @default 40
   */
  duration?: number;
  /**
   * Gap between items
   * @default '1rem'
   */
  gap?: string;
}

export function Marquee({
  children,
  className,
  pauseOnHover = false,
  reverse = false,
  vertical = false,
  repeat = 4,
  duration = 40,
  gap = '1rem',
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn(
        'group flex overflow-hidden',
        vertical ? 'flex-col' : 'flex-row',
        className
      )}
      style={
        {
          '--duration': `${duration}s`,
          '--gap': gap,
        } as React.CSSProperties
      }
      {...props}
    >
      {Array.from({ length: repeat }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'flex shrink-0',
            vertical ? 'flex-col' : 'flex-row',
            vertical ? 'animate-marquee-vertical' : 'animate-marquee',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
            reverse && '[animation-direction:reverse]'
          )}
          style={{ gap }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
