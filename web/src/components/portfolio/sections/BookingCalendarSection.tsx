'use client';

import * as React from 'react';
import { useState, useTransition, useCallback, useMemo } from 'react';
import { format, addDays, startOfDay, isSameDay, isToday, isBefore } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, Clock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAvailableSlots, createBooking, getBookingSettingsByProId } from '@/actions/scheduler';
import { trackLead } from '@/actions/leads';
import { BookingSheet } from '@/components/scheduler/BookingSheet';
import { TimeSlotPicker } from '@/components/scheduler/TimeSlotPicker';
import type { TimeSlot, BookingRequest, BookingSettings } from '@/components/scheduler/types';

interface BookingCalendarSectionProps {
  proId: string;
  proName: string;
  className?: string;
}

const SLOT_DURATION_MINUTES = 60;
const VISIBLE_DAYS = 7;

export function BookingCalendarSection({
  proId,
  proName,
  className,
}: BookingCalendarSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [startDate, setStartDate] = useState(() => startOfDay(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSettings, setBookingSettings] = useState<BookingSettings | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Generate visible days array
  const visibleDays = useMemo(() => {
    return Array.from({ length: VISIBLE_DAYS }, (_, i) => addDays(startDate, i));
  }, [startDate]);

  // Fetch available slots when date is selected
  const handleDateSelect = useCallback(
    (date: Date) => {
      if (isBefore(date, startOfDay(new Date()))) return;

      setSelectedDate(date);
      setSelectedSlot(null);
      setIsLoadingSlots(true);

      startTransition(async () => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const result = await getAvailableSlots(proId, dateStr, SLOT_DURATION_MINUTES);

        if (result.success) {
          const slots: TimeSlot[] = result.data.map((slot) => ({
            start: new Date(slot.start),
            end: new Date(slot.end),
            isAvailable: true,
          }));
          setAvailableSlots(slots);
        } else {
          setAvailableSlots([]);
        }
        setIsLoadingSlots(false);
      });
    },
    [proId]
  );

  // Handle slot selection and open booking sheet
  const handleSlotSelect = useCallback(
    async (slot: TimeSlot) => {
      setSelectedSlot(slot);

      // Fetch booking settings if not loaded
      if (!bookingSettings) {
        const settingsResult = await getBookingSettingsByProId(proId);
        if (settingsResult.success) {
          setBookingSettings(settingsResult.data);
        }
      }

      setIsBookingOpen(true);
    },
    [proId, bookingSettings]
  );

  // Handle booking submission
  const handleBookingSubmit = useCallback(
    async (request: BookingRequest) => {
      const result = await createBooking(request);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Track lead
      await trackLead(proId, {
        contact_method: 'booking',
        source_url: typeof window !== 'undefined' ? window.location.href : undefined,
      }).catch(() => {
        // Silently ignore tracking errors
      });

      // Reset selection after successful booking
      setSelectedSlot(null);
      setAvailableSlots([]);
      setSelectedDate(null);
    },
    [proId]
  );

  // Navigate weeks
  const navigatePrev = () => {
    const newStart = addDays(startDate, -VISIBLE_DAYS);
    if (!isBefore(newStart, startOfDay(new Date()))) {
      setStartDate(newStart);
    } else {
      setStartDate(startOfDay(new Date()));
    }
  };

  const navigateNext = () => {
    setStartDate(addDays(startDate, VISIBLE_DAYS));
  };

  const canNavigatePrev = !isBefore(addDays(startDate, -1), startOfDay(new Date()));

  return (
    <section className={cn('px-6 py-16', className)}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-tee-ink-muted">
            Booking
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[0.04em] text-tee-ink-strong">
            레슨 예약
          </h2>
          <p className="mt-3 text-sm font-medium tracking-[0.08em] text-tee-ink-light">
            원하시는 날짜와 시간을 선택하세요
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
          {/* Calendar Section */}
          <div className="rounded-2xl border border-tee-stone/60 bg-tee-surface/80 p-6 shadow-card">
            {/* Week Navigation */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={navigatePrev}
                disabled={!canNavigatePrev}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                  canNavigatePrev
                    ? 'hover:bg-tee-stone/40 text-tee-ink-strong'
                    : 'text-tee-ink-muted cursor-not-allowed'
                )}
                aria-label="이전 주"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium text-tee-ink-strong">
                {format(visibleDays[0], 'M월', { locale: ko })}
              </span>
              <button
                onClick={navigateNext}
                className="flex h-8 w-8 items-center justify-center rounded-full text-tee-ink-strong transition-colors hover:bg-tee-stone/40"
                aria-label="다음 주"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-7 gap-2">
              {visibleDays.map((day) => {
                const isPast = isBefore(day, startOfDay(new Date()));
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDateSelect(day)}
                    disabled={isPast}
                    className={cn(
                      'flex flex-col items-center rounded-xl p-2 transition-all',
                      'focus:outline-none focus:ring-2 focus:ring-tee-accent-primary focus:ring-offset-2',
                      isPast
                        ? 'cursor-not-allowed opacity-40'
                        : isSelected
                        ? 'bg-tee-accent-primary text-white shadow-md'
                        : 'hover:bg-tee-stone/40'
                    )}
                  >
                    <span
                      className={cn(
                        'text-[10px] font-medium uppercase',
                        isSelected ? 'text-white/80' : 'text-tee-ink-muted'
                      )}
                    >
                      {format(day, 'EEE', { locale: ko })}
                    </span>
                    <span
                      className={cn(
                        'mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                        isTodayDate && !isSelected && 'ring-2 ring-tee-accent-primary ring-offset-2',
                        isSelected ? 'text-white' : 'text-tee-ink-strong'
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected date info */}
            {selectedDate && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-tee-background p-3 text-sm">
                <Calendar className="h-4 w-4 text-tee-accent-primary" />
                <span className="font-medium text-tee-ink-strong">
                  {format(selectedDate, 'M월 d일 (EEEE)', { locale: ko })}
                </span>
              </div>
            )}
          </div>

          {/* Time Slots Section */}
          <div className="rounded-2xl border border-tee-stone/60 bg-tee-surface/80 p-6 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-tee-accent-primary" />
              <h3 className="text-lg font-semibold text-tee-ink-strong">
                예약 가능 시간
              </h3>
            </div>

            {isPending || isLoadingSlots ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-tee-accent-primary" />
                <p className="mt-3 text-sm text-tee-ink-light">
                  예약 가능 시간을 확인하고 있습니다...
                </p>
              </div>
            ) : (
              <TimeSlotPicker
                slots={availableSlots}
                selectedSlot={selectedSlot}
                onSelectSlot={handleSlotSelect}
                isLoading={false}
                selectedDate={selectedDate}
              />
            )}
          </div>
        </div>

        {/* Info Text */}
        <p className="mt-6 text-center text-xs text-tee-ink-muted">
          예약 확정 후 {proName} 프로님이 연락드립니다
        </p>
      </div>

      {/* Booking Sheet */}
      <BookingSheet
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        proId={proId}
        proName={proName}
        bookingSettings={bookingSettings ?? undefined}
        onSubmit={handleBookingSubmit}
      />
    </section>
  );
}
