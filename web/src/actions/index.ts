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
  getStudioById,
  getStudioDashboardStats,
  getStudioMembers,
  removeStudioMember,
  createStudioInvite,
  getStudioInvites,
  revokeStudioInvite,
  validateStudioInvite,
  acceptStudioInvite,
  getMyStudioAffiliations,
  setPrimaryStudio,
  leaveStudio,
  type Studio,
  type StudioInsert,
  type StudioUpdate,
  type StudioMember,
  type StudioInvite,
  type StudioAffiliation,
  type StudioDashboardStats,
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
  type PortfolioSection,
  type PortfolioSectionInsert,
  type PortfolioSectionUpdate,
} from './portfolios';

// Portfolio constants (non-server)
export { DEFAULT_SECTIONS } from '@/lib/portfolio-constants';

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

// Refund and dispute actions
export {
  calculateRefundAmount,
  requestRefund,
  processRefund,
  openDispute,
  respondToDispute,
  resolveDispute,
  escalateDispute,
  getDisputeLogs,
  getAllDisputes,
  getPendingRefunds,
  type DisputeStatus,
  type RefundRequest,
  type DisputeLog,
  type BookingWithRefund,
} from './refunds';

// Lesson log actions
export {
  createLessonLog,
  getLessonLog,
  getMyLessonLogs,
  updateLessonLog,
  deleteLessonLog,
  addLessonMedia,
  deleteLessonMedia,
  getLessonStats,
  getMyStudents,
  type LessonLog,
  type LessonMedia,
  type LessonLogWithMedia,
  type CreateLessonLogInput,
  type UpdateLessonLogInput,
  type AddMediaInput,
  type LessonStats,
} from './lesson-logs';

// Booking request actions
export {
  createBookingRequest,
  getMyBookingRequests,
  getBookingRequest,
  updateBookingRequestStatus,
  getBookingRequestCounts,
  markNotificationSent,
  type BookingRequest,
  type BookingRequestStatus,
  type CreateBookingRequestInput,
} from './booking-requests';
