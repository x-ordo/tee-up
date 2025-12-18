/**
 * Code Naming Conventions for Multi-Domain Extensibility
 * ======================================================
 *
 * 이 파일은 코드 내부에서 사용하는 범용적 변수명 규칙을 정의합니다.
 * UI에 표시되는 텍스트는 terms.ts를 사용하고,
 * 코드 변수/함수명은 이 규칙을 따릅니다.
 *
 * 핵심 원칙: "보여지는 건 골프, 내부는 범용"
 */

// =============================================================================
// 변수명 가이드라인
// =============================================================================

/**
 * ## 사람/역할 관련
 *
 * | 현재 (골프 특화)  | 권장 (범용)      | 설명                    |
 * |------------------|-----------------|------------------------|
 * | proId            | expertId        | 전문가 ID               |
 * | proName          | expertName      | 전문가 이름             |
 * | proProfile       | expertProfile   | 전문가 프로필           |
 * | golfer           | client          | 고객/클라이언트         |
 * | golferId         | clientId        | 고객 ID                 |
 *
 *
 * ## 서비스/상품 관련
 *
 * | 현재 (골프 특화)  | 권장 (범용)      | 설명                    |
 * |------------------|-----------------|------------------------|
 * | lessonPrice      | sessionPrice    | 세션 가격               |
 * | lessonId         | sessionId       | 세션 ID                 |
 * | lessonDuration   | sessionDuration | 세션 시간               |
 * | lessonType       | sessionType     | 세션 유형               |
 * | lessonSlot       | timeSlot        | 시간대                  |
 *
 *
 * ## 장소/시설 관련
 *
 * | 현재 (골프 특화)  | 권장 (범용)      | 설명                    |
 * |------------------|-----------------|------------------------|
 * | academy          | facility        | 시설                    |
 * | studio           | team            | 팀/그룹                 |
 * | studio           | organization    | 조직 (큰 단위)          |
 *
 *
 * ## 데이터베이스 테이블/컬럼
 *
 * | 현재             | 유지 또는 마이그레이션 | 설명                    |
 * |------------------|----------------------|------------------------|
 * | pro_profiles     | expert_profiles      | 전문가 프로필 테이블     |
 * | pro_id           | expert_id           | 전문가 FK               |
 * | lesson_price     | session_price       | 세션 가격               |
 *
 * 주의: DB 스키마 변경은 신중하게! 우선 코드 레벨에서 추상화 적용
 */

// =============================================================================
// 허용되는 도메인 특화 변수명 (예외)
// =============================================================================

/**
 * ## 골프 도메인 전용 기능
 *
 * 골프에만 해당하는 개념은 그대로 사용해도 됩니다:
 * - handicap (핸디캡)
 * - swing (스윙)
 * - round (라운드)
 * - teeTime (티타임)
 * - course (코스)
 *
 * 이런 개념은 다른 도메인에서 다르게 표현됨:
 * - 헬스: max1RM, routine, workout
 * - 필라테스: pose, flow, level
 */

// =============================================================================
// 코드 예시
// =============================================================================

/**
 * @example 잘못된 예시 (도메인 특화)
 * ```typescript
 * interface BookingSheetProps {
 *   proId: string;         // ❌ 골프 특화
 *   proName: string;       // ❌ 골프 특화
 *   lessonPrice: number;   // ❌ 골프 특화
 * }
 * ```
 *
 * @example 올바른 예시 (범용)
 * ```typescript
 * interface BookingSheetProps {
 *   expertId: string;      // ✅ 범용
 *   expertName: string;    // ✅ 범용
 *   sessionPrice: number;  // ✅ 범용
 * }
 * ```
 *
 * @example UI 텍스트 (terms.ts 사용)
 * ```tsx
 * import { TERMS, withExpertName } from '@/constants/terms';
 *
 * // Props는 범용, UI는 골프 특화
 * function BookingHeader({ expertName }: { expertName: string }) {
 *   return (
 *     <h1>{withExpertName(expertName)}의 {TERMS.SERVICE_NAME} 예약</h1>
 *     // 출력: "김철수 프로님의 레슨 예약"
 *   );
 * }
 * ```
 */

// =============================================================================
// Type Aliases (범용화 지원)
// =============================================================================

/**
 * 점진적 마이그레이션을 위한 타입 별칭
 * 기존 코드와 호환성을 유지하면서 새 명명 규칙 적용
 */

/** @deprecated proId 대신 expertId 사용 권장 */
export type ProId = string;

/** 범용 전문가 ID */
export type ExpertId = string;

/** @deprecated lessonId 대신 sessionId 사용 권장 */
export type LessonId = string;

/** 범용 세션 ID */
export type SessionId = string;

// =============================================================================
// ESLint Rule 제안 (향후 적용)
// =============================================================================

/*
// .eslintrc.js
module.exports = {
  rules: {
    // 도메인 특화 변수명 경고
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'Identifier[name=/^(pro|lesson|golfer)/i]',
        message: '범용 변수명 사용 권장: pro→expert, lesson→session, golfer→client'
      }
    ]
  }
};
*/
