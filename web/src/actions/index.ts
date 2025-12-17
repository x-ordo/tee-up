// Types
export type { ActionResult, ThemeType, ContactMethod, SubscriptionTier, SubscriptionStatus } from './types';

// Profile actions
export {
  getCurrentUserProfile,
  getPublicProfile,
  getApprovedProfiles,
  updateProProfile,
  createProProfile,
  incrementProfileViews,
  type ProProfile,
  type ProProfileInsert,
  type ProProfileUpdate,
} from './profiles';

// Studio actions
export {
  createStudio,
  getPublicStudio,
  getMyStudios,
  updateStudio,
  addProToStudio,
  getStudioPros,
  type Studio,
  type StudioInsert,
  type StudioUpdate,
} from './studios';

// Lead actions
export {
  trackLead,
  getLeadStats,
  getMyLeads,
  checkLeadLimit,
  type Lead,
  type LeadStats,
} from './leads';

// Portfolio actions
export {
  updatePortfolioTheme,
  getPortfolioSections,
  createPortfolioSection,
  updatePortfolioSection,
  deletePortfolioSection,
  reorderPortfolioSections,
  updatePaymentLink,
  updateOpenChatUrl,
  initializeDefaultSections,
  DEFAULT_SECTIONS,
  type PortfolioSection,
  type PortfolioSectionInsert,
  type PortfolioSectionUpdate,
} from './portfolios';

// Scheduler actions
export {
  getProAvailability,
  getBlockedSlots,
  getProBookings,
  createBooking,
  getAvailableSlots,
  getAvailableSlotsWithCalendar,
  checkSlotAvailability,
  getMyBookings,
  cancelBooking,
} from './scheduler';

// Calendar actions (Google Calendar integration)
export {
  syncBookingToCalendar,
  removeBookingFromCalendar,
  getCalendarBlockedSlots,
  getCalendarEvents,
  hasGoogleCalendarConnected,
  getCombinedBlockedSlots,
  type CalendarBlockedSlot,
  type CalendarSyncResult,
} from './calendar';
