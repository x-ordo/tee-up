# Screen: Landing - Pros (프로 랜딩)

**Route**: `/pro`
**Status**: Implemented
**Last Updated**: 2025-12-30
**Priority**: P1
**Dependencies**: Profile Templates, Pricing, Concierge

---

## 1. 화면 개요

### 목적
프로 골퍼에게 "프로필/홍보/일정 관리"를 중심으로 한 매니저 서비스를 소개하고, 프로 전환을 유도한다.

### 사용자 흐름
```
광고/직접 유입 → /pro → 서비스 가치 확인
  ├─ (Primary) 프로 등록 → /onboarding/quick-setup
  └─ (Secondary) 상담 요청 → 상담 방식 선택 → 리드 수집/운영팀 연결
```

### 접근 조건
- **인증 필요**: No
- **권한 수준**: guest

---

## 2. 레이아웃 구조

### 섹션 구성

1. **Hero (Pro Manager Positioning)**
   - 핵심 메시지: "프로 골퍼 전용 매니저 서비스"
   - Primary CTA: "프로 등록" → `/onboarding/quick-setup`
   - Secondary CTA: "상담 요청" → 상담 방식 선택 (채팅/폼/콜백)
   - 보상 메시지: "프로 인증 완료 시 24시간 내 노출 및 리드 연결 시작"
2. **Value Pillars**
   - 명품급 프로필 디자인
   - 홍보/PR 운영 지원
   - 일정/문의 관리 집중
3. **Concierge Tier**
   - 고액 구독 시 실제 매니저 배정
   - 커스텀 프로필 제작/운영 대행
4. **Template Gallery**
   - 템플릿 미리보기 (시각적 임팩트 강조)
5. **Proof & Trust**
   - 검증/신뢰 신호 (프로 인증, 안전/정책)
   - 응답/운영 SLA (평균 응답 시간, 프로필 완성 리드타임)
   - 성과 지표 (문의 전환/조회수 상승 사례)
   - 우선순위: 인증 배지 → 응답 SLA → 성과 지표
   - 파트너 로고/후기는 데이터 확보 후 옵션
6. **Pricing CTA**
   - 요금제 안내로 이동

---

## 3. 주요 컴포넌트

- `HeroProManager`
- `ValuePillars`
- `ConciergeTierCard`
- `TemplateGallery`
- `ConsultationChannelPicker`
- `ProofTrustStrip`
- `PricingCTA`

---

## 4. 데이터 요구사항

- 템플릿 미리보기 목록
- 요금제 요약 (Free/Basic/Pro/Concierge)
- Proof & Trust 지표
  - 프로 인증 배지 (협회/리그)
  - 응답 SLA (1차 응답 시간 기준)
  - 프로필 완성 리드타임 (운영 기준)
  - 성과 지표 (문의 전환율, 프로필 조회수 상승)
- 상담 요청 채널 옵션 (채팅/폼/콜백)
- 프로 등록 필수 수집 항목
  - 이름
  - 생년월일
  - 연락처
  - 프로 인증
  - 주요 활동 위치
  - 프로필 사진 1장
- 표시 규칙
  - 실데이터가 없으면 운영 기준 카피로 대체
  - 수치/사례는 검증된 데이터만 노출

### 4.1 Proof & Trust 데이터 소스 정의

| 지표 | 정의 | 데이터 소스 | 계산 방식 |
|------|------|-------------|-----------|
| 응답 SLA | 운영팀 1차 응답까지 걸린 시간 | `leads`, `messages` | 최근 30일 기준 중앙값(lead 생성 → 첫 응답) |
| 프로필 완성 리드타임 | 등록부터 승인까지 소요 시간 | `pro_profiles` | 중앙값(`approved_at - created_at`) |
| 전환율 | 프로필 방문 대비 문의 전환 | `pro_profiles`, `leads` | `total_leads / profile_views` (30일 기준) |

> 데이터가 부족한 경우 운영 기준 SLA 카피를 노출한다.

### 4.2 배치 작업 및 API/캐시 설계

- **배치 작업**: 매일 02:00 KST, 30일 구간 기준으로 지표 산출
  - 응답 SLA: lead 생성 시각과 첫 응답 메시지(운영팀/프로) 간 중앙값
  - 리드타임: `approved_at - created_at` 중앙값
  - 전환율: `total_leads / profile_views` (30일 기준)
- **저장소**: `ops_metrics` 테이블에 최신 스냅샷 저장
  - `metric_key`, `metric_value`, `calculated_at` 형태
- **API**: `getProofTrustMetrics` 서버 액션
  - `ops_metrics` 조회 + `unstable_cache` TTL 1시간
  - 캐시 태그: `proof-trust-metrics`
- **Fallback**: 데이터 부족 시 운영 기준 카피 출력

---

## 5. 인터랙션 정의

### 5.1 프로 등록 (Primary CTA)
1. **Given** 프로 사용자가 랜딩을 확인한 상태에서
2. **When** "프로 등록" CTA 클릭
3. **Then** `/onboarding/quick-setup`으로 이동

### 5.2 상담 요청 (Secondary CTA)
1. **Given** 프로 사용자가 컨시어지/커스텀 운영을 문의할 때
2. **When** "상담 요청" CTA 클릭
3. **Then** 상담 방식 선택 UI 노출
4. **Then** 선택한 채널로 연결 (리드 캡처/운영팀 응대)

### 5.3 CTA 우선순위
- 기본 강조는 "프로 등록"에 둔다.
- 고가 컨시어지 안내는 "상담 요청"으로 분리한다.
- 상담 방식은 사용자가 선택하도록 제공한다.

### 5.4 상담 채널 선택 UI/문구
- 옵션 1: **지금 채팅하기**
  - 서브카피: "지금 바로 요구사항을 빠르게 확인합니다"
- 옵션 2: **간단 상담 폼**
  - 서브카피: "필수 정보만 남기면 24시간 내 연락드립니다"
- 옵션 3: **콜백 예약**
  - 서브카피: "원하는 시간에 담당 매니저가 연락드립니다"
- 기본 선택 없음, 사용자가 직접 채널을 결정

### 5.5 상담 채널 실제 진입 경로
- **채팅**: 운영팀 카카오톡 오픈채팅 URL로 이동 (contact_method = `kakao`)
- **폼**: `/pro` 내 간단 상담 폼 제출 → `trackLead` (contact_method = `form`)
- **콜백 예약**: `/pro` 내 콜백 예약 제출 → `createBookingRequest` (preferred_time 포함)

---

## 6. 접근성 요구사항

- [ ] 주요 CTA는 키보드 포커스 가능
- [ ] 주요 가치 제안 문구는 명확한 대비
- [ ] 템플릿 미리보기는 이미지 대체 텍스트 제공

---

## 7. 에러 케이스

| 에러 유형 | 처리 |
|----------|------|
| 템플릿 미리보기 로딩 실패 | 기본 썸네일 표시 |

---

## 8. 관련 화면

- **다음 화면**: [Onboarding Quick Setup](./onboarding-quick-setup.md) 또는 `/onboarding/quick-setup`
- **연관 화면**: [Pricing](./pricing.md), [Dashboard Home](../04-dashboard/dashboard-home.md)
