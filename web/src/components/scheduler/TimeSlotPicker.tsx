'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TimeSlot } from './types';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
  isLoading?: boolean;
  selectedDate: Date | null;
  className?: string;
}

export function TimeSlotPicker({
  slots,
  selectedSlot,
  onSelectSlot,
  isLoading = false,
  selectedDate,
  className,
}: TimeSlotPickerProps) {
  // Group slots by time period (morning, afternoon, evening)
  const groupedSlots = React.useMemo(() => {
    const morning: TimeSlot[] = [];
    const afternoon: TimeSlot[] = [];
    const evening: TimeSlot[] = [];

    slots.forEach((slot) => {
      const hour = slot.start.getHours();
      if (hour < 12) {
        morning.push(slot);
      } else if (hour < 18) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    });

    return { morning, afternoon, evening };
  }, [slots]);

  if (!selectedDate) {
    return (
      <div className={cn('text-center py-8', className)}>
        <Clock className="h-12 w-12 mx-auto text-tee-ink-muted mb-3" />
        <p className="text-tee-ink-light">날짜를 먼저 선택해주세요</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn('text-center py-8', className)}>
        <Loader2 className="h-8 w-8 mx-auto text-tee-accent-primary animate-spin mb-3" />
        <p className="text-tee-ink-light">예약 가능 시간을 확인하고 있습니다...</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <Clock className="h-12 w-12 mx-auto text-tee-ink-muted mb-3" />
        <p className="text-tee-ink-strong font-medium mb-1">
          예약 가능한 시간이 없습니다
        </p>
        <p className="text-sm text-tee-ink-light">
          다른 날짜를 선택해주세요
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Selected date header */}
      <div className="flex items-center gap-2 text-sm text-tee-ink-light">
        <Clock className="h-4 w-4" />
        <span>{format(selectedDate, 'M월 d일 (EEEE)', { locale: ko })}</span>
        <span className="ml-auto text-tee-accent-primary font-medium">
          {slots.length}개 시간 가능
        </span>
      </div>

      {/* Time slots by period */}
      {groupedSlots.morning.length > 0 && (
        <TimeSlotGroup
          label="오전"
          slots={groupedSlots.morning}
          selectedSlot={selectedSlot}
          onSelectSlot={onSelectSlot}
        />
      )}
      {groupedSlots.afternoon.length > 0 && (
        <TimeSlotGroup
          label="오후"
          slots={groupedSlots.afternoon}
          selectedSlot={selectedSlot}
          onSelectSlot={onSelectSlot}
        />
      )}
      {groupedSlots.evening.length > 0 && (
        <TimeSlotGroup
          label="저녁"
          slots={groupedSlots.evening}
          selectedSlot={selectedSlot}
          onSelectSlot={onSelectSlot}
        />
      )}
    </div>
  );
}

interface TimeSlotGroupProps {
  label: string;
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

function TimeSlotGroup({
  label,
  slots,
  selectedSlot,
  onSelectSlot,
}: TimeSlotGroupProps) {
  return (
    <div>
      <h4 className="text-xs font-medium text-tee-ink-muted uppercase tracking-wider mb-2">
        {label}
      </h4>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => {
          const isSelected =
            selectedSlot &&
            slot.start.getTime() === selectedSlot.start.getTime();
          const isDisabled = !slot.isAvailable;

          return (
            <button
              key={slot.start.toISOString()}
              type="button"
              onClick={() => !isDisabled && onSelectSlot(slot)}
              disabled={isDisabled}
              className={cn(
                'px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                'focus:outline-none focus:ring-2 focus:ring-tee-accent-primary focus:ring-offset-2',
                isSelected
                  ? 'bg-tee-accent-primary text-white shadow-md'
                  : isDisabled
                  ? 'bg-tee-stone/50 text-tee-ink-muted cursor-not-allowed'
                  : 'bg-tee-surface border border-tee-stone hover:border-tee-accent-primary hover:text-tee-accent-primary'
              )}
              aria-label={`${format(slot.start, 'HH:mm')} 시작`}
              aria-pressed={isSelected || undefined}
            >
              {format(slot.start, 'HH:mm')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
