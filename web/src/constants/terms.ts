/**
 * Terminology Abstraction Layer
 * =============================
 *
 * 이 파일은 UI에 표시되는 모든 도메인 특화 용어를 중앙 관리합니다.
 * 현재는 골프 도메인에 맞춰져 있지만, 추후 다른 도메인(헬스, 필라테스 등)으로
 * 확장할 때 이 파일만 수정하면 됩니다.
 *
 * ## Architecture Decision
 * - UI Text: 골프 특화 용어 사용 (프로, 레슨, 회원님)
 * - Internal Code: 범용 용어 사용 (expert, session, client)
 *
 * ## Future Expansion Example
 * ```typescript
 * // config/domain.ts
 * export type Domain = 'golf' | 'fitness' | 'pilates';
 * export const CURRENT_DOMAIN: Domain = 'golf';
 *
 * // 도메인별 용어 매핑
 * const DOMAIN_TERMS: Record<Domain, typeof TERMS> = {
 *   golf: GOLF_TERMS,
 *   fitness: FITNESS_TERMS,
 *   pilates: PILATES_TERMS,
 * };
 * ```
 */

// =============================================================================
// 도메인 용어 (UI 표시용)
// =============================================================================

/**
 * UI에 표시되는 도메인 특화 용어
 *
 * @example
 * import { TERMS } from '@/constants/terms';
 *
 * // Before: 하드코딩
 * <h1>프로님의 레슨 예약</h1>
 *
 * // After: 추상화
 * <h1>{TERMS.EXPERT_TITLE}님의 {TERMS.SERVICE_NAME} 예약</h1>
 */
export const TERMS = {
  // === 전문가 관련 ===
  /** 전문가 호칭 (골프: 프로, 헬스: 트레이너, 필라테스: 강사) */
  EXPERT_TITLE: '프로',
  /** 전문가 호칭 + 존칭 */
  EXPERT_TITLE_HONORIFIC: '프로님',
  /** 전문가 복수형 */
  EXPERT_TITLE_PLURAL: '프로들',

  // === 서비스 관련 ===
  /** 서비스명 (골프: 레슨, 헬스: PT, 필라테스: 수업) */
  SERVICE_NAME: '레슨',
  /** 서비스 복수형 */
  SERVICE_NAME_PLURAL: '레슨들',
  /** 서비스 예약 */
  SERVICE_BOOKING: '레슨 예약',
  /** 프리미엄 서비스 */
  SERVICE_PREMIUM: 'VIP 레슨',

  // === 고객 관련 ===
  /** 고객 호칭 (존칭) */
  CLIENT_HONORIFIC: '회원님',
  /** 고객 (일반) */
  CLIENT: '회원',
  /** 고객 복수형 */
  CLIENT_PLURAL: '회원',
  /** 잠재 고객 */
  PROSPECT: '예비 회원',

  // === 장소/시설 관련 ===
  /** 시설명 (골프: 아카데미, 헬스: 센터) */
  FACILITY_NAME: '아카데미',
  /** 팀/그룹 (골프: 스튜디오, 헬스: 팀) */
  TEAM_NAME: '스튜디오',

  // === 액션/동사 관련 ===
  /** 서비스 받다 */
  TAKE_SERVICE: '레슨받기',
  /** 문의하기 */
  CONTACT_ACTION: '문의하기',
  /** 예약하기 */
  BOOK_ACTION: '예약하기',

  // === 포트폴리오 관련 ===
  /** 포트폴리오/프로필 페이지 */
  PORTFOLIO_PAGE: '포트폴리오',
  /** 전문가 소개 */
  EXPERT_INTRO: '프로 소개',
  /** 커리큘럼/프로그램 */
  CURRICULUM: '커리큘럼',
  /** 가격/요금 */
  PRICING: '수강료',

  // === 기타 ===
  /** 플랫폼명 */
  PLATFORM_NAME: 'TEE:UP',
  /** 도메인 설명 */
  DOMAIN_DESCRIPTION: '골프',
} as const;

// =============================================================================
// 헬퍼 함수
// =============================================================================

/**
 * 전문가명을 포함한 문구 생성
 * @example
 * withExpertName('김철수') // '김철수 프로님'
 */
export function withExpertName(name: string): string {
  return `${name} ${TERMS.EXPERT_TITLE_HONORIFIC}`;
}

/**
 * 서비스 예약 문구 생성
 * @example
 * bookingTitle('김철수') // '김철수 프로님과의 레슨 예약'
 */
export function bookingTitle(expertName: string): string {
  return `${withExpertName(expertName)}과의 ${TERMS.SERVICE_NAME} 예약`;
}

/**
 * 프리미엄 서비스 예약 문구
 * @example
 * premiumBookingTitle('김철수') // '김철수 프로님의 VIP 레슨'
 */
export function premiumBookingTitle(expertName: string): string {
  return `${withExpertName(expertName)}의 ${TERMS.SERVICE_PREMIUM}`;
}

/**
 * 서비스 확정 메시지
 */
export function serviceConfirmedMessage(expertName: string): string {
  return `${withExpertName(expertName)}과의 ${TERMS.SERVICE_NAME}이 확정되었습니다.`;
}

/**
 * 예약 대기 메시지
 */
export function bookingPendingMessage(expertName: string): string {
  return `${withExpertName(expertName)}이 예약을 확인하면 연락드릴 예정입니다.`;
}

// =============================================================================
// Type Exports
// =============================================================================

export type TermKey = keyof typeof TERMS;
export type TermValue = (typeof TERMS)[TermKey];

// =============================================================================
// 미래 확장을 위한 도메인별 용어 (참고용 주석)
// =============================================================================

/*
// 헬스/PT 도메인
const FITNESS_TERMS = {
  EXPERT_TITLE: '트레이너',
  EXPERT_TITLE_HONORIFIC: '트레이너님',
  SERVICE_NAME: 'PT',
  SERVICE_BOOKING: 'PT 예약',
  CLIENT_HONORIFIC: '회원님',
  FACILITY_NAME: '피트니스 센터',
  CURRICULUM: '프로그램',
  PRICING: '이용권',
} as const;

// 필라테스/요가 도메인
const PILATES_TERMS = {
  EXPERT_TITLE: '강사',
  EXPERT_TITLE_HONORIFIC: '강사님',
  SERVICE_NAME: '수업',
  SERVICE_BOOKING: '수업 예약',
  CLIENT_HONORIFIC: '회원님',
  FACILITY_NAME: '스튜디오',
  CURRICULUM: '클래스',
  PRICING: '수강료',
} as const;
*/
