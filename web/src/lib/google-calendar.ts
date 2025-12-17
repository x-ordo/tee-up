/**
 * Google Calendar API Integration
 * TEE:UP Portfolio SaaS - Pro scheduling feature
 *
 * Security Notes:
 * - Only use this module in Server Actions (never expose tokens to client)
 * - Access tokens are obtained from Supabase Auth session
 * - Refresh tokens are managed by Supabase Auth automatically
 */

const GOOGLE_CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

// ============================================
// Types
// ============================================

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string; // ISO 8601
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
  };
  colorId?: string;
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

export interface GoogleCalendarEventInput {
  summary: string;
  description?: string;
  location?: string;
  startDateTime: string; // ISO 8601
  endDateTime: string;
  timeZone?: string;
  attendeeEmail?: string;
  attendeeName?: string;
}

export interface BookingData {
  id: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  startAt: string;
  endAt: string;
  customerNotes?: string;
  proName: string;
  proLocation?: string;
}

export interface CalendarListResponse {
  items: GoogleCalendarEvent[];
  nextPageToken?: string;
}

export interface GoogleCalendarError {
  error: {
    code: number;
    message: string;
    errors: Array<{
      domain: string;
      reason: string;
      message: string;
    }>;
  };
}

// ============================================
// Helper Functions
// ============================================

/**
 * Make authenticated request to Google Calendar API
 */
async function googleCalendarFetch<T>(
  accessToken: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${GOOGLE_CALENDAR_API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = (await response.json()) as GoogleCalendarError;

    // Handle specific error cases
    if (response.status === 401) {
      throw new GoogleCalendarAuthError(
        'Google Calendar 인증이 만료되었습니다. 다시 로그인해주세요.',
        errorData
      );
    }

    if (response.status === 403) {
      throw new GoogleCalendarPermissionError(
        'Google Calendar 접근 권한이 없습니다. 권한을 확인해주세요.',
        errorData
      );
    }

    throw new GoogleCalendarApiError(
      errorData.error?.message || 'Google Calendar API 오류가 발생했습니다.',
      errorData
    );
  }

  // Handle empty responses (e.g., DELETE)
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text) as T;
}

// ============================================
// Custom Error Classes
// ============================================

export class GoogleCalendarApiError extends Error {
  constructor(
    message: string,
    public readonly details?: GoogleCalendarError
  ) {
    super(message);
    this.name = 'GoogleCalendarApiError';
  }
}

export class GoogleCalendarAuthError extends GoogleCalendarApiError {
  constructor(message: string, details?: GoogleCalendarError) {
    super(message, details);
    this.name = 'GoogleCalendarAuthError';
  }
}

export class GoogleCalendarPermissionError extends GoogleCalendarApiError {
  constructor(message: string, details?: GoogleCalendarError) {
    super(message, details);
    this.name = 'GoogleCalendarPermissionError';
  }
}

// ============================================
// Main API Functions
// ============================================

/**
 * Create a Google Calendar event for a confirmed booking
 *
 * @param accessToken - Google OAuth access token from Supabase session
 * @param bookingData - Booking information to create event from
 * @param calendarId - Calendar ID (default: 'primary')
 * @returns Created event data
 *
 * @example
 * ```typescript
 * const event = await createEvent(session.provider_token, {
 *   id: booking.id,
 *   guestName: '홍길동',
 *   guestEmail: 'guest@example.com',
 *   startAt: '2024-01-15T10:00:00+09:00',
 *   endAt: '2024-01-15T11:00:00+09:00',
 *   proName: '김프로',
 * });
 * ```
 */
export async function createEvent(
  accessToken: string,
  bookingData: BookingData,
  calendarId: string = 'primary'
): Promise<GoogleCalendarEvent> {
  // Build event description
  const descriptionParts: string[] = [
    `[TEE:UP 레슨 예약]`,
    ``,
    `예약자: ${bookingData.guestName}`,
  ];

  if (bookingData.guestPhone) {
    descriptionParts.push(`연락처: ${bookingData.guestPhone}`);
  }
  if (bookingData.guestEmail) {
    descriptionParts.push(`이메일: ${bookingData.guestEmail}`);
  }
  if (bookingData.customerNotes) {
    descriptionParts.push(``, `요청사항:`, bookingData.customerNotes);
  }
  descriptionParts.push(``, `---`, `예약 ID: ${bookingData.id}`);

  const event: GoogleCalendarEvent = {
    summary: `[레슨] ${bookingData.guestName}님`,
    description: descriptionParts.join('\n'),
    location: bookingData.proLocation,
    start: {
      dateTime: bookingData.startAt,
      timeZone: 'Asia/Seoul',
    },
    end: {
      dateTime: bookingData.endAt,
      timeZone: 'Asia/Seoul',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 60 }, // 1시간 전
        { method: 'popup', minutes: 10 }, // 10분 전
      ],
    },
    colorId: '10', // Green color for lessons
  };

  // Add attendee if email provided
  if (bookingData.guestEmail) {
    event.attendees = [
      {
        email: bookingData.guestEmail,
        displayName: bookingData.guestName,
      },
    ];
  }

  return googleCalendarFetch<GoogleCalendarEvent>(
    accessToken,
    `/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: 'POST',
      body: JSON.stringify(event),
    }
  );
}

/**
 * List Google Calendar events within a time range
 * Used to fetch busy times for availability checking
 *
 * @param accessToken - Google OAuth access token from Supabase session
 * @param timeMin - Start of time range (ISO 8601)
 * @param timeMax - End of time range (ISO 8601)
 * @param calendarId - Calendar ID (default: 'primary')
 * @returns List of events in the time range
 *
 * @example
 * ```typescript
 * const events = await listEvents(
 *   session.provider_token,
 *   '2024-01-15T00:00:00+09:00',
 *   '2024-01-22T00:00:00+09:00'
 * );
 * ```
 */
export async function listEvents(
  accessToken: string,
  timeMin: string,
  timeMax: string,
  calendarId: string = 'primary'
): Promise<GoogleCalendarEvent[]> {
  const params = new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: 'true', // Expand recurring events
    orderBy: 'startTime',
    maxResults: '250',
  });

  const response = await googleCalendarFetch<CalendarListResponse>(
    accessToken,
    `/calendars/${encodeURIComponent(calendarId)}/events?${params.toString()}`
  );

  return response.items || [];
}

/**
 * Update an existing Google Calendar event
 *
 * @param accessToken - Google OAuth access token
 * @param eventId - Google Calendar event ID
 * @param updates - Partial event data to update
 * @param calendarId - Calendar ID (default: 'primary')
 */
export async function updateEvent(
  accessToken: string,
  eventId: string,
  updates: Partial<GoogleCalendarEvent>,
  calendarId: string = 'primary'
): Promise<GoogleCalendarEvent> {
  return googleCalendarFetch<GoogleCalendarEvent>(
    accessToken,
    `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }
  );
}

/**
 * Delete a Google Calendar event
 *
 * @param accessToken - Google OAuth access token
 * @param eventId - Google Calendar event ID
 * @param calendarId - Calendar ID (default: 'primary')
 */
export async function deleteEvent(
  accessToken: string,
  eventId: string,
  calendarId: string = 'primary'
): Promise<void> {
  await googleCalendarFetch<void>(
    accessToken,
    `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    {
      method: 'DELETE',
    }
  );
}

/**
 * Get free/busy information for a calendar
 * More efficient than listEvents for checking availability
 *
 * @param accessToken - Google OAuth access token
 * @param timeMin - Start of time range (ISO 8601)
 * @param timeMax - End of time range (ISO 8601)
 * @param calendarId - Calendar ID (default: 'primary')
 */
export async function getFreeBusy(
  accessToken: string,
  timeMin: string,
  timeMax: string,
  calendarId: string = 'primary'
): Promise<Array<{ start: string; end: string }>> {
  interface FreeBusyResponse {
    calendars: {
      [key: string]: {
        busy: Array<{ start: string; end: string }>;
      };
    };
  }

  const response = await googleCalendarFetch<FreeBusyResponse>(
    accessToken,
    '/freeBusy',
    {
      method: 'POST',
      body: JSON.stringify({
        timeMin,
        timeMax,
        items: [{ id: calendarId }],
      }),
    }
  );

  return response.calendars?.[calendarId]?.busy || [];
}

// ============================================
// Utility Functions
// ============================================

/**
 * Convert Google Calendar events to blocked time slots
 * for use in the scheduler
 */
export function eventsToBlockedSlots(
  events: GoogleCalendarEvent[]
): Array<{ start: Date; end: Date; reason: string }> {
  return events
    .filter((event) => event.start?.dateTime && event.end?.dateTime)
    .map((event) => ({
      start: new Date(event.start.dateTime),
      end: new Date(event.end.dateTime),
      reason: event.summary || 'Google Calendar 일정',
    }));
}

/**
 * Check if a time slot conflicts with any Google Calendar events
 */
export function hasConflict(
  slotStart: Date,
  slotEnd: Date,
  events: GoogleCalendarEvent[]
): boolean {
  return events.some((event) => {
    if (!event.start?.dateTime || !event.end?.dateTime) return false;

    const eventStart = new Date(event.start.dateTime);
    const eventEnd = new Date(event.end.dateTime);

    // Check for overlap
    return slotStart < eventEnd && slotEnd > eventStart;
  });
}
