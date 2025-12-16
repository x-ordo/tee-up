# Feature Specification: UI/UX와 컬러 개선

**Feature Branch**: `002-ui-ux-color`
**Created**: 2025-12-02
**Status**: Ready
**Input**: User description: "UI/UX와 컬러 개선"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dark Mode Support (Priority: P1) 🎯 MVP

사용자가 다크 모드와 라이트 모드 사이를 전환하여 선호하는 환경에서 플랫폼을 사용할 수 있다.

**Why this priority**: 다크 모드는 현대 웹 애플리케이션의 필수 기능이며, 사용자 경험과 접근성을 크게 향상시킨다. 야간 사용 시 눈의 피로를 줄이고, 배터리 수명을 절약하며, 사용자 선호도에 맞춘 개인화를 제공한다.

**Independent Test**: 시스템 설정 또는 토글 버튼을 통해 다크/라이트 모드를 전환하고, 모든 페이지에서 일관된 테마가 적용되는지 확인

**Acceptance Scenarios**:

1. **Given** 사용자가 라이트 모드 상태에서, **When** 테마 토글 버튼을 클릭하면, **Then** 페이지가 다크 모드로 전환되고 설정이 저장된다
2. **Given** 사용자가 다크 모드를 선호하는 시스템 설정을 가지고 있을 때, **When** 처음 사이트를 방문하면, **Then** 자동으로 다크 모드가 적용된다
3. **Given** 사용자가 다크 모드 상태에서, **When** 프로필 페이지를 방문하면, **Then** 모든 UI 요소(카드, 버튼, 텍스트)가 다크 테마에 맞게 표시된다
4. **Given** 사용자가 테마를 변경했을 때, **When** 브라우저를 닫고 다시 방문하면, **Then** 이전에 선택한 테마가 유지된다

---

### User Story 2 - Micro-interactions & Animations (Priority: P1)

사용자가 버튼, 카드, 링크 등과 상호작용할 때 미세한 애니메이션 피드백을 받아 직관적이고 고급스러운 사용 경험을 느낀다.

**Why this priority**: 마이크로인터랙션은 사용자 행동에 대한 즉각적인 피드백을 제공하여 인터페이스의 반응성과 품질을 높인다. Korean Luxury Minimalism 디자인 철학에서 섬세한 애니메이션은 "Calm Control" 경험의 핵심이다.

**Note**: 이 스토리는 인터랙션 패턴(hover, click, fade-in)을 정의합니다. 구체적인 easing curve와 duration 토큰은 US6 (M3 Integration)에서 정의됩니다.

**Independent Test**: 버튼 hover, 카드 hover, 링크 클릭 등의 인터랙션에서 부드러운 전환 효과가 있는지 확인

**Acceptance Scenarios**:

1. **Given** 사용자가 버튼 위에 마우스를 올리면, **When** hover 상태가 되면, **Then** 부드러운 색상 변화와 미세한 scale 효과(1.02x)가 나타난다
2. **Given** 사용자가 카드 컴포넌트 위에 마우스를 올리면, **When** hover 상태가 되면, **Then** 카드가 미세하게 상승하는 듯한 그림자 변화가 나타난다
3. **Given** 사용자가 페이지를 처음 로드하면, **When** 콘텐츠가 나타날 때, **Then** 위에서 아래로 순차적으로 fade-in 애니메이션이 적용된다
4. **Given** 사용자가 모달을 열면, **When** 모달이 나타날 때, **Then** 배경 오버레이가 서서히 어두워지고 모달이 중앙에서 확대되며 나타난다

---

### User Story 3 - Color Palette Extension & Brand Colors (Priority: P2)

플랫폼이 확장된 색상 팔레트와 외부 브랜드 색상(카카오톡 등)을 일관되게 사용하여 시각적 통일성을 유지한다.

**Why this priority**: 색상 시스템의 확장은 디자인 일관성의 기반이다. 성공, 경고, 에러 상태 및 외부 브랜드 연동에 필요한 색상을 체계적으로 관리해야 한다.

**Independent Test**: 다양한 UI 상태(성공, 경고, 에러)와 카카오톡 버튼에서 일관된 색상이 적용되는지 확인

**Acceptance Scenarios**:

1. **Given** 폼 제출이 성공했을 때, **When** 성공 메시지가 표시되면, **Then** 정의된 success 색상(초록 계열)이 적용된다
2. **Given** 유효성 검사 경고가 있을 때, **When** 경고 메시지가 표시되면, **Then** 정의된 warning 색상(노란 계열)이 적용된다
3. **Given** 카카오톡 연동 버튼이 표시될 때, **When** 사용자가 버튼을 보면, **Then** 카카오톡 브랜드 가이드라인에 맞는 색상(#FEE500)이 적용된다
4. **Given** 개발자가 새로운 컴포넌트를 만들 때, **When** 색상을 적용하면, **Then** CSS 변수를 통해 일관된 색상을 쉽게 사용할 수 있다

---

### User Story 4 - Loading States & Skeleton UI (Priority: P2)

데이터를 로딩하는 동안 사용자에게 시각적 피드백을 제공하여 애플리케이션이 응답하고 있음을 알린다.

**Why this priority**: 로딩 상태의 명확한 표시는 사용자 경험의 핵심이다. 스켈레톤 UI는 콘텐츠 레이아웃을 미리 보여주어 체감 로딩 시간을 줄인다.

**Independent Test**: 프로필 목록 로딩 시 스켈레톤 UI가 표시되고, 데이터 로드 후 실제 콘텐츠로 전환되는지 확인

**Acceptance Scenarios**:

1. **Given** 프로 디렉토리 페이지에 접속했을 때, **When** 프로필 데이터를 로딩 중이면, **Then** 카드 형태의 스켈레톤 UI가 shimmer 효과와 함께 표시된다
2. **Given** 프로필 상세 페이지에 접속했을 때, **When** 이미지가 로딩 중이면, **Then** 이미지 영역에 스켈레톤 플레이스홀더가 표시된다
3. **Given** 데이터 로딩이 완료되면, **When** 실제 콘텐츠가 표시될 때, **Then** 스켈레톤에서 콘텐츠로 부드러운 전환이 이루어진다
4. **Given** 버튼을 클릭하여 액션을 실행할 때, **When** 처리 중이면, **Then** 버튼에 스피너가 표시되고 disabled 상태가 된다

---

### User Story 5 - Empty States & Error States (Priority: P3)

데이터가 없거나 오류가 발생한 상황에서 사용자에게 명확하고 도움이 되는 피드백을 제공한다.

**Why this priority**: 빈 상태와 에러 상태는 사용자 이탈의 주요 원인이다. 친절하고 행동 지향적인 메시지로 사용자를 안내해야 한다.

**Independent Test**: 검색 결과가 없을 때 빈 상태 UI가, 네트워크 오류 시 에러 UI가 적절히 표시되는지 확인

**Acceptance Scenarios**:

1. **Given** 프로 검색 결과가 없을 때, **When** 빈 목록이 표시되면, **Then** SVG 아이콘(Heroicons 또는 커스텀)과 "검색 조건을 변경해 보세요" 같은 안내 메시지가 표시된다 *(Design Assets: EmptyState 컴포넌트는 `icon` prop으로 React 컴포넌트를 받아 유연하게 아이콘을 지정. 기본값은 MagnifyingGlassIcon, InboxIcon, ChatBubbleIcon 등 Heroicons 사용)*
2. **Given** API 요청이 실패했을 때, **When** 에러 상태가 되면, **Then** 사용자 친화적인 에러 메시지와 "다시 시도" 버튼이 표시된다
3. **Given** 신규 사용자가 채팅 목록을 볼 때, **When** 대화 기록이 없으면, **Then** "아직 대화가 없습니다. 프로에게 먼저 문의해 보세요" 메시지와 CTA 버튼이 표시된다
4. **Given** 404 페이지에 도달했을 때, **When** 페이지가 표시되면, **Then** 브랜드에 맞는 디자인의 404 페이지와 홈으로 돌아가기 버튼이 표시된다

---

### User Story 6 - Material Design 3 Design System Integration (Priority: P1)

플랫폼이 Material Design 3 (M3) 디자인 시스템의 핵심 요소를 채택하여 현대적이고 자연스러운 사용자 경험을 제공한다.

**Why this priority**: M3는 Google의 최신 디자인 시스템으로, 물리 기반 모션, 체계화된 색상 역할, 표준화된 형태 토큰을 제공한다. 이를 TEE:UP의 "Calm Control" 철학과 조화롭게 통합하여 프리미엄 골프 매칭 플랫폼에 적합한 세련된 경험을 구현한다.

**Independent Test**: M3 Standard Motion이 적용된 버튼/카드 인터랙션이 자연스럽고, 색상 역할이 일관되게 적용되며, shape 토큰이 표준화되어 있는지 확인

**Acceptance Scenarios**:

1. **Given** 사용자가 버튼을 클릭하면, **When** 버튼이 눌리는 효과가 나타날 때, **Then** M3 Standard Easing (`cubic-bezier(0.2, 0, 0, 1)`)으로 자연스러운 물리 기반 애니메이션이 적용된다
2. **Given** 개발자가 컴포넌트를 스타일링할 때, **When** 색상을 적용하면, **Then** M3 Color Roles (surface, on-surface, outline 등)를 사용하여 의미론적으로 일관된 색상을 적용할 수 있다
3. **Given** 다크 모드가 활성화되면, **When** 카드나 모달이 표시될 때, **Then** Tonal Elevation으로 표면 색상이 단계적으로 밝아져 깊이가 표현된다
4. **Given** 컴포넌트의 border-radius를 설정할 때, **When** shape 토큰을 사용하면, **Then** M3 Shape Scale (4px, 8px, 12px, 16px, 24px)에 맞는 일관된 둥글기가 적용된다

---

### Edge Cases

- 사용자가 테마를 빠르게 여러 번 전환할 때: 200ms 디바운스 적용하여 마지막 상태만 반영 (애니메이션 중첩 방지)
- 시스템 테마 변경 이벤트를 감지하여 자동으로 테마가 전환되어야 한다
- 애니메이션이 reduced motion 설정을 존중해야 한다 (prefers-reduced-motion)
- 스켈레톤 UI가 실제 콘텐츠와 유사한 레이아웃을 가져야 한다
- 에러 유형별 다른 메시지 표시:
  - **네트워크 오류** (fetch failed, timeout): "인터넷 연결을 확인해 주세요"
  - **클라이언트 오류** (4xx): "요청을 처리할 수 없습니다" (404는 별도 페이지)
  - **서버 오류** (5xx): "서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요"
- M3 Expressive Motion Scheme은 프리미엄 브랜드 이미지와 맞지 않으므로 Standard Scheme만 사용한다
- Dynamic Color (사용자 배경화면 기반)는 브랜드 일관성을 해치므로 적용하지 않는다
- localStorage 사용 불가 시 (프라이빗 브라우징, 저장 용량 초과): 테마 토글은 정상 작동하되 세션 종료 시 설정이 초기화됨 (시스템 설정으로 폴백)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support light and dark mode themes
- **FR-002**: System MUST persist user theme preference in localStorage
- **FR-003**: System MUST detect and respect system-level theme preference (prefers-color-scheme)
- **FR-004**: System MUST provide a theme toggle accessible from all pages
- **FR-005**: System MUST apply smooth transitions for all interactive elements:
  - Hover/focus transitions: 150-200ms (--transition-fast)
  - State changes: 200-300ms (--transition-base)
  - Page-level animations: 300-500ms (--transition-slow)
  - Maximum duration: 300ms for user-initiated interactions
- **FR-006**: System MUST respect prefers-reduced-motion for users who prefer reduced animations
- **FR-007**: System MUST define CSS variables for all colors including success, warning, error, and brand colors
- **FR-008**: System MUST provide skeleton UI components for card, list, and profile layouts
- **FR-009**: System MUST show loading spinners for button actions
- **FR-010**: System MUST display user-friendly empty state messages with actionable CTAs
- **FR-011**: System MUST display user-friendly error state messages with retry options
- **FR-012**: System MUST maintain WCAG AA color contrast ratios in both themes:
  - Normal text (< 18pt / 24px): minimum 4.5:1 contrast ratio
  - Large text (≥ 18pt / 24px or 14pt bold): minimum 3:1 contrast ratio
  - UI components and graphical objects: minimum 3:1 contrast ratio
- **FR-014**: System MUST provide consistent hover states across all clickable elements
- **FR-015**: System MUST implement M3 Standard Motion Scheme easing curves:
  - Standard: `cubic-bezier(0.2, 0, 0, 1)` for general transitions
  - Standard Decelerate: `cubic-bezier(0, 0, 0, 1)` for entering elements
  - Standard Accelerate: `cubic-bezier(0.3, 0, 1, 1)` for exiting elements
- **FR-016**: System MUST implement M3 Duration Tokens:
  - Short (50-200ms): micro-interactions, ripples
  - Medium (250-400ms): state changes, hover effects
  - Long (450-500ms): page-level animations, modals
- **FR-017**: System MUST implement M3 Color Roles for semantic color usage:
  - Surface roles: surface, surface-variant, on-surface, on-surface-variant
  - Outline roles: outline, outline-variant
  - Container roles: primary-container, error-container, etc.
- **FR-018**: System MUST implement M3 Shape Scale tokens:
  - Extra Small: 4px (chips, small badges)
  - Small: 8px (buttons, inputs)
  - Medium: 12px (cards, dialogs)
  - Large: 16px (modals, sheets)
  - Extra Large: 24px (hero sections)
  - Full: 9999px (pills, avatars)
- **FR-019**: System MUST implement Tonal Elevation for dark mode depth:
  - Surface-dim: base dark surface
  - Surface: elevated surface level 1
  - Surface-bright: elevated surface level 2+
- **FR-020**: System MUST maintain backward compatibility with existing --calm-* tokens

### Key Entities

- **Theme**: light | dark - 사용자의 현재 테마 설정
- **ThemePreference**: system | light | dark - 사용자의 테마 선호 설정
- **LoadingState**: idle | loading | success | error - 데이터 로딩 상태
- **ColorToken**: CSS 변수로 정의된 색상 값 (--calm-*, --success-*, --error-*, --brand-*)
- **M3MotionToken**: M3 easing 및 duration 토큰 (--ease-standard, --duration-medium2, etc.)
- **M3ColorRole**: M3 semantic color role (--surface, --on-surface, --outline, etc.)
- **M3ShapeToken**: M3 shape scale 토큰 (--shape-small, --shape-medium, etc.)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 모든 페이지에서 다크/라이트 모드 전환 시 0.3초 이내에 테마가 적용된다
- **SC-002**: 다크 모드에서 모든 텍스트가 WCAG AA 기준 4.5:1 이상의 명암비를 유지한다
- **SC-003**: 모든 인터랙티브 요소에 hover 상태 전환이 200ms 이내에 완료된다
- **SC-004**: 데이터 로딩 시 100ms 초과 지연되면 스켈레톤 UI가 표시된다 (>100ms, 100ms 이하는 스켈레톤 없이 대기)
- **SC-005**: 에러 상태에서 "다시 시도" 버튼 클릭 시 해당 요청이 재실행된다
- **SC-006**: lighthouse 접근성 점수 90점 이상 유지
- **SC-007**: prefers-reduced-motion 설정 시 모든 애니메이션이 즉시 전환으로 대체된다
- **SC-008**: M3 Standard Easing 적용 시 모든 transition 속성에 `cubic-bezier(0.2, 0, 0, 1)` 또는 정의된 M3 easing 변수(--ease-standard, --ease-standard-decelerate, --ease-standard-accelerate)가 사용된다
- **SC-009**: M3 Color Roles 사용 시 모든 컴포넌트에서 일관된 의미론적 색상이 적용된다
- **SC-010**: M3 Shape Scale 사용 시 모든 border-radius가 표준화된 토큰 값을 사용한다

## Assumptions

- 현재 디자인 시스템(global.css)의 CSS 변수 구조를 확장하여 사용한다
- 다크 모드 색상은 Korean Luxury Minimalism 철학에 맞춰 차분한 톤으로 설계한다
- 애니메이션은 Tailwind CSS의 transition 유틸리티와 커스텀 keyframes를 사용한다
- localStorage를 사용하여 테마 설정을 저장한다 (서버 동기화 불필요)
- M3 디자인 시스템 요소는 TEE:UP의 "Calm Control" 철학과 조화롭게 통합된다
- M3 Standard Motion Scheme만 사용하여 차분하고 프리미엄한 느낌을 유지한다
- 기존 --calm-* 토큰과 새로운 M3 토큰이 병행 사용될 수 있다

## Out of Scope

- 사용자별 커스텀 색상 테마 (개인화된 색상 선택)
- 고대비 모드 (WCAG AAA 수준의 특수 접근성 모드)
- 복잡한 페이지 전환 애니메이션 (route transition)
- 3D 또는 물리 기반 스프링 애니메이션 (CSS cubic-bezier로 근사치 사용)
- 서버 측 테마 설정 저장 (인증된 사용자 동기화)
- M3 Dynamic Color (사용자 배경화면 기반 색상 생성)
- M3 Expressive Motion Scheme (바운스가 있는 과장된 애니메이션)
- M3 전체 컴포넌트 라이브러리 도입 (필요한 토큰만 선택적 도입)

## Clarifications

### Session 2025-12-10

- Q: What should happen when localStorage is unavailable? → A: Allow toggle but don't persist (session-only theme)
- Q: Should skeleton UI appear at exactly 100ms delay, or only when delay exceeds 100ms? → A: Show skeleton when delay > 100ms (greater than)
- Q: How should rapid theme toggle clicks be handled? → A: Debounce: ignore rapid clicks, apply last state after 200ms

## References

- [Material Design 3 Official Documentation](https://m3.material.io/)
- [M3 Color System](https://m3.material.io/styles/color/system/how-the-system-works)
- [M3 Motion & Easing](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)
- [M3 Shape System](https://m3.material.io/styles/shape/corner-radius-scale)
- [M3 Elevation](https://m3.material.io/styles/elevation/tokens)
