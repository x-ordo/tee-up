# TEE:UP UI/UX Principles
## Korean Luxury Minimalism & Calm Control Design System

**Version:** 1.0.0
**Created:** 2025-12-01
**Status:** Approved
**Design Philosophy:** "Calm Control" (차분한 통제)

---

## Executive Summary

TEE:UP의 UI/UX 원칙은 **Korean Luxury Minimalism**을 기반으로 한 **"Calm Control"** 철학을 중심으로 구축됩니다. 고급 골프 레슨 매칭 플랫폼으로서, 시각적 고요함 속에서 완전한 투명성과 통제력을 제공하여 VIP 골퍼와 검증된 프로 모두에게 신뢰와 확신을 줍니다.

---

## 1. Core Philosophy: Calm Control (차분한 통제)

### 1.1 정의

> **"시각적 고요함 속에서 완전한 투명성과 통제력을 제공하는 디자인 철학"**

Calm Control은 복잡함을 명확함으로 변환합니다:
- **차분함 (Calm):** 인지 부하를 줄이는 시각적 평온함
- **통제 (Control):** 사용자가 항상 시스템 상태를 파악하고 다음 단계를 알 수 있음

### 1.2 핵심 원칙

| 원칙 | 설명 | 적용 |
|------|------|------|
| **Whitespace First** | 여백은 기능이다 | 모든 컴포넌트에 최소 24px 패딩 |
| **Data Clarity** | 데이터는 한눈에 스캔 가능해야 한다 | 큰 숫자, 명확한 레이블, 모노스페이스 폰트 |
| **Subtle Feedback** | 시스템 상태는 항상 보여야 한다 | 로딩, 성공, 에러 상태 표시 |
| **Progressive Disclosure** | 고급 기능은 필요할 때만 노출 | 점진적 정보 공개 |
| **No Surprises** | 파괴적 액션은 확인, 비용은 사전 공개 | 확인 모달, 투명한 가격 |

---

## 2. Visual Language: 90/10 Rule

### 2.1 색상 비율

```
┌─────────────────────────────────────────────────────────────┐
│   90% Neutrals    │   8% Accent    │   2% Functional       │
│   차분한 중립색   │   신뢰의 파랑  │   상태 표시           │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 색상 팔레트

**Base Neutrals (90%)**
```css
--calm-white: #FAFAF9      /* 페이지 배경 */
--calm-cloud: #F4F4F2      /* 카드 배경, 호버 */
--calm-stone: #E8E8E5      /* 테두리, 구분선 */
--calm-ash: #B8B8B3        /* 비활성 텍스트, 레이블 */
--calm-charcoal: #52524E   /* 본문 텍스트 */
--calm-obsidian: #1A1A17   /* 헤딩, 강조 */
```

**Accent Blue (8%)**
```css
--calm-accent: #3B82F6        /* 프라이머리 액션 */
--calm-accent-light: #DBEAFE  /* 호버, 포커스 링 */
--calm-accent-dark: #1E40AF   /* 액티브, 그라데이션 끝 */
```

**Functional Colors (2%)**
```css
--calm-success: #10B981 + bg  /* 성공 상태 */
--calm-warning: #F59E0B + bg  /* 경고 상태 */
--calm-error: #EF4444 + bg    /* 에러 상태 */
--calm-info: #8B5CF6 + bg     /* 정보 상태 */
```

### 2.3 색상 사용 규칙

| 요소 | 색상 | 이유 |
|------|------|------|
| 페이지 배경 | calm-white | 눈의 피로 감소 |
| 카드 배경 | white | 계층 구분 |
| 테이블 헤더 | calm-cloud | 시각적 분리 |
| 본문 텍스트 | calm-charcoal | 가독성과 부드러움 균형 |
| 헤딩 | calm-obsidian | 명확한 시각적 계층 |
| 프라이머리 CTA | accent gradient | 주목성과 신뢰감 |
| 링크 | calm-accent | 일관된 인터랙티브 요소 |

---

## 3. Typography System

### 3.1 폰트 선택

| 용도 | 폰트 | 이유 |
|------|------|------|
| Display/UI | Pretendard | 한국어 최적화, 현대적 |
| Body | Inter | 글로벌 표준, 가독성 |
| Data/Numbers | JetBrains Mono | 숫자 정렬, 데이터 명확성 |

### 3.2 타입 스케일

```
Display Large:   48px / 3rem     (히어로 타이틀)
Display Medium:  36px / 2.25rem  (섹션 타이틀)
Display Small:   30px / 1.875rem (카드 타이틀)
Body Large:      18px / 1.125rem (리드 텍스트)
Body Medium:     16px / 1rem     (본문)
Body Small:      14px / 0.875rem (보조 텍스트)
Body XS:         12px / 0.75rem  (캡션, 레이블)
```

### 3.3 타이포그래피 원칙

1. **대비를 통한 계층:** 크기와 굵기로 중요도 표현
2. **레이블은 대문자:** 12px, letter-spacing: 0.05em
3. **데이터는 모노:** 숫자와 지표는 `font-mono` 클래스 사용
4. **Line-height 규칙:** 헤딩 1.25, 본문 1.5, 장문 1.75

---

## 4. Spacing System

### 4.1 8px 기반 스케일

```
4px   (0.25rem) - 미세 조정
8px   (0.5rem)  - 요소 간 최소 간격
12px  (0.75rem) - 관련 요소 간격
16px  (1rem)    - 섹션 내 간격
24px  (1.5rem)  - 컴포넌트 패딩
32px  (2rem)    - 모달 패딩
48px  (3rem)    - 섹션 간격 (모바일)
64px  (4rem)    - 섹션 간격 (데스크톱)
96px  (6rem)    - 대형 섹션 간격
```

### 4.2 Whitespace 원칙

> **"여백을 두려워하지 마라. 여백은 인지 부하를 줄인다."**

| 컨텍스트 | 최소 패딩 | 권장 패딩 |
|----------|----------|----------|
| 카드 | 16px | 24px |
| 모달 | 24px | 32px |
| 버튼 | 12px v / 24px h | 12px v / 24px h |
| 섹션 간 | 48px | 64-96px |

### 4.3 반응형 조정

```
Mobile:  패딩 -25% (예: 24px → 18px)
Tablet:  기본값 유지
Desktop: 섹션 간격 +20%
```

---

## 5. Component Principles

### 5.1 버튼 (Buttons)

**Primary CTA**
- 그라데이션 배경 (accent → accent-dark)
- 글로우 섀도우 (glow-accent)
- 호버 시 brightness(1.1)
- 용도: 주요 액션 (예약하기, 가입하기)

**Secondary CTA**
- 흰색 배경, stone 테두리
- 호버 시 accent 테두리로 전환
- 용도: 보조 액션 (취소, 더보기)

**Ghost Button**
- 투명 배경
- 호버 시 accent-light 배경
- 용도: 텍스트 링크 대체, 인라인 액션

### 5.2 카드 (Cards)

```css
.card {
  background: white;
  border: 1px solid var(--calm-stone);
  border-radius: 16px;  /* --radius-2xl */
  box-shadow: var(--shadow-md);
}

.card:hover {
  border-color: var(--calm-accent);
  box-shadow: 0 10px 30px var(--glow-accent);
}
```

**원칙:**
- 테두리 기반 분리 (과도한 그림자 지양)
- 호버 시 미묘한 강조
- 둥근 모서리 (16-24px)

### 5.3 데이터 테이블 (Data Tables)

**설계 원칙:**
- 안정성 우선 (과도한 애니메이션 금지)
- 큰 폰트 (14-16px)
- 넉넉한 패딩 (px-6 py-4)
- 호버로 행 하이라이트

**구조:**
```
┌─ Table Header (calm-cloud 배경, uppercase) ─┐
├─ Row 1 (hover: calm-cloud)                  ─┤
├─ Row 2                                       ─┤
├─ Row 3                                       ─┤
└───────────────────────────────────────────────┘
```

### 5.4 입력 필드 (Inputs)

```css
.input {
  border: 2px solid var(--calm-stone);
  border-radius: 12px;
}

.input:focus {
  border-color: var(--calm-accent);
  ring: 4px var(--calm-accent-light);
}
```

**원칙:**
- 명확한 포커스 상태 (4px 링)
- 인라인 유효성 검사
- 에러 메시지는 구체적으로 (예: "이메일에 @를 포함해주세요")

---

## 6. Motion & Animation

### 6.1 Subtle Dynamism 원칙

> **"마이크로 인터랙션은 향상시키되, 방해하지 않는다."**

### 6.2 적용 영역

**적용 O:**
- 버튼 호버: brightness 증가, 섀도우 확장
- 카드 호버: 테두리 색상 변경, 글로우
- 로딩 상태: 부드러운 스피너
- 성공 확인: 미세한 스케일 인 (0.95 → 1.0)

**적용 X:**
- 데이터 테이블 (안정성 우선)
- 모달 배경 (차분함 유지)
- 텍스트 콘텐츠 (가독성 우선)

### 6.3 트랜지션 타이밍

```css
--transition-fast: 150ms ease-in-out  /* 호버, 토글 */
--transition-base: 300ms ease-in-out  /* 카드, 모달 */
--transition-slow: 500ms ease-in-out  /* 페이지 전환 */
```

### 6.4 키프레임 애니메이션

```css
fadeIn:   opacity 0 → 1, 0.3s
slideUp:  translateY(20px) → 0, opacity 0 → 1, 0.4s
scaleIn:  scale(0.95) → 1, opacity 0 → 1, 0.3s
```

---

## 7. Accessibility Standards

### 7.1 WCAG AA 준수

| 요구사항 | 기준 | 구현 |
|----------|------|------|
| 텍스트 대비 | 4.5:1 이상 | charcoal on white: 7.2:1 |
| 큰 텍스트 대비 | 3:1 이상 | obsidian on white: 15.3:1 |
| UI 컴포넌트 | 3:1 이상 | accent on white: 4.5:1 |

### 7.2 키보드 접근성

- 모든 인터랙티브 요소 Tab 접근 가능
- 포커스 상태 명확히 표시 (4px 링, accent 색상)
- Skip to main content 링크 제공
- 모달에서 포커스 트랩

### 7.3 스크린 리더 지원

- 시맨틱 HTML (`<nav>`, `<main>`, `<article>`)
- 아이콘 전용 버튼에 ARIA 라벨
- 모든 이미지에 alt 텍스트
- 동적 콘텐츠에 live region

### 7.4 터치 타겟

- 최소 44x44px (모바일)
- 인접 타겟 간 8px 간격

---

## 8. Responsive Design

### 8.1 Mobile-First 원칙

```
320px  - 최소 지원 너비
640px  - sm 브레이크포인트
768px  - md 브레이크포인트
1024px - lg 브레이크포인트
1280px - xl 브레이크포인트
1536px - 2xl 브레이크포인트
```

### 8.2 적응형 vs 반응형

> **"모바일은 데스크톱이 아니다. 신중하게 적응하라."**

| 요소 | 모바일 | 데스크톱 |
|------|--------|----------|
| 메트릭 카드 | 1열 스택 | 2x2 그리드 |
| 네비게이션 | 햄버거 메뉴 | 전체 노출 |
| 테이블 | 카드형 변환 | 전통적 테이블 |
| 모달 | 전체 화면 | 중앙 팝업 |

### 8.3 터치 최적화

- 스와이프 제스처 지원 (채팅, 갤러리)
- 탭 영역 확대
- 호버 의존 UI 회피

---

## 9. User Flow Principles

### 9.1 3-Click Rule

> **"주요 기능은 3클릭 이내에 도달 가능해야 한다."**

예시:
```
홈페이지 → 프로 디렉토리 → 프로 프로필 → 예약 모달
(1 click)   (2 clicks)      (3 clicks)
```

### 9.2 Progressive Disclosure

복잡한 정보는 단계적으로 공개:
1. **1단계:** 핵심 정보만 표시
2. **2단계:** "더보기" 클릭 시 상세 정보
3. **3단계:** 모달/새 페이지에서 전체 정보

### 9.3 Confirmation Patterns

**파괴적 액션 확인:**
```
[액션 버튼 클릭] → [확인 모달] → [최종 확인]
```

**성공 피드백:**
```
[액션 완료] → [성공 메시지] → [다음 단계 안내]
```

---

## 10. Performance UX

### 10.1 로딩 상태

| 대기 시간 | 표시 방법 |
|-----------|-----------|
| < 200ms | 즉각 응답, 표시 없음 |
| 200ms - 2s | 스피너 또는 스켈레톤 |
| > 2s | 프로그레스 바 + 메시지 |

### 10.2 스켈레톤 로딩

```
┌─────────────────────────────────────┐
│ ████████████ (타이틀)               │
│ ████████████████████████ (설명)    │
│ ██████████ (버튼)                   │
└─────────────────────────────────────┘
```

**원칙:**
- 레이아웃 안정성 유지 (CLS 방지)
- 실제 콘텐츠 구조 반영
- 부드러운 펄스 애니메이션

### 10.3 Optimistic UI

사용자 액션 즉시 반영:
```
[메시지 전송] → [즉시 UI 업데이트] → [서버 응답 대기]
                                    └→ 실패 시 롤백
```

---

## 11. Trust & Credibility

### 11.1 신뢰 요소

| 요소 | 구현 |
|------|------|
| 검증 배지 | KPGA/LPGA 인증 표시 |
| 투명한 가격 | 사전 비용 공개 |
| 리뷰/평점 | 실제 사용자 피드백 |
| 응답 시간 | "평균 24시간 내 응답" 표시 |

### 11.2 다크 패턴 금지

**금지 사항:**
- 숨겨진 비용
- 강제 업셀링
- 취소 어렵게 만들기
- 기만적 UI 패턴

**권장 사항:**
- 명확한 가격 표시
- 쉬운 구독 취소
- 투명한 데이터 사용
- 사용자 동의 기반 커뮤니케이션

---

## 12. Error Handling UX

### 12.1 에러 메시지 원칙

**나쁜 예:**
```
"Invalid input"
"Error occurred"
```

**좋은 예:**
```
"이메일 주소에 @를 포함해주세요."
"네트워크 연결을 확인해주세요. 다시 시도하시겠습니까?"
```

### 12.2 에러 표시 패턴

1. **인라인 유효성 검사:** 필드 아래 즉시 표시
2. **폼 상단 요약:** 제출 실패 시 전체 에러 목록
3. **토스트 알림:** 시스템 에러

### 12.3 복구 경로 제공

모든 에러 상태에서:
- 명확한 문제 설명
- 해결 방법 제시
- "다시 시도" 또는 대안 제공

---

## 13. Design Tokens Reference

### 13.1 CSS 변수 요약

```css
/* Colors */
--calm-white, --calm-cloud, --calm-stone, --calm-ash
--calm-charcoal, --calm-obsidian
--calm-accent, --calm-accent-light, --calm-accent-dark
--calm-success, --calm-warning, --calm-error, --calm-info

/* Typography */
--text-display-lg/md/sm
--text-body-lg/md/sm/xs
--font-light/regular/medium/semibold/bold
--leading-tight/normal/relaxed
--tracking-tight/normal/wide

/* Spacing */
--space-1 through --space-32

/* Effects */
--shadow-sm/md/lg/xl/2xl
--radius-sm/md/lg/xl/2xl/full
--transition-fast/base/slow
--glass-bg, --glass-border
--glow-accent, --glow-success
```

### 13.2 Tailwind 확장

```javascript
// tailwind.config.ts colors
calm: {
  white: '#FAFAF9',
  cloud: '#F4F4F2',
  stone: '#E8E8E5',
  ash: '#B8B8B3',
  charcoal: '#52524E',
  obsidian: '#1A1A17',
  accent: '#3B82F6',
  'accent-light': '#DBEAFE',
  'accent-dark': '#1E40AF',
}
```

---

## 14. Checklist: New Component/Page

새로운 컴포넌트나 페이지 생성 시 확인:

- [ ] 90/10 색상 비율 준수
- [ ] 최소 24px 패딩 적용
- [ ] 모바일 우선 반응형 설계
- [ ] 포커스 상태 명확히 표시
- [ ] 스켈레톤 로딩 구현
- [ ] 에러 상태 처리
- [ ] WCAG AA 대비 검증
- [ ] 터치 타겟 44px 이상
- [ ] 시맨틱 HTML 사용
- [ ] 아이콘에 ARIA 라벨

---

## 15. Principles Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    TEE:UP UI/UX 7원칙                        │
├─────────────────────────────────────────────────────────────┤
│  1. Whitespace is a Feature — 여백을 두려워하지 마라        │
│  2. Data is King — 지표는 한눈에 스캔 가능하게              │
│  3. Trust Through Transparency — 시스템 상태와 다음 단계 공개│
│  4. Monochrome + Accent — 90% 중립색, 10% 강조색           │
│  5. Subtle > Flashy — 마이크로 인터랙션은 향상, 방해 금지    │
│  6. Mobile is Not Desktop — 신중하게 적응                   │
│  7. Korean Aesthetic — 세련되고 절제된 럭셔리                │
└─────────────────────────────────────────────────────────────┘
```

---

**본 문서는 TEE:UP의 모든 UI/UX 결정의 기준이 됩니다.**

---

*Document Version: 1.0.0*
*Last Updated: 2025-12-01*
*Aligned With: CONTEXT.md, UX_STRATEGY.md, global.css*
