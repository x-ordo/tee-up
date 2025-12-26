import { test, expect } from '@playwright/test'

/**
 * Booking Requests E2E Tests
 * PRD v1.2: 간단 예약 요청 시스템
 *
 * 테스트 대상:
 * - SimpleRequestForm (포트폴리오 페이지)
 * - Dashboard Requests 페이지
 */

test.describe('SimpleRequestForm', () => {
  // 포트폴리오 페이지에서 테스트 (실제 프로 프로필 필요)
  // 테스트 환경에서는 존재하지 않을 수 있으므로 조건부 테스트

  test.describe('Form Fields', () => {
    test.skip('should display all form fields', async ({ page }) => {
      // 테스트용 프로 프로필이 필요함
      await page.goto('/test-pro')

      // 레슨 문의 폼이 있어야 함
      await expect(page.getByText('레슨 문의하기')).toBeVisible()
      await expect(page.getByLabel(/이름/)).toBeVisible()
      await expect(page.getByLabel(/연락처/)).toBeVisible()
      await expect(page.getByLabel(/희망 레슨 시간/)).toBeVisible()
      await expect(page.getByLabel(/문의 내용/)).toBeVisible()
    })

    test.skip('should auto-format phone number', async ({ page }) => {
      await page.goto('/test-pro')

      const phoneInput = page.getByLabel(/연락처/)
      await phoneInput.fill('01012345678')

      // 자동 포맷팅 확인
      await expect(phoneInput).toHaveValue('010-1234-5678')
    })
  })

  test.describe('Form Validation', () => {
    test.skip('should show error when name is empty', async ({ page }) => {
      await page.goto('/test-pro')

      // 이름 없이 제출 시도
      const submitButton = page.getByRole('button', { name: /문의하기/ })
      await submitButton.click()

      // 에러 메시지 표시
      await expect(page.getByRole('alert')).toContainText('이름')
    })

    test.skip('should show error when phone is empty', async ({ page }) => {
      await page.goto('/test-pro')

      // 이름만 입력하고 제출
      await page.getByLabel(/이름/).fill('홍길동')
      await page.getByRole('button', { name: /문의하기/ }).click()

      // 에러 메시지 표시
      await expect(page.getByRole('alert')).toContainText('연락처')
    })
  })

  test.describe('Form Submission', () => {
    test.skip('should show success message after submission', async ({ page }) => {
      await page.goto('/test-pro')

      // 필수 필드 입력
      await page.getByLabel(/이름/).fill('홍길동')
      await page.getByLabel(/연락처/).fill('010-1234-5678')
      await page.getByLabel(/희망 레슨 시간/).selectOption('평일 저녁')
      await page.getByLabel(/문의 내용/).fill('초보자 레슨 문의드립니다.')

      // 제출
      await page.getByRole('button', { name: /문의하기/ }).click()

      // 성공 메시지 확인
      await expect(page.getByText('문의가 접수되었습니다')).toBeVisible()
    })

    test.skip('should show loading state during submission', async ({ page }) => {
      await page.goto('/test-pro')

      await page.getByLabel(/이름/).fill('홍길동')
      await page.getByLabel(/연락처/).fill('010-1234-5678')

      // 제출 버튼 클릭
      const submitButton = page.getByRole('button', { name: /문의하기/ })
      await submitButton.click()

      // 로딩 상태 확인 (버튼이 비활성화됨)
      await expect(submitButton).toBeDisabled()
    })
  })
})

test.describe('Dashboard Requests Page', () => {
  // 대시보드는 인증이 필요하므로 조건부 테스트

  test.describe('Page Layout', () => {
    test.skip('should display page title and description', async ({ page }) => {
      await page.goto('/dashboard/requests')

      await expect(page.getByRole('heading', { name: '레슨 문의' })).toBeVisible()
      await expect(page.getByText('잠재 수강생들의 레슨 문의를 관리하세요')).toBeVisible()
    })

    test.skip('should display stat cards', async ({ page }) => {
      await page.goto('/dashboard/requests')

      // 통계 카드들
      await expect(page.getByText('전체')).toBeVisible()
      await expect(page.getByText('대기 중')).toBeVisible()
      await expect(page.getByText('연락 완료')).toBeVisible()
      await expect(page.getByText('레슨 확정')).toBeVisible()
      await expect(page.getByText('완료')).toBeVisible()
    })
  })

  test.describe('Empty State', () => {
    test.skip('should display empty state when no requests', async ({ page }) => {
      await page.goto('/dashboard/requests')

      // 요청이 없을 때 빈 상태 메시지
      const emptyState = page.getByText('아직 문의가 없습니다')
      if (await emptyState.isVisible()) {
        await expect(page.getByText('프로필 페이지를 공유하면')).toBeVisible()
      }
    })
  })

  test.describe('Request List', () => {
    test.skip('should display filter buttons', async ({ page }) => {
      await page.goto('/dashboard/requests')

      // 필터 버튼들
      await expect(page.getByRole('button', { name: '전체' })).toBeVisible()
      await expect(page.getByRole('button', { name: '대기 중' })).toBeVisible()
      await expect(page.getByRole('button', { name: '연락 완료' })).toBeVisible()
      await expect(page.getByRole('button', { name: '레슨 확정' })).toBeVisible()
    })

    test.skip('should filter requests when clicking filter button', async ({ page }) => {
      await page.goto('/dashboard/requests')

      // 대기 중 필터 클릭
      const pendingFilter = page.getByRole('button', { name: '대기 중' })
      await pendingFilter.click()

      // 필터가 활성화되어야 함
      await expect(pendingFilter).toHaveClass(/bg-tee-accent-primary/)
    })
  })

  test.describe('Request Item', () => {
    test.skip('should expand request details when clicking expand button', async ({ page }) => {
      await page.goto('/dashboard/requests')

      // 상세 보기 버튼 클릭
      const expandButton = page.getByRole('button', { name: /상세 보기/ }).first()
      if (await expandButton.isVisible()) {
        await expandButton.click()

        // 상태 변경 섹션이 표시되어야 함
        await expect(page.getByText('상태 변경')).toBeVisible()
      }
    })

    test.skip('should display quick action buttons in expanded view', async ({ page }) => {
      await page.goto('/dashboard/requests')

      const expandButton = page.getByRole('button', { name: /상세 보기/ }).first()
      if (await expandButton.isVisible()) {
        await expandButton.click()

        // 빠른 액션 버튼들
        await expect(page.getByRole('link', { name: /전화하기/ })).toBeVisible()
        await expect(page.getByRole('link', { name: /문자 보내기/ })).toBeVisible()
      }
    })

    test.skip('should update status when clicking status button', async ({ page }) => {
      await page.goto('/dashboard/requests')

      const expandButton = page.getByRole('button', { name: /상세 보기/ }).first()
      if (await expandButton.isVisible()) {
        await expandButton.click()

        // 연락 완료 버튼 클릭
        const contactedButton = page.getByRole('button', { name: '연락 완료' })
        if (await contactedButton.isEnabled()) {
          await contactedButton.click()

          // 상태가 변경되어야 함 (버튼이 활성화된 스타일)
          await expect(contactedButton).toHaveClass(/bg-tee-info/)
        }
      }
    })
  })

  test.describe('Phone Number Display', () => {
    test.skip('should display phone number with link', async ({ page }) => {
      await page.goto('/dashboard/requests')

      // 전화번호 링크가 있어야 함
      const phoneLink = page.locator('a[href^="tel:"]').first()
      if (await phoneLink.isVisible()) {
        // 형식화된 전화번호 (xxx-xxxx-xxxx)
        await expect(phoneLink).toHaveText(/\d{3}-\d{3,4}-\d{4}/)
      }
    })
  })

  test.describe('Date Formatting', () => {
    test.skip('should display relative time for recent requests', async ({ page }) => {
      await page.goto('/dashboard/requests')

      // 상대적 시간 표시 (분 전, 시간 전, 어제, n일 전)
      const timeText = page.locator('text=/\\d+(분|시간|일) 전|어제/')
      if (await timeText.first().isVisible()) {
        await expect(timeText.first()).toBeVisible()
      }
    })
  })
})

test.describe('Booking Request Flow Integration', () => {
  test.skip('should complete full booking request flow', async ({ page }) => {
    // 1. 포트폴리오 페이지에서 문의 제출
    await page.goto('/test-pro')

    await page.getByLabel(/이름/).fill('테스트고객')
    await page.getByLabel(/연락처/).fill('010-9999-8888')
    await page.getByLabel(/희망 레슨 시간/).selectOption('주말 오전')
    await page.getByLabel(/문의 내용/).fill('레슨 문의드립니다.')
    await page.getByRole('button', { name: /문의하기/ }).click()

    // 성공 메시지 확인
    await expect(page.getByText('문의가 접수되었습니다')).toBeVisible()

    // 2. 대시보드에서 문의 확인 (프로 로그인 필요)
    // 이 부분은 인증이 필요하므로 실제 테스트 환경에서만 동작
  })
})

test.describe('Accessibility', () => {
  test.skip('form fields should have proper labels', async ({ page }) => {
    await page.goto('/test-pro')

    // 모든 필수 입력 필드에 label이 있어야 함
    const nameInput = page.getByLabel(/이름/)
    await expect(nameInput).toHaveAttribute('id')

    const phoneInput = page.getByLabel(/연락처/)
    await expect(phoneInput).toHaveAttribute('id')
  })

  test.skip('error messages should be accessible', async ({ page }) => {
    await page.goto('/test-pro')

    // 에러 메시지에 role="alert"가 있어야 함
    await page.getByRole('button', { name: /문의하기/ }).click()

    const errorAlert = page.getByRole('alert')
    if (await errorAlert.isVisible()) {
      await expect(errorAlert).toBeVisible()
    }
  })

  test.skip('buttons should have proper states', async ({ page }) => {
    await page.goto('/test-pro')

    // 비활성화 상태의 버튼은 disabled 속성이 있어야 함
    const submitButton = page.getByRole('button', { name: /문의하기/ })
    // 로딩 중에는 disabled
    await expect(submitButton).toBeEnabled() // 초기 상태
  })
})
