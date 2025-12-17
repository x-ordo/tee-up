'use client';

import * as React from 'react';
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface WeekViewProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  availableDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const DAYS_IN_KOREAN = ['일', '월', '화', '수', '목', '금', '토'];

export function WeekView({
  selectedDate,
  onSelectDate,
  availableDates = [],
  minDate,
  maxDate,
  className,
}: WeekViewProps) {
  const [weekStart, setWeekStart] = React.useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Generate days for the current week view (2 weeks for better UX)
  const days = React.useMemo(() => {
    const result: Date[] = [];
    for (let i = 0; i < 14; i++) {
      result.push(addDays(weekStart, i));
    }
    return result;
  }, [weekStart]);

  // Check if a date has availability
  const hasAvailability = React.useCallback(
    (date: Date) => {
      if (availableDates.length === 0) return true; // If no data, show all as potentially available
      return availableDates.some((d) => isSameDay(d, date));
    },
    [availableDates]
  );

  // Check if a date is selectable
  const isDateSelectable = React.useCallback(
    (date: Date) => {
      const today = startOfDay(new Date());
      if (isBefore(date, today)) return false;
      if (minDate && isBefore(date, startOfDay(minDate))) return false;
      if (maxDate && isBefore(startOfDay(maxDate), date)) return false;
      return hasAvailability(date);
    },
    [minDate, maxDate, hasAvailability]
  );

  const goToPreviousWeek = () => {
    setWeekStart((prev) => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setWeekStart((prev) => addDays(prev, 7));
  };

  const goToToday = () => {
    setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  // Scroll selected date into view
  React.useEffect(() => {
    if (selectedDate && scrollContainerRef.current) {
      const selectedIndex = days.findIndex((d) => isSameDay(d, selectedDate));
      if (selectedIndex !== -1) {
        const container = scrollContainerRef.current;
        const dayWidth = 64; // approximate width of each day button
        const scrollPosition = Math.max(0, selectedIndex * dayWidth - container.clientWidth / 2 + dayWidth / 2);
        container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }
    }
  }, [selectedDate, days]);

  return (
    <div className={cn('space-y-3', className)}>
      {/* Month and Navigation */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-tee-ink-strong">
            {format(weekStart, 'yyyy년 M월', { locale: ko })}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="text-xs text-tee-accent-primary"
          >
            오늘
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousWeek}
            className="h-8 w-8"
            aria-label="이전 주"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextWeek}
            className="h-8 w-8"
            aria-label="다음 주"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Horizontal Scrolling Days */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {days.map((date) => {
          const dayOfWeek = date.getDay();
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isCurrentDay = isToday(date);
          const selectable = isDateSelectable(date);
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => selectable && onSelectDate(date)}
              disabled={!selectable}
              className={cn(
                'flex flex-col items-center justify-center min-w-[56px] h-[72px] rounded-xl transition-all snap-center',
                'focus:outline-none focus:ring-2 focus:ring-tee-accent-primary focus:ring-offset-2',
                isSelected
                  ? 'bg-tee-accent-primary text-white shadow-md'
                  : selectable
                  ? 'bg-tee-surface hover:bg-tee-stone/50 border border-tee-stone'
                  : 'bg-tee-stone/30 opacity-50 cursor-not-allowed',
                isCurrentDay && !isSelected && 'ring-2 ring-tee-accent-primary ring-inset'
              )}
              aria-label={format(date, 'M월 d일 EEEE', { locale: ko })}
              aria-pressed={isSelected || undefined}
            >
              <span
                className={cn(
                  'text-xs font-medium',
                  isSelected
                    ? 'text-white/80'
                    : isWeekend
                    ? dayOfWeek === 0
                      ? 'text-red-500'
                      : 'text-blue-500'
                    : 'text-tee-ink-light'
                )}
              >
                {DAYS_IN_KOREAN[dayOfWeek]}
              </span>
              <span
                className={cn(
                  'text-xl font-bold',
                  isSelected ? 'text-white' : 'text-tee-ink-strong'
                )}
              >
                {format(date, 'd')}
              </span>
              {/* Availability indicator dot */}
              {selectable && !isSelected && hasAvailability(date) && (
                <div className="w-1.5 h-1.5 rounded-full bg-tee-accent-primary mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
