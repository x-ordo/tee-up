# E2E Testing with Playwright

이 디렉토리는 Playwright를 사용한 End-to-End (E2E) 테스트를 포함합니다.

## 설정

### 1. 환경 변수 설정

`.env.test` 파일을 생성하고 테스트용 관리자 계정 정보를 추가하세요:

```bash
# .env.test
TEST_ADMIN_EMAIL=admin@teeup.com
TEST_ADMIN_PASSWORD=your-test-password
```

### 2. 개발 서버 실행

Playwright는 자동으로 개발 서버를 실행하지만, 수동으로 실행하고 싶다면:

```bash
npm run dev
```

## 테스트 실행

### 기본 실행 (Headless 모드)
```bash
npm run test:e2e
```

### UI 모드 (권장)
브라우저를 보면서 테스트를 실행하고 디버깅:
```bash
npm run test:e2e:ui
```

### Headed 모드
실제 브라우저 창에서 테스트 확인:
```bash
npm run test:e2e:headed
```

### 특정 테스트만 실행
```bash
npx playwright test admin-pro-verification
```

### 특정 브라우저만 실행
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### 리포트 보기
```bash
npm run test:e2e:report
```

## 테스트 작성 가이드

### 기본 구조

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 실행할 설정
    await page.goto('/your-page')
  })

  test('should do something', async ({ page }) => {
    // 테스트 로직
    await page.click('button')
    await expect(page.locator('h1')).toContainText('Expected Text')
  })
})
```

### 인증이 필요한 테스트

```typescript
test.beforeEach(async ({ page }) => {
  // 로그인
  await page.goto('/admin/login')
  await page.fill('input[type="email"]', process.env.TEST_ADMIN_EMAIL!)
  await page.fill('input[type="password"]', process.env.TEST_ADMIN_PASSWORD!)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/admin/)
})
```

### 유용한 Playwright 명령어

```typescript
// 요소 찾기
page.locator('button')
page.locator('text=Click me')
page.locator('[data-testid="my-button"]')

// 액션
await page.click('button')
await page.fill('input', 'text')
await page.selectOption('select', 'value')
await page.check('input[type="checkbox"]')

// 검증
await expect(page.locator('h1')).toBeVisible()
await expect(page.locator('h1')).toContainText('Hello')
await expect(page).toHaveURL(/\/admin/)
await expect(page).toHaveTitle(/Dashboard/)

// 대기
await page.waitForSelector('button')
await page.waitForURL('/admin')
await page.waitForTimeout(1000)
```

## 디버깅

### 1. UI 모드 사용
```bash
npm run test:e2e:ui
```

### 2. 브라우저 열어서 확인
```bash
npm run test:e2e:headed
```

### 3. 스크린샷 자동 저장
테스트 실패 시 자동으로 `test-results/` 폴더에 스크린샷이 저장됩니다.

### 4. Trace 보기
실패한 테스트의 trace를 보려면:
```bash
npx playwright show-trace test-results/.../trace.zip
```

## CI/CD 통합

GitHub Actions에서 실행하려면:

```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e
  env:
    TEST_ADMIN_EMAIL: ${{ secrets.TEST_ADMIN_EMAIL }}
    TEST_ADMIN_PASSWORD: ${{ secrets.TEST_ADMIN_PASSWORD }}

- name: Upload Playwright Report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## 모범 사례

1. **Data-testid 사용**: 안정적인 선택자를 위해 `data-testid` 속성 사용
2. **Page Objects**: 복잡한 페이지는 Page Object 패턴 사용
3. **독립성**: 각 테스트는 독립적으로 실행 가능해야 함
4. **클린업**: 테스트 후 생성된 데이터 정리
5. **재시도 설정**: CI에서 flaky 테스트를 위한 재시도 설정

## 참고 자료

- [Playwright 공식 문서](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
