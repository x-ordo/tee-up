---
title: TEE:UP TDD 개발 계획
version: 2.0.0
status: Active
owner: "@tech-lead"
created: 2025-11-24
updated: 2025-11-25
reviewers: ["@product-manager", "@backend-lead"]
language: Korean (한국어)
---

# plan.md

## TDD 기반 개발 계획

> **본 문서는 실시간으로 업데이트되는 TDD 개발 작업 목록입니다.**
> **모든 기능은 테스트 케이스를 먼저 작성한 후 구현합니다.**

---

## 변경 이력 (Changelog)

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 2.0.0 | 2025-11-25 | @tech-lead | Master Prompt 표준 적용, TDD 구조 강화 |
| 1.0.0 | 2025-11-24 | @tech-lead | 최초 작성 |

## 관련 문서 (Related Documents)

- [CONTEXT.md](CONTEXT.md) — 시스템 컨텍스트
- [TDD_GUIDE.md](docs/guides/TDD_GUIDE.md) — TDD 가이드
- [PRD.md](docs/specs/PRD.md) — 제품 요구사항

---

## TDD 사이클

```
┌─────────┐     ┌─────────┐     ┌───────────┐
│   RED   │ ──▶ │  GREEN  │ ──▶ │ REFACTOR  │
│ (실패)  │     │ (통과)  │     │ (개선)    │
└─────────┘     └─────────┘     └───────────┘
     │                               │
     └───────────────────────────────┘
              반복 (Repeat)
```

**각 작업 상태:**
- 🔴 **RED**: 테스트 작성 완료 (실패 상태)
- 🟢 **GREEN**: 테스트 통과 (최소 구현)
- 🔵 **REFACTOR**: 리팩토링 완료
- ⬜ **PENDING**: 작업 대기
- 🚧 **IN PROGRESS**: 진행 중

---

## 📊 전체 진행 현황

| Phase | 완료 | 진행중 | 대기 | 진행률 |
|-------|------|--------|------|--------|
| Phase 1: MVP | 12 | 3 | 5 | 60% |
| Phase 2: Beta | 0 | 2 | 18 | 10% |
| Phase 3: Scale | 0 | 0 | 15 | 0% |
| **Total** | **12** | **5** | **38** | **22%** |

---

## 🎯 Phase 1: MVP (4주) - "Showcase"

### 목표

강남 프로 10명의 고퀄리티 프로필 업로드 및 웹 런칭

### Week 1: Foundation ✅ COMPLETED

#### FE-001: Next.js 프로젝트 설정

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| App Router 설정 | 🔵 DONE | ✅ | ✅ |
| TypeScript strict mode | 🔵 DONE | ✅ | ✅ |
| Tailwind CSS 설정 | 🔵 DONE | ✅ | ✅ |
| Pretendard 폰트 | 🔵 DONE | ✅ | ✅ |

**테스트 케이스:**
```typescript
// tests/unit/setup.test.ts
describe('Project Setup', () => {
  it('should have TypeScript strict mode enabled', () => {
    // tsconfig.json의 strict: true 확인
  });

  it('should load Pretendard font correctly', () => {
    // 폰트 로딩 확인
  });
});
```

#### FE-002: 디자인 시스템

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| Color Palette (CSS Variables) | 🔵 DONE | ✅ | ✅ |
| Typography System | 🔵 DONE | ✅ | ✅ |
| Component Classes | 🔵 DONE | ✅ | ✅ |
| Design Tokens | 🔵 DONE | ✅ | ✅ |

---

### Week 2: Pro Profiles & Directory ✅ COMPLETED

#### FE-003: 프로 프로필 페이지

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| Hero Section | 🔵 DONE | ✅ | ✅ |
| Video Overlay | 🔵 DONE | ✅ | ✅ |
| Verification Badge | 🔵 DONE | ✅ | ✅ |
| Stats Display | 🔵 DONE | ✅ | ✅ |
| Specialty Tags | 🔵 DONE | ✅ | ✅ |
| Pricing Display | 🔵 DONE | ✅ | ✅ |
| CTA Buttons | 🔵 DONE | ✅ | ✅ |

**테스트 케이스:**
```typescript
// tests/unit/components/ProProfile.test.tsx
describe('ProProfile', () => {
  it('should display pro name and bio', () => {
    render(<ProProfile pro={mockPro} />);
    expect(screen.getByText('김지영')).toBeInTheDocument();
  });

  it('should show verification badge when verified', () => {
    render(<ProProfile pro={{ ...mockPro, verified: true }} />);
    expect(screen.getByTestId('verification-badge')).toBeVisible();
  });

  it('should display correct pricing format', () => {
    render(<ProProfile pro={mockPro} />);
    expect(screen.getByText('₩150,000')).toBeInTheDocument();
  });
});
```

#### FE-004: 프로 디렉토리

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| Search Bar | 🔵 DONE | ✅ | ✅ |
| Filter Pills | 🔵 DONE | ✅ | ✅ |
| Grid Layout | 🔵 DONE | ✅ | ✅ |
| Pro Cards | 🔵 DONE | ✅ | ✅ |
| Empty State | 🔵 DONE | ✅ | ✅ |

**테스트 케이스:**
```typescript
// tests/unit/components/ProDirectory.test.tsx
describe('ProDirectory', () => {
  it('should filter pros by specialty', () => {
    render(<ProDirectory pros={mockPros} />);
    fireEvent.click(screen.getByText('드라이버'));
    expect(screen.getAllByTestId('pro-card')).toHaveLength(3);
  });

  it('should search pros by name', () => {
    render(<ProDirectory pros={mockPros} />);
    fireEvent.change(screen.getByPlaceholderText('검색'), {
      target: { value: '김지영' }
    });
    expect(screen.getAllByTestId('pro-card')).toHaveLength(1);
  });

  it('should show empty state when no results', () => {
    render(<ProDirectory pros={[]} />);
    expect(screen.getByText('검색 결과가 없습니다')).toBeInTheDocument();
  });
});
```

---

### Week 3: Admin Panel 🚧 IN PROGRESS

#### BE-001: 관리자 인증

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| Supabase Auth 통합 | 🟢 GREEN | ✅ | ✅ |
| 이메일/비밀번호 로그인 | 🟢 GREEN | ✅ | ✅ |
| 세션 관리 (쿠키) | 🟢 GREEN | ✅ | ✅ |
| 보호된 라우트 미들웨어 | 🟢 GREEN | ✅ | ✅ |
| 로그아웃 기능 | 🟢 GREEN | ✅ | ✅ |

**테스트 케이스:**
```typescript
// tests/integration/auth.test.ts
describe('Admin Authentication', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@teeup.kr', password: 'secure123' });

    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@teeup.kr', password: 'wrong' });

    expect(response.status).toBe(401);
  });

  it('should protect admin routes', async () => {
    const response = await request(app)
      .get('/api/admin/dashboard');

    expect(response.status).toBe(401);
  });
});
```

#### FE-005: 관리자 대시보드

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| 대시보드 레이아웃 | 🟢 GREEN | ✅ | ✅ |
| 지표 요약 위젯 | 🟢 GREEN | ✅ | ✅ |
| 프로 관리 테이블 | 🚧 IN PROGRESS | 🔴 | ⬜ |
| 채팅 관리 인터페이스 | ⬜ PENDING | ⬜ | ⬜ |

#### FE-006: 프로 검증 시스템

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| 대기 중인 신청 목록 | ⬜ PENDING | ⬜ | ⬜ |
| 프로필 검토 인터페이스 | ⬜ PENDING | ⬜ | ⬜ |
| 승인/거절 기능 | ⬜ PENDING | ⬜ | ⬜ |
| 승인된 프로 목록 | ⬜ PENDING | ⬜ | ⬜ |

---

### Week 4: Integration & Polish ⬜ PENDING

#### FE-007: 카카오톡 통합

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| 카카오톡 링크 버튼 | ⬜ PENDING | ⬜ | ⬜ |
| 딥링크 설정 | ⬜ PENDING | ⬜ | ⬜ |
| 메시지 템플릿 | ⬜ PENDING | ⬜ | ⬜ |
| 전환 추적 | ⬜ PENDING | ⬜ | ⬜ |

#### FE-008: 랜딩 페이지 개선

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| SEO 최적화 | ⬜ PENDING | ⬜ | ⬜ |
| Open Graph 메타 | ⬜ PENDING | ⬜ | ⬜ |
| 성능 최적화 | ⬜ PENDING | ⬜ | ⬜ |
| 접근성 감사 | ⬜ PENDING | ⬜ | ⬜ |

#### QA-001: 테스트 및 QA

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| 크로스 브라우저 테스트 | ⬜ PENDING | ⬜ | ⬜ |
| 모바일 디바이스 테스트 | ⬜ PENDING | ⬜ | ⬜ |
| Lighthouse > 90 | ⬜ PENDING | ⬜ | ⬜ |
| 보안 리뷰 | ⬜ PENDING | ⬜ | ⬜ |

---

## 🚀 Phase 2: Beta (8주) - "Lock-in"

### Week 5-6: 인증 및 데이터베이스 통합 🚧 IN PROGRESS

#### BE-002: 사용자 인증

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| 회원가입 (이메일) | 🚧 IN PROGRESS | 🔴 | ⬜ |
| 로그인/로그아웃 | ⬜ PENDING | ⬜ | ⬜ |
| 비밀번호 재설정 | ⬜ PENDING | ⬜ | ⬜ |
| 프로필 관리 | ⬜ PENDING | ⬜ | ⬜ |

**테스트 케이스 (RED 상태):**
```typescript
// tests/integration/user-auth.test.ts
describe('User Authentication', () => {
  it('should register new user with valid email', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'golfer@test.com',
        password: 'Password123!',
        name: '홍길동',
        phone: '010-1234-5678',
        role: 'golfer'
      });

    expect(response.status).toBe(201);
    expect(response.body.data.user.email).toBe('golfer@test.com');
  });

  it('should reject duplicate email registration', async () => {
    // 첫 번째 등록
    await request(app).post('/api/auth/signup').send({
      email: 'duplicate@test.com',
      password: 'Password123!',
      name: '홍길동',
      role: 'golfer'
    });

    // 중복 등록 시도
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'duplicate@test.com',
        password: 'Password123!',
        name: '김철수',
        role: 'golfer'
      });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });

  it('should validate password strength', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'weak@test.com',
        password: '123',  // 약한 비밀번호
        name: '홍길동',
        role: 'golfer'
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('WEAK_PASSWORD');
  });
});
```

---

### Week 7-8: 실시간 채팅 ⬜ PENDING

#### BE-003: 채팅 인프라

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| Supabase Realtime 설정 | ⬜ PENDING | ⬜ | ⬜ |
| 채팅방 테이블 | ⬜ PENDING | ⬜ | ⬜ |
| 메시지 테이블 | ⬜ PENDING | ⬜ | ⬜ |
| 프레즌스 추적 | ⬜ PENDING | ⬜ | ⬜ |

#### FE-009: 채팅 UI

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| 채팅 인터페이스 | ⬜ PENDING | ⬜ | ⬜ |
| 메시지 버블 | ⬜ PENDING | ⬜ | ⬜ |
| 타이핑 인디케이터 | ⬜ PENDING | ⬜ | ⬜ |
| 읽음 표시 | ⬜ PENDING | ⬜ | ⬜ |

#### BE-004: 리드 추적

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| 채팅방 생성 시 리드 카운트 | ⬜ PENDING | ⬜ | ⬜ |
| 프로 대시보드 리드 표시 | ⬜ PENDING | ⬜ | ⬜ |
| 무료 티어 제한 적용 | ⬜ PENDING | ⬜ | ⬜ |
| 구독 업그레이드 프롬프트 | ⬜ PENDING | ⬜ | ⬜ |

---

### Week 9-10: 프로 대시보드 ⬜ PENDING

#### FE-010: 대시보드 지표

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| 프로필 조회수 | ⬜ PENDING | ⬜ | ⬜ |
| 리드 카운트 | ⬜ PENDING | ⬜ | ⬜ |
| 매칭 레슨 수 | ⬜ PENDING | ⬜ | ⬜ |
| 평균 평점 | ⬜ PENDING | ⬜ | ⬜ |

#### FE-011: 분석 위젯

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| 조회수 트렌드 차트 | ⬜ PENDING | ⬜ | ⬜ |
| 리드 전환 퍼널 | ⬜ PENDING | ⬜ | ⬜ |
| 인기 전문분야 | ⬜ PENDING | ⬜ | ⬜ |

---

### Week 11-12: 구독 결제 ⬜ PENDING

#### BE-005: Toss Payments 통합

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| Toss SDK 설정 | ⬜ PENDING | ⬜ | ⬜ |
| 결제 모달 | ⬜ PENDING | ⬜ | ⬜ |
| 구독 플랜 선택 | ⬜ PENDING | ⬜ | ⬜ |
| 체크아웃 플로우 | ⬜ PENDING | ⬜ | ⬜ |
| 결제 확인 페이지 | ⬜ PENDING | ⬜ | ⬜ |

#### BE-006: 구독 로직

| 항목 | 상태 | 테스트 | 구현 |
|------|------|--------|------|
| 구독 티어 생성 | ⬜ PENDING | ⬜ | ⬜ |
| 월간 결제 주기 | ⬜ PENDING | ⬜ | ⬜ |
| 리드 제한 적용 | ⬜ PENDING | ⬜ | ⬜ |
| 자동 갱신 처리 | ⬜ PENDING | ⬜ | ⬜ |
| 취소 플로우 | ⬜ PENDING | ⬜ | ⬜ |

---

## 📈 Phase 3: Scale (Future)

### Month 4-6: 수익 최적화

- [ ] A/B 테스트 가격 실험
- [ ] 티어별 가격 최적화
- [ ] 프로모션 캠페인
- [ ] 추천 프로그램

### Month 7-9: AI 매칭

- [ ] 골퍼 선호도 학습
- [ ] 프로 추천 알고리즘
- [ ] "이 프로와 비슷한" 기능
- [ ] 개인화 이메일 캠페인

### Month 10-12: 모바일 및 확장

- [ ] React Native 프로젝트
- [ ] iOS 앱 개발
- [ ] Android 앱 개발
- [ ] 푸시 알림
- [ ] 앱스토어/플레이스토어 출시

---

## 🔧 기술 부채 (Technical Debt)

### 높은 우선순위

| 항목 | 상태 | 비고 |
|------|------|------|
| TypeScript strict mode 전체 적용 | ⬜ PENDING | 현재 부분 적용 |
| 글로벌 에러 바운더리 | ⬜ PENDING | |
| 로딩 스켈레톤 추가 | ⬜ PENDING | |
| next/image 최적화 | ⬜ PENDING | |
| API 에러 표준화 | ⬜ PENDING | |

### 중간 우선순위

| 항목 | 상태 | 비고 |
|------|------|------|
| 단위 테스트 추가 | ⬜ PENDING | Jest + RTL |
| E2E 테스트 추가 | ⬜ PENDING | Playwright |
| 코드 스플리팅 | ⬜ PENDING | |
| SEO (sitemap, robots.txt) | ⬜ PENDING | |
| 번들 사이즈 최적화 | ⬜ PENDING | < 200KB gzip |

### 낮은 우선순위

| 항목 | 상태 | 비고 |
|------|------|------|
| 다크 모드 | ⬜ PENDING | 선택 |
| 다국어 지원 (i18n) | ⬜ PENDING | |
| ARIA 라벨 추가 | ⬜ PENDING | 접근성 |
| PWA 지원 | ⬜ PENDING | |
| Framer Motion 애니메이션 | ⬜ PENDING | |

---

## 📋 이번 주 작업 (Current Sprint)

### 우선순위 1: 관리자 패널 개발

- [ ] `/admin` 라우트 생성
- [ ] 관리자 대시보드 레이아웃
- [ ] 프로 검증 테이블 구현
- [ ] 승인/거절 기능

### 우선순위 2: 문서화

- [ ] CONTEXT.md 관리자 기능 업데이트
- [ ] 관리자 엔드포인트 API 스펙 작성
- [ ] 관리자 사용자 가이드

### 우선순위 3: 테스트

- [ ] 홈페이지 수동 QA
- [ ] 모바일 반응형 테스트
- [ ] 성능 벤치마크

---

## 📊 테스트 커버리지 목표

| 테스트 유형 | 현재 | 목표 | 상태 |
|------------|------|------|------|
| 단위 테스트 | 45% | 80% | 🟡 |
| 통합 테스트 | 30% | 60% | 🟡 |
| E2E 테스트 | 10% | 100% (Critical) | 🔴 |

---

## 🚧 알려진 이슈

| ID | 제목 | 우선순위 | 상태 |
|----|------|----------|------|
| #001 | 모바일에서 프로 카드 호버 효과 이상 | P2 | OPEN |
| #002 | 검색 필터 초기화 안됨 | P2 | OPEN |
| #003 | 이미지 로딩 지연 | P1 | IN PROGRESS |

---

## 📝 다음 스프린트 계획

**Sprint 5 (Week 5-6):**
1. 사용자 인증 시스템 완료
2. 골퍼/프로 프로필 관리
3. 프로필 완성도 위자드
4. 아바타 업로드

---

**이 문서는 매일 업데이트됩니다. 최신 상태를 확인하세요.**

**Last Updated:** 2025-11-25
**Next Review:** 2025-12-01

═══════════════════════════════════════════════════════════════
✅ VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════
- [x] 목적이 명확하게 정의됨
- [x] TDD 사이클 설명 포함
- [x] 테스트 케이스 예시 포함
- [x] 상태 추적 가능
- [x] 우선순위 명시
- [x] 기술 부채 추적
- [x] 한국어(Korean)로 작성됨
═══════════════════════════════════════════════════════════════
