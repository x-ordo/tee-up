/**
 * Structured Error Codes for TEE:UP
 *
 * Error code format: {DOMAIN}_{CATEGORY}_{SPECIFIC}
 *
 * Domains:
 * - AUTH: Authentication & Authorization
 * - PROFILE: User/Pro profile operations
 * - PORTFOLIO: Portfolio management
 * - LEAD: Lead tracking
 * - STUDIO: Studio/team operations
 * - BOOKING: Booking & scheduling
 * - PAYMENT: Payment & billing
 * - DB: Database operations
 * - VALIDATION: Input validation
 * - INTERNAL: Internal server errors
 */

// ============================================
// Authentication Errors (AUTH_*)
// ============================================
export const AUTH_NOT_AUTHENTICATED = 'AUTH_NOT_AUTHENTICATED';
export const AUTH_SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED';
export const AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED';
export const AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS';
export const AUTH_EMAIL_NOT_VERIFIED = 'AUTH_EMAIL_NOT_VERIFIED';

// ============================================
// Profile Errors (PROFILE_*)
// ============================================
export const PROFILE_NOT_FOUND = 'PROFILE_NOT_FOUND';
export const PROFILE_CREATE_FAILED = 'PROFILE_CREATE_FAILED';
export const PROFILE_UPDATE_FAILED = 'PROFILE_UPDATE_FAILED';
export const PROFILE_SLUG_TAKEN = 'PROFILE_SLUG_TAKEN';
export const PROFILE_NOT_APPROVED = 'PROFILE_NOT_APPROVED';

// ============================================
// Portfolio Errors (PORTFOLIO_*)
// ============================================
export const PORTFOLIO_NOT_FOUND = 'PORTFOLIO_NOT_FOUND';
export const PORTFOLIO_SECTION_NOT_FOUND = 'PORTFOLIO_SECTION_NOT_FOUND';
export const PORTFOLIO_UPDATE_FAILED = 'PORTFOLIO_UPDATE_FAILED';
export const PORTFOLIO_SECTION_LIMIT = 'PORTFOLIO_SECTION_LIMIT';

// ============================================
// Lead Errors (LEAD_*)
// ============================================
export const LEAD_CREATE_FAILED = 'LEAD_CREATE_FAILED';
export const LEAD_NOT_FOUND = 'LEAD_NOT_FOUND';
export const LEAD_LIMIT_EXCEEDED = 'LEAD_LIMIT_EXCEEDED';
export const LEAD_INVALID_CONTACT = 'LEAD_INVALID_CONTACT';

// ============================================
// Studio Errors (STUDIO_*)
// ============================================
export const STUDIO_NOT_FOUND = 'STUDIO_NOT_FOUND';
export const STUDIO_CREATE_FAILED = 'STUDIO_CREATE_FAILED';
export const STUDIO_SLUG_TAKEN = 'STUDIO_SLUG_TAKEN';
export const STUDIO_MEMBER_LIMIT = 'STUDIO_MEMBER_LIMIT';

// ============================================
// Booking Errors (BOOKING_*)
// ============================================
export const BOOKING_NOT_FOUND = 'BOOKING_NOT_FOUND';
export const BOOKING_CREATE_FAILED = 'BOOKING_CREATE_FAILED';
export const BOOKING_SLOT_UNAVAILABLE = 'BOOKING_SLOT_UNAVAILABLE';
export const BOOKING_ALREADY_EXISTS = 'BOOKING_ALREADY_EXISTS';

// ============================================
// Payment Errors (PAYMENT_*)
// ============================================
export const PAYMENT_FAILED = 'PAYMENT_FAILED';
export const PAYMENT_INVALID_AMOUNT = 'PAYMENT_INVALID_AMOUNT';
export const PAYMENT_REFUND_FAILED = 'PAYMENT_REFUND_FAILED';

// ============================================
// Database Errors (DB_*)
// ============================================
export const DB_CONNECTION_FAILED = 'DB_CONNECTION_FAILED';
export const DB_QUERY_FAILED = 'DB_QUERY_FAILED';
export const DB_CONSTRAINT_VIOLATION = 'DB_CONSTRAINT_VIOLATION';
export const DB_TIMEOUT = 'DB_TIMEOUT';

// ============================================
// Validation Errors (VALIDATION_*)
// ============================================
export const VALIDATION_FAILED = 'VALIDATION_FAILED';
export const VALIDATION_REQUIRED_FIELD = 'VALIDATION_REQUIRED_FIELD';
export const VALIDATION_INVALID_FORMAT = 'VALIDATION_INVALID_FORMAT';
export const VALIDATION_OUT_OF_RANGE = 'VALIDATION_OUT_OF_RANGE';

// ============================================
// Internal Errors (INTERNAL_*)
// ============================================
export const INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';
export const INTERNAL_UNKNOWN = 'INTERNAL_UNKNOWN';

/**
 * Error code type union
 */
export type ErrorCode =
  // Auth
  | typeof AUTH_NOT_AUTHENTICATED
  | typeof AUTH_SESSION_EXPIRED
  | typeof AUTH_UNAUTHORIZED
  | typeof AUTH_INVALID_CREDENTIALS
  | typeof AUTH_EMAIL_NOT_VERIFIED
  // Profile
  | typeof PROFILE_NOT_FOUND
  | typeof PROFILE_CREATE_FAILED
  | typeof PROFILE_UPDATE_FAILED
  | typeof PROFILE_SLUG_TAKEN
  | typeof PROFILE_NOT_APPROVED
  // Portfolio
  | typeof PORTFOLIO_NOT_FOUND
  | typeof PORTFOLIO_SECTION_NOT_FOUND
  | typeof PORTFOLIO_UPDATE_FAILED
  | typeof PORTFOLIO_SECTION_LIMIT
  // Lead
  | typeof LEAD_CREATE_FAILED
  | typeof LEAD_NOT_FOUND
  | typeof LEAD_LIMIT_EXCEEDED
  | typeof LEAD_INVALID_CONTACT
  // Studio
  | typeof STUDIO_NOT_FOUND
  | typeof STUDIO_CREATE_FAILED
  | typeof STUDIO_SLUG_TAKEN
  | typeof STUDIO_MEMBER_LIMIT
  // Booking
  | typeof BOOKING_NOT_FOUND
  | typeof BOOKING_CREATE_FAILED
  | typeof BOOKING_SLOT_UNAVAILABLE
  | typeof BOOKING_ALREADY_EXISTS
  // Payment
  | typeof PAYMENT_FAILED
  | typeof PAYMENT_INVALID_AMOUNT
  | typeof PAYMENT_REFUND_FAILED
  // Database
  | typeof DB_CONNECTION_FAILED
  | typeof DB_QUERY_FAILED
  | typeof DB_CONSTRAINT_VIOLATION
  | typeof DB_TIMEOUT
  // Validation
  | typeof VALIDATION_FAILED
  | typeof VALIDATION_REQUIRED_FIELD
  | typeof VALIDATION_INVALID_FORMAT
  | typeof VALIDATION_OUT_OF_RANGE
  // Internal
  | typeof INTERNAL_SERVER_ERROR
  | typeof INTERNAL_UNKNOWN;

/**
 * Human-readable error messages (Korean)
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // Auth
  [AUTH_NOT_AUTHENTICATED]: '로그인이 필요합니다.',
  [AUTH_SESSION_EXPIRED]: '세션이 만료되었습니다. 다시 로그인해주세요.',
  [AUTH_UNAUTHORIZED]: '접근 권한이 없습니다.',
  [AUTH_INVALID_CREDENTIALS]: '이메일 또는 비밀번호가 올바르지 않습니다.',
  [AUTH_EMAIL_NOT_VERIFIED]: '이메일 인증이 필요합니다.',
  // Profile
  [PROFILE_NOT_FOUND]: '프로필을 찾을 수 없습니다.',
  [PROFILE_CREATE_FAILED]: '프로필 생성에 실패했습니다.',
  [PROFILE_UPDATE_FAILED]: '프로필 업데이트에 실패했습니다.',
  [PROFILE_SLUG_TAKEN]: '이미 사용 중인 프로필 주소입니다.',
  [PROFILE_NOT_APPROVED]: '승인되지 않은 프로필입니다.',
  // Portfolio
  [PORTFOLIO_NOT_FOUND]: '포트폴리오를 찾을 수 없습니다.',
  [PORTFOLIO_SECTION_NOT_FOUND]: '포트폴리오 섹션을 찾을 수 없습니다.',
  [PORTFOLIO_UPDATE_FAILED]: '포트폴리오 업데이트에 실패했습니다.',
  [PORTFOLIO_SECTION_LIMIT]: '포트폴리오 섹션 수 제한을 초과했습니다.',
  // Lead
  [LEAD_CREATE_FAILED]: '문의 등록에 실패했습니다.',
  [LEAD_NOT_FOUND]: '문의를 찾을 수 없습니다.',
  [LEAD_LIMIT_EXCEEDED]: '월간 문의 수신 한도를 초과했습니다.',
  [LEAD_INVALID_CONTACT]: '유효하지 않은 연락처입니다.',
  // Studio
  [STUDIO_NOT_FOUND]: '스튜디오를 찾을 수 없습니다.',
  [STUDIO_CREATE_FAILED]: '스튜디오 생성에 실패했습니다.',
  [STUDIO_SLUG_TAKEN]: '이미 사용 중인 스튜디오 주소입니다.',
  [STUDIO_MEMBER_LIMIT]: '스튜디오 멤버 수 제한을 초과했습니다.',
  // Booking
  [BOOKING_NOT_FOUND]: '예약을 찾을 수 없습니다.',
  [BOOKING_CREATE_FAILED]: '예약 생성에 실패했습니다.',
  [BOOKING_SLOT_UNAVAILABLE]: '해당 시간대는 예약이 불가능합니다.',
  [BOOKING_ALREADY_EXISTS]: '이미 예약이 존재합니다.',
  // Payment
  [PAYMENT_FAILED]: '결제 처리에 실패했습니다.',
  [PAYMENT_INVALID_AMOUNT]: '유효하지 않은 결제 금액입니다.',
  [PAYMENT_REFUND_FAILED]: '환불 처리에 실패했습니다.',
  // Database
  [DB_CONNECTION_FAILED]: '서버 연결에 실패했습니다.',
  [DB_QUERY_FAILED]: '데이터 조회에 실패했습니다.',
  [DB_CONSTRAINT_VIOLATION]: '데이터 제약 조건 위반입니다.',
  [DB_TIMEOUT]: '서버 응답 시간이 초과되었습니다.',
  // Validation
  [VALIDATION_FAILED]: '입력값 검증에 실패했습니다.',
  [VALIDATION_REQUIRED_FIELD]: '필수 항목이 누락되었습니다.',
  [VALIDATION_INVALID_FORMAT]: '입력 형식이 올바르지 않습니다.',
  [VALIDATION_OUT_OF_RANGE]: '입력 값이 허용 범위를 벗어났습니다.',
  // Internal
  [INTERNAL_SERVER_ERROR]: '서버 오류가 발생했습니다.',
  [INTERNAL_UNKNOWN]: '알 수 없는 오류가 발생했습니다.',
};

/**
 * Get user-friendly error message from error code
 */
export function getErrorMessage(code: ErrorCode): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[INTERNAL_UNKNOWN];
}
