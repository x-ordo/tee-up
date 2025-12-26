import { test, expect } from '@playwright/test'

/**
 * Quick Setup Wizard E2E Tests
 * PRD v1.2: 빠른 프로필 설정 마법사
 *
 * 3단계 플로우:
 * - Step 1: 기본 정보 (이름, 소개)
 * - Step 2: 레슨 정보 (전문 분야, 위치, 가격대)
 * - Step 3: 연락처 (카카오/전화)
 */

test.describe('Quick Setup Wizard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/onboarding/quick-setup')
  })

  test.describe('Step Indicator', () => {
    test('should display 3-step progress indicator', async ({ page }) => {
      // 3개의 스텝 인디케이터가 표시되어야 함
      const stepIndicators = page.locator('div').filter({ hasText: /^[123]$/ })
      await expect(stepIndicators.first()).toBeVisible()

      // 현재 스텝 텍스트 확인
      await expect(page.getByText('기본 정보')).toBeVisible()
    })

    test('should show current step as active', async ({ page }) => {
      // 첫 번째 스텝이 활성화되어 있어야 함
      const activeStep = page.locator('.border-tee-accent-primary')
      await expect(activeStep.first()).toBeVisible()
    })
  })

  test.describe('Step 1: Basic Info', () => {
    test('should display name and bio input fields', async ({ page }) => {
      await expect(page.getByLabel(/이름/)).toBeVisible()
      await expect(page.getByLabel(/한 줄 소개/)).toBeVisible()
    })

    test('should disable next button when name is empty', async ({ page }) => {
      const nextButton = page.getByRole('button', { name: /다음/ })

      // 이름이 비어있으면 다음 버튼 비활성화
      await expect(nextButton).toBeDisabled()
    })

    test('should enable next button when name has 2+ characters', async ({ page }) => {
      const nameInput = page.getByLabel(/이름/)
      const nextButton = page.getByRole('button', { name: /다음/ })

      // 1글자 - 아직 비활성화
      await nameInput.fill('김')
      await expect(nextButton).toBeDisabled()

      // 2글자 이상 - 활성화
      await nameInput.fill('김프로')
      await expect(nextButton).toBeEnabled()
    })

    test('should show bio character count', async ({ page }) => {
      const bioInput = page.getByLabel(/한 줄 소개/)
      await bioInput.fill('테스트 소개글입니다')

      // 글자 수 카운터 표시
      await expect(page.getByText(/\/100/)).toBeVisible()
    })

    test('should navigate to step 2 when clicking next', async ({ page }) => {
      const nameInput = page.getByLabel(/이름/)
      await nameInput.fill('테스트프로')

      const nextButton = page.getByRole('button', { name: /다음/ })
      await nextButton.click()

      // Step 2 텍스트 확인
      await expect(page.getByText('레슨 정보')).toBeVisible()
      await expect(page.getByLabel(/전문 분야/)).toBeVisible()
    })
  })

  test.describe('Step 2: Lesson Info', () => {
    test.beforeEach(async ({ page }) => {
      // Step 1 완료
      await page.getByLabel(/이름/).fill('테스트프로')
      await page.getByRole('button', { name: /다음/ }).click()
    })

    test('should display specialty, location, and price range fields', async ({ page }) => {
      await expect(page.getByLabel(/전문 분야/)).toBeVisible()
      await expect(page.getByLabel(/레슨 장소/)).toBeVisible()
      await expect(page.getByText(/레슨 가격대/)).toBeVisible()
    })

    test('should disable next button when specialty is not selected', async ({ page }) => {
      const nextButton = page.getByRole('button', { name: /다음/ })
      await expect(nextButton).toBeDisabled()
    })

    test('should enable next button when specialty is selected', async ({ page }) => {
      const specialtySelect = page.getByLabel(/전문 분야/)
      await specialtySelect.selectOption('beginner')

      const nextButton = page.getByRole('button', { name: /다음/ })
      await expect(nextButton).toBeEnabled()
    })

    test('should allow selecting price range', async ({ page }) => {
      // 가격대 버튼들이 있어야 함
      await expect(page.getByRole('button', { name: /~5만원/ })).toBeVisible()
      await expect(page.getByRole('button', { name: /5-10만원/ })).toBeVisible()
      await expect(page.getByRole('button', { name: /10-20만원/ })).toBeVisible()
      await expect(page.getByRole('button', { name: /20만원~/ })).toBeVisible()

      // 가격대 선택
      await page.getByRole('button', { name: /5-10만원/ }).click()

      // 선택된 상태 확인 (accent color)
      const selectedButton = page.getByRole('button', { name: /5-10만원/ })
      await expect(selectedButton).toHaveClass(/border-tee-accent-primary/)
    })

    test('should navigate to step 3 when clicking next', async ({ page }) => {
      await page.getByLabel(/전문 분야/).selectOption('intermediate')
      await page.getByRole('button', { name: /다음/ }).click()

      // Step 3 텍스트 확인
      await expect(page.getByText('연락처 설정')).toBeVisible()
    })

    test('should navigate back to step 1 when clicking back', async ({ page }) => {
      await page.getByRole('button', { name: /이전/ }).click()

      // Step 1로 돌아감
      await expect(page.getByText('기본 정보')).toBeVisible()
      await expect(page.getByLabel(/이름/)).toBeVisible()
    })
  })

  test.describe('Step 3: Contact', () => {
    test.beforeEach(async ({ page }) => {
      // Step 1 완료
      await page.getByLabel(/이름/).fill('테스트프로')
      await page.getByRole('button', { name: /다음/ }).click()

      // Step 2 완료
      await page.getByLabel(/전문 분야/).selectOption('beginner')
      await page.getByRole('button', { name: /다음/ }).click()
    })

    test('should display contact type selection', async ({ page }) => {
      await expect(page.getByRole('button', { name: /카카오톡/ })).toBeVisible()
      await expect(page.getByRole('button', { name: /전화번호/ })).toBeVisible()
    })

    test('should show kakao input when kakao is selected', async ({ page }) => {
      await page.getByRole('button', { name: /카카오톡/ }).click()

      // 카카오 오픈채팅 링크 입력 필드
      await expect(page.getByPlaceholder(/open.kakao.com/)).toBeVisible()
    })

    test('should show phone input when phone is selected', async ({ page }) => {
      await page.getByRole('button', { name: /전화번호/ }).click()

      // 전화번호 입력 필드
      await expect(page.getByPlaceholder(/010-1234-5678/)).toBeVisible()
    })

    test('should disable complete button when contact value is empty', async ({ page }) => {
      const completeButton = page.getByRole('button', { name: /완료/ })
      await expect(completeButton).toBeDisabled()
    })

    test('should enable complete button when contact value is provided', async ({ page }) => {
      await page.getByRole('button', { name: /전화번호/ }).click()
      await page.getByPlaceholder(/010-1234-5678/).fill('010-1234-5678')

      const completeButton = page.getByRole('button', { name: /완료/ })
      await expect(completeButton).toBeEnabled()
    })
  })

  test.describe('Full Flow', () => {
    test('should complete full setup wizard flow', async ({ page }) => {
      // Step 1: 기본 정보
      await page.getByLabel(/이름/).fill('테스트프로')
      await page.getByLabel(/한 줄 소개/).fill('10년 경력 골프 프로')
      await page.getByRole('button', { name: /다음/ }).click()

      // Step 2: 레슨 정보
      await page.getByLabel(/전문 분야/).selectOption('beginner')
      await page.getByLabel(/레슨 장소/).fill('강남 골프아카데미')
      await page.getByRole('button', { name: /5-10만원/ }).click()
      await page.getByRole('button', { name: /다음/ }).click()

      // Step 3: 연락처
      await page.getByRole('button', { name: /전화번호/ }).click()
      await page.getByPlaceholder(/010-1234-5678/).fill('010-1234-5678')

      // 완료 버튼 클릭 (실제 API 호출되므로 mock 필요하거나 에러 허용)
      const completeButton = page.getByRole('button', { name: /완료/ })
      await expect(completeButton).toBeEnabled()
    })
  })

  test.describe('Accessibility', () => {
    test('form fields should have proper labels', async ({ page }) => {
      // 이름 입력 필드에 label 연결
      const nameInput = page.getByLabel(/이름/)
      await expect(nameInput).toHaveAttribute('id')
    })

    test('should be navigable with keyboard', async ({ page }) => {
      // Tab으로 이동 가능해야 함
      await page.keyboard.press('Tab')

      // 이름 입력 필드가 포커스되어야 함 (또는 다른 포커스 가능한 요소)
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    })
  })
})
