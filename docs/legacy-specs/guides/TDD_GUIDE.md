---
title: TEE:UP TDD 가이드
version: 1.0.0
status: Approved
owner: "@tech-lead"
created: 2025-11-25
updated: 2025-11-25
reviewers: ["@backend-lead", "@frontend-lead"]
language: Korean (한국어)
---

# TDD_GUIDE.md

## 테스트 주도 개발 가이드

> **본 문서는 TEE:UP 프로젝트의 TDD(Test-Driven Development) 방법론을 정의합니다.**

---

## 변경 이력 (Changelog)

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0.0 | 2025-11-25 | @tech-lead | 최초 작성 |

## 관련 문서 (Related Documents)

- [TEST_STRATEGY_GUIDE.md](TEST_STRATEGY_GUIDE.md) — 테스트 전략
- [CLEAN_CODE_GUIDE.md](CLEAN_CODE_GUIDE.md) — 클린 코드 가이드
- [plan.md](../../plan.md) — TDD 개발 계획

---

## 1. TDD 개요

### 1.1 TDD란?

TDD(Test-Driven Development)는 테스트를 먼저 작성하고, 그 테스트를 통과하는 코드를 구현하는 개발 방법론입니다.

### 1.2 TDD 사이클

```
┌─────────────────────────────────────────────────────────────┐
│                    TDD 사이클 (Red-Green-Refactor)           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│       ┌─────────┐                                           │
│       │  🔴 RED │ ◀─────────────────────────┐              │
│       │  (실패) │                            │              │
│       └────┬────┘                            │              │
│            │                                 │              │
│            │ 테스트 작성                      │              │
│            ▼                                 │              │
│       ┌─────────┐                            │              │
│       │ 🟢 GREEN│                            │              │
│       │  (통과) │                            │              │
│       └────┬────┘                            │              │
│            │                                 │              │
│            │ 최소 구현                        │              │
│            ▼                                 │              │
│       ┌──────────┐                           │              │
│       │🔵REFACTOR│ ──────────────────────────┘              │
│       │  (개선)  │                                          │
│       └──────────┘                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 TDD의 이점

| 이점 | 설명 |
|------|------|
| **설계 개선** | 테스트 가능한 코드 = 좋은 설계 |
| **문서화** | 테스트가 살아있는 문서 역할 |
| **회귀 방지** | 변경 시 기존 기능 보호 |
| **자신감** | 리팩토링 시 안전망 제공 |
| **빠른 피드백** | 문제 조기 발견 |

---

## 2. TDD 3단계

### 2.1 RED: 실패하는 테스트 작성

**목표:** 원하는 동작을 테스트로 정의

```typescript
// ❌ 테스트 실패 (함수가 아직 없음)
describe('UserAuthService', () => {
  describe('authenticate', () => {
    it('should return user when valid credentials provided', async () => {
      // Given (준비)
      const authService = new UserAuthService();
      const email = 'test@example.com';
      const password = 'ValidPassword123';

      // When (실행)
      const result = await authService.authenticate(email, password);

      // Then (검증)
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(email);
      expect(result.token).toBeDefined();
    });

    it('should throw error when invalid password provided', async () => {
      // Given
      const authService = new UserAuthService();
      const email = 'test@example.com';
      const password = 'wrong-password';

      // When & Then
      await expect(
        authService.authenticate(email, password)
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
```

### 2.2 GREEN: 테스트를 통과하는 최소 코드 작성

**목표:** 가장 간단하게 테스트 통과

```typescript
// ✅ 테스트 통과 (최소 구현)
class UserAuthService {
  async authenticate(email: string, password: string): Promise<AuthResult> {
    // 최소 구현 - 일단 테스트만 통과하면 됨
    const user = await this.userRepository.findByEmail(email);

    if (!user || password !== user.password) {
      throw new Error('Invalid credentials');
    }

    return {
      user: { email: user.email },
      token: 'dummy-token'
    };
  }
}
```

### 2.3 REFACTOR: 코드 개선

**목표:** 테스트를 유지하면서 코드 품질 개선

```typescript
// 🔵 리팩토링 (코드 품질 개선)
class UserAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService
  ) {}

  async authenticate(email: string, password: string): Promise<AuthResult> {
    // 1. 사용자 조회
    const user = await this.findUserOrThrow(email);

    // 2. 비밀번호 검증
    await this.verifyPasswordOrThrow(password, user.hashedPassword);

    // 3. 토큰 생성
    const token = await this.tokenService.createAccessToken(user.id);

    return {
      user: this.mapToUserDto(user),
      token
    };
  }

  private async findUserOrThrow(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }
    return user;
  }

  private async verifyPasswordOrThrow(
    plainPassword: string,
    hashedPassword: string
  ): Promise<void> {
    const isValid = await this.passwordService.verify(plainPassword, hashedPassword);
    if (!isValid) {
      throw new InvalidCredentialsError();
    }
  }

  private mapToUserDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name
    };
  }
}
```

---

## 3. 테스트 작성 규칙

### 3.1 테스트 명명 규칙

```typescript
// ✅ 좋은 예: 명확한 동작 설명
describe('ProProfileService', () => {
  describe('getBySlug', () => {
    it('should return profile when valid slug provided', () => {});
    it('should throw NotFoundError when profile does not exist', () => {});
    it('should return only verified profiles for public access', () => {});
  });

  describe('create', () => {
    it('should create profile with generated slug', () => {});
    it('should throw ValidationError when required fields missing', () => {});
  });
});

// ❌ 나쁜 예: 모호한 이름
describe('test', () => {
  it('test1', () => {});
  it('works', () => {});
  it('should work correctly', () => {});
});
```

### 3.2 AAA 패턴 (Arrange-Act-Assert)

```typescript
it('should calculate total price with discount', () => {
  // Arrange (준비) - 테스트 데이터 설정
  const cart = new ShoppingCart();
  cart.addItem({ name: '골프공', price: 50000, quantity: 2 });
  const discount = new PercentageDiscount(10); // 10% 할인

  // Act (실행) - 테스트 대상 실행
  const total = cart.calculateTotal(discount);

  // Assert (검증) - 결과 확인
  expect(total).toBe(90000); // 100000 - 10%
});
```

### 3.3 Given-When-Then 패턴

```typescript
describe('ChatRoom', () => {
  it('should increment lead count when first message sent', async () => {
    // Given: 골퍼와 프로가 있고
    const golfer = await createTestUser({ role: 'golfer' });
    const pro = await createTestUser({ role: 'pro' });
    const chatRoom = await chatService.createRoom(golfer.id, pro.id);

    // When: 첫 메시지를 보내면
    await chatService.sendMessage(chatRoom.id, golfer.id, '레슨 문의드립니다');

    // Then: 프로의 리드 카운트가 증가해야 함
    const proProfile = await proService.getByUserId(pro.id);
    expect(proProfile.monthlyLeadCount).toBe(1);
  });
});
```

---

## 4. 테스트 종류

### 4.1 단위 테스트 (Unit Test)

```typescript
// 단위 테스트: 단일 함수/클래스 테스트
describe('PriceFormatter', () => {
  it('should format Korean Won correctly', () => {
    expect(formatKRW(1000)).toBe('₩1,000');
    expect(formatKRW(1234567)).toBe('₩1,234,567');
    expect(formatKRW(0)).toBe('₩0');
  });

  it('should handle negative values', () => {
    expect(formatKRW(-1000)).toBe('-₩1,000');
  });
});
```

### 4.2 통합 테스트 (Integration Test)

```typescript
// 통합 테스트: 여러 컴포넌트 통합 테스트
describe('ProfileAPI Integration', () => {
  let app: Express;
  let testDb: TestDatabase;

  beforeAll(async () => {
    testDb = await setupTestDatabase();
    app = createApp(testDb);
  });

  afterAll(async () => {
    await testDb.cleanup();
  });

  it('should return profiles with pagination', async () => {
    // Given: 테스트 프로필 생성
    await testDb.createProfiles(25);

    // When: API 호출
    const response = await request(app)
      .get('/api/profiles')
      .query({ limit: 10, offset: 0 });

    // Then: 페이지네이션 확인
    expect(response.status).toBe(200);
    expect(response.body.data.profiles).toHaveLength(10);
    expect(response.body.data.total).toBe(25);
  });
});
```

### 4.3 E2E 테스트 (End-to-End Test)

```typescript
// E2E 테스트: 사용자 시나리오 테스트 (Playwright)
import { test, expect } from '@playwright/test';

test.describe('Pro Profile Flow', () => {
  test('should display pro profile and allow inquiry', async ({ page }) => {
    // Given: 홈페이지 접속
    await page.goto('/');

    // When: 프로 카드 클릭
    await page.click('[data-testid="pro-card-kim-jiyoung"]');

    // Then: 프로필 페이지 표시
    await expect(page).toHaveURL('/pros/kim-jiyoung');
    await expect(page.locator('h1')).toContainText('김지영');

    // When: 문의하기 버튼 클릭
    await page.click('[data-testid="inquiry-button"]');

    // Then: 채팅 모달 또는 카카오톡 링크
    await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();
  });
});
```

---

## 5. 테스트 도구

### 5.1 프론트엔드 테스트

| 도구 | 용도 |
|------|------|
| **Jest** | 테스트 러너 |
| **React Testing Library** | 컴포넌트 테스트 |
| **MSW** | API 모킹 |
| **Playwright** | E2E 테스트 |

```typescript
// React Testing Library 예시
import { render, screen, fireEvent } from '@testing-library/react';
import { ProCard } from './ProCard';

describe('ProCard', () => {
  const mockPro = {
    name: '김지영',
    specialty: ['드라이버', '아이언'],
    verified: true,
    rating: 4.9
  };

  it('should display pro information', () => {
    render(<ProCard pro={mockPro} />);

    expect(screen.getByText('김지영')).toBeInTheDocument();
    expect(screen.getByText('드라이버')).toBeInTheDocument();
    expect(screen.getByTestId('verified-badge')).toBeVisible();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<ProCard pro={mockPro} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('article'));

    expect(handleClick).toHaveBeenCalledWith(mockPro);
  });
});
```

### 5.2 백엔드 테스트

| 도구 | 용도 |
|------|------|
| **Jest** | 테스트 러너 |
| **Supertest** | HTTP 테스트 |
| **Test Containers** | DB 통합 테스트 |

```typescript
// Supertest 예시
import request from 'supertest';
import { app } from '../app';

describe('POST /api/auth/login', () => {
  it('should return token on successful login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'ValidPassword123'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });

  it('should return 401 on invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrong-password'
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
```

---

## 6. 테스트 모범 사례

### 6.1 테스트 독립성

```typescript
// ✅ 좋은 예: 각 테스트가 독립적
describe('UserService', () => {
  let userService: UserService;
  let mockRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // 각 테스트 전에 새로운 인스턴스 생성
    mockRepo = createMockUserRepository();
    userService = new UserService(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('test 1', () => { /* ... */ });
  it('test 2', () => { /* ... */ });
});

// ❌ 나쁜 예: 테스트 간 상태 공유
let globalUser: User; // 테스트 간 상태 공유 금지!
```

### 6.2 테스트 데이터 팩토리

```typescript
// 테스트 데이터 팩토리 패턴
class TestDataFactory {
  static createUser(overrides: Partial<User> = {}): User {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      role: 'golfer',
      createdAt: new Date(),
      ...overrides
    };
  }

  static createProProfile(overrides: Partial<ProProfile> = {}): ProProfile {
    return {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      slug: faker.helpers.slugify(faker.person.fullName()),
      bio: faker.lorem.paragraph(),
      specialty: ['드라이버', '아이언'],
      verified: true,
      rating: 4.5,
      ...overrides
    };
  }
}

// 사용 예
it('should update profile', async () => {
  const profile = TestDataFactory.createProProfile({ verified: false });
  // ...
});
```

### 6.3 Mock과 Stub 사용

```typescript
// Mock: 호출 검증이 필요할 때
const mockEmailService = {
  send: jest.fn().mockResolvedValue({ success: true })
};

it('should send welcome email on signup', async () => {
  await userService.signup(userData);

  expect(mockEmailService.send).toHaveBeenCalledWith(
    expect.objectContaining({
      to: userData.email,
      template: 'welcome'
    })
  );
});

// Stub: 반환값만 필요할 때
const stubUserRepo = {
  findByEmail: jest.fn().mockResolvedValue(existingUser)
};
```

---

## 7. 커버리지 가이드

### 7.1 커버리지 목표

| 테스트 유형 | 목표 | 비고 |
|------------|------|------|
| **단위 테스트** | 80%+ | 비즈니스 로직 |
| **통합 테스트** | 60%+ | API 엔드포인트 |
| **E2E 테스트** | Critical Path 100% | 핵심 사용자 흐름 |

### 7.2 커버리지 측정

```bash
# 커버리지 리포트 생성
npm run test:coverage

# 결과 예시
--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |   82.35 |    76.47 |   85.71 |   82.35 |
 src/services/            |   90.00 |    85.00 |   92.00 |   90.00 |
 src/controllers/         |   75.00 |    70.00 |   80.00 |   75.00 |
--------------------------|---------|----------|---------|---------|
```

### 7.3 커버리지보다 중요한 것

```typescript
// ❌ 커버리지만 높이는 무의미한 테스트
it('should create instance', () => {
  const service = new UserService();
  expect(service).toBeDefined(); // 의미 없음
});

// ✅ 실제 동작을 검증하는 의미 있는 테스트
it('should hash password before saving', async () => {
  const user = await userService.create({
    email: 'test@example.com',
    password: 'plain-password'
  });

  expect(user.password).not.toBe('plain-password');
  expect(await bcrypt.compare('plain-password', user.password)).toBe(true);
});
```

---

## 8. CI에서 테스트 실행

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

**TDD는 연습이 필요합니다. 작은 것부터 시작하세요!**

═══════════════════════════════════════════════════════════════
✅ VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════
- [x] 목적이 명확하게 정의됨
- [x] TDD 사이클 설명
- [x] 테스트 종류별 가이드
- [x] 실행 가능한 코드 예제
- [x] 커버리지 가이드 포함
- [x] CI 설정 포함
- [x] 한국어(Korean)로 작성됨
═══════════════════════════════════════════════════════════════
