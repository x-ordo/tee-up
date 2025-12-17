'use client';

import * as React from 'react';
import { format, addDays, parseISO } from 'date-fns';
import { WeekView } from './WeekView';
import { TimeSlotPicker } from './TimeSlotPicker';
import { BookingSheet } from './BookingSheet';
import { getAvailableSlots, createBooking } from '@/actions/scheduler';
import { cn } from '@/lib/utils';
import type { TimeSlot, BookingRequest, DEFAULT_SCHEDULE_SETTINGS } from './types';

interface SchedulerProps {
  proId: string;
  proName?: string;
  slotDurationMinutes?: number;
  maxAdvanceDays?: number;
  className?: string;
}

export function Scheduler({
  proId,
  proName = '프로',
  slotDurationMinutes = 60,
  maxAdvanceDays = 30,
  className,
}: SchedulerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = React.useState<TimeSlot | null>(null);
  const [slots, setSlots] = React.useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Calculate min and max dates
  const minDate = React.useMemo(() => new Date(), []);
  const maxDate = React.useMemo(() => addDays(new Date(), maxAdvanceDays), [maxAdvanceDays]);

  // Fetch available slots when date changes
  React.useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setIsLoading(true);
      setError(null);
      setSelectedSlot(null);

      try {
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const result = await getAvailableSlots(proId, dateString, slotDurationMinutes);

        if (result.success) {
          const timeSlots: TimeSlot[] = result.data.map((slot) => ({
            start: parseISO(slot.start),
            end: parseISO(slot.end),
            isAvailable: true,
          }));
          setSlots(timeSlots);
        } else {
          setError(result.error);
          setSlots([]);
        }
      } catch (err) {
        setError('시간 정보를 불러오는데 실패했습니다');
        setSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, proId, slotDurationMinutes]);

  // Handle date selection
  const handleSelectDate = React.useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  }, []);

  // Handle slot selection - opens booking sheet (Click 2)
  const handleSelectSlot = React.useCallback((slot: TimeSlot) => {
    setSelectedSlot(slot);
    setIsBookingOpen(true);
  }, []);

  // Handle booking submission (Click 3 - final)
  const handleBookingSubmit = React.useCallback(async (request: BookingRequest) => {
    const result = await createBooking(request);
    if (!result.success) {
      throw new Error(result.error);
    }
  }, []);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Step 1: Select Date (Click 1) */}
      <section aria-label="날짜 선택">
        <WeekView
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          minDate={minDate}
          maxDate={maxDate}
        />
      </section>

      {/* Step 2: Select Time (Click 2 - opens BookingSheet) */}
      <section aria-label="시간 선택">
        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        ) : (
          <TimeSlotPicker
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSelectSlot}
            isLoading={isLoading}
            selectedDate={selectedDate}
          />
        )}
      </section>

      {/* Step 3: Confirm Booking (Click 3 - in BookingSheet) */}
      <BookingSheet
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        proId={proId}
        proName={proName}
        onSubmit={handleBookingSubmit}
      />
    </div>
  );
}
