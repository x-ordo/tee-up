# TEE:UP QA 체크리스트

> **생성일:** 2025-11-25
> **버전:** 1.0.0
> **상태:** Phase 1 MVP QA

---

## 테스트 결과 요약

| 항목 | 테스트 수 | 통과 | 실패 | 상태 |
|------|----------|------|------|------|
| Backend API | 38 | 38 | 0 | ✅ GREEN |
| Frontend API | 18 | 18 | 0 | ✅ GREEN |
| Frontend Build | 1 | 1 | 0 | ✅ GREEN |
| 브라우저 테스트 | - | - | - | ⏳ Pending |

---

## 1. Backend API 테스트 (자동화 완료)

### ✅ Profile API (20 tests - ALL PASSING)
- [x] GET /api/profiles - 프로필 목록 조회
- [x] GET /api/profiles/:slug - 개별 프로필 조회
- [x] 404 에러 처리
- [x] CORS 설정
- [x] Content-Type 헤더

### ✅ Pro Verification API (18 tests - ALL PASSING)
- [x] GET /api/admin/pros/pending - 대기 중인 프로 목록 (5 tests)
- [x] POST /api/admin/pros/:id/approve - 프로 승인 (6 tests)
- [x] POST /api/admin/pros/:id/reject - 프로 거절 (7 tests)

**실행 명령:**
```bash
cd /Users/admin/Documents/dev/tee_up/api
npm test
```

---

## 2. Frontend API 테스트 (자동화 완료)

### ✅ Profile API Functions (18 tests - ALL PASSING)
- [x] getAllProfiles()
- [x] getProfileBySlug()
- [x] createProfile()
- [x] updateProfile()
- [x] incrementProfileViews()
- [x] getPendingPros() - 대기 프로 조회
- [x] approvePro() - 프로 승인
- [x] rejectPro() - 프로 거절

**실행 명령:**
```bash
cd /Users/admin/Documents/dev/tee_up/web
npm test -- profiles.test
```

---

## 3. Frontend Build 테스트 (완료)

### ✅ TypeScript 타입 체크
- [x] ProProfile 타입 적용
- [x] useProManagement hook 타입 정합성
- [x] 컴포넌트 props 타입 정합성

### ✅ Next.js Build
- [x] Production build 성공
- [x] 모든 페이지 컴파일 성공
- [x] 번들 크기 최적화

**실행 명령:**
```bash
cd /Users/admin/Documents/dev/tee_up/web
npm run build
```

---

## 4. 브라우저 테스트 (수동 또는 자동화 필요)

### 🔲 4.1 Admin 로그인 & 인증
- [ ] `/admin/login` 페이지 로드
- [ ] 이메일/비밀번호 입력 폼 표시
- [ ] 유효한 자격증명으로 로그인 성공
- [ ] 잘못된 자격증명으로 로그인 실패
- [ ] 로그인 후 `/admin` 대시보드로 리다이렉트
- [ ] 인증 없이 `/admin` 접근 시 `/admin/login`으로 리다이렉트

**필요 환경 변수:**
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

### 🔲 4.2 Admin Dashboard
- [ ] 대시보드 메트릭 표시
  - Total Pros 카운트
  - Active Chats 카운트
  - Total Views 카운트
- [ ] 네비게이션 링크 작동
  - Pros 메뉴
  - Chats 메뉴
  - Analytics 메뉴
  - Users 메뉴

---

### 🔲 4.3 Pro Verification (핵심 기능)

#### Pending Pros 목록
- [ ] `/admin/pros` 페이지 로드
- [ ] 대기 중인 프로 신청서 카드 표시
- [ ] 프로 정보 올바르게 표시:
  - 이름 (profiles.full_name)
  - 직함 (title)
  - 프로필 이미지
  - 전문 분야 (specialties)
  - 연락처 (profiles.phone)
  - 신청일 (created_at)

#### 프로 승인 기능
- [ ] "승인" 버튼 클릭
- [ ] 로딩 상태 표시 (isProcessing)
- [ ] Supabase 업데이트 성공:
  - is_approved = true
  - approved_at 타임스탬프 설정
- [ ] Pending 목록에서 제거
- [ ] Approved 테이블에 추가
- [ ] 에러 발생 시 에러 메시지 표시

#### 프로 거절 기능
- [ ] "거부" 버튼 클릭
- [ ] 거절 사유 입력 프롬프트 표시
- [ ] 사유 입력 후 제출
- [ ] Supabase 업데이트 성공:
  - rejection_reason 저장
  - rejected_at 타임스탬프 설정
- [ ] Pending 목록에서 제거
- [ ] 에러 발생 시 에러 메시지 표시

#### Approved Pros 테이블
- [ ] 승인된 프로 목록 표시
- [ ] 테이블 컬럼 올바르게 표시:
  - 이름
  - 직함
  - 조회수 (profile_views)
  - Leads (total_leads)
  - 매칭 (matched_lessons)
  - 평점 (rating)
  - 구독 티어 (subscription_tier)
- [ ] "관리" 링크 클릭 시 개별 프로 페이지로 이동

---

### 🔲 4.4 Cross-browser 테스트
- [ ] Chrome (최신 버전)
- [ ] Safari (최신 버전)
- [ ] Firefox (최신 버전)
- [ ] Edge (선택)

---

### 🔲 4.5 Mobile 반응형 테스트
- [ ] iPhone (Safari)
  - [ ] 768px 이하: 1 컬럼 레이아웃
  - [ ] 터치 인터랙션 정상 작동
- [ ] Android (Chrome)
  - [ ] 태블릿: 2 컬럼 레이아웃
  - [ ] 모바일: 1 컬럼 레이아웃
- [ ] 반응형 breakpoints:
  - [ ] < 640px (mobile)
  - [ ] 640px - 1024px (tablet)
  - [ ] > 1024px (desktop)

---

### 🔲 4.6 Performance 테스트
- [ ] Lighthouse 스코어
  - [ ] Performance > 90
  - [ ] Accessibility > 90
  - [ ] Best Practices > 90
  - [ ] SEO > 90
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1

---

### 🔲 4.7 Security 테스트
- [ ] XSS (Cross-site Scripting) 방어
  - [ ] 사용자 입력 sanitization
  - [ ] 거절 사유 입력 시 스크립트 injection 방지
- [ ] CSRF (Cross-site Request Forgery) 방어
- [ ] SQL Injection 방어 (Supabase RLS)
- [ ] 인증/인가 테스트
  - [ ] 비로그인 사용자의 admin 페이지 접근 차단
  - [ ] 세션 만료 시 재로그인 요구

---

## 5. 브라우저 자동화 테스트 도구 제안

### 옵션 1: Playwright (추천) ⭐

**장점:**
- Next.js와 완벽한 호환
- 빠른 실행 속도
- Chrome, Firefox, Safari 모두 지원
- 스크린샷/비디오 녹화 기능
- TypeScript 네이티브 지원

**설치:**
```bash
cd /Users/admin/Documents/dev/tee_up/web
npm install -D @playwright/test
npx playwright install
```

**예제 테스트 (e2e/admin-pros.spec.ts):**
```typescript
import { test, expect } from '@playwright/test'

test('Admin can approve pending pro', async ({ page }) => {
  // 1. Login
  await page.goto('http://localhost:3000/admin/login')
  await page.fill('input[type="email"]', 'admin@teeup.com')
  await page.fill('input[type="password"]', 'password')
  await page.click('button[type="submit"]')

  // 2. Go to pros page
  await page.goto('http://localhost:3000/admin/pros')

  // 3. Click approve on first pending pro
  await page.click('button:has-text("승인"):first')

  // 4. Check pro moved to approved table
  await expect(page.locator('.approved-pros-table')).toContainText('Kim Soo-jin')
})
```

---

### 옵션 2: MCP Puppeteer Server (Browser Automation)

**MCP Server 설치:**
```bash
# MCP Puppeteer server for browser automation
npm install -g @modelcontextprotocol/server-puppeteer
```

**Claude Code MCP 설정 (.claude/config.json):**
```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

**사용 방법:**
MCP Puppeteer server를 통해 Claude가 직접 브라우저를 제어:
- 페이지 방문
- 폼 입력
- 버튼 클릭
- 스크린샷 캡처
- DOM 요소 검증

**예제:**
```
Claude에게: "localhost:3000/admin/pros 페이지를 열고, 첫 번째 대기 중인 프로를 승인해줘"
→ MCP Puppeteer가 자동으로 브라우저 제어
```

---

### 옵션 3: Cypress (Alternative)

**장점:**
- 직관적인 UI
- 실시간 테스트 실행 확인
- 타임 트래블 디버깅

**단점:**
- Playwright보다 느림
- Safari 지원 제한적

---

## 6. 실행 계획

### Phase 1: 자동화된 테스트 (완료)
- ✅ Backend API tests (38/38)
- ✅ Frontend API tests (18/18)
- ✅ Build & Type checks

### Phase 2: 브라우저 수동 테스트 (다음 단계)
1. Supabase 환경 변수 설정
2. 개발 서버 실행 (`npm run dev`)
3. Admin 계정 생성
4. Pro Verification 플로우 수동 테스트
5. 스크린샷/비디오 기록

### Phase 3: E2E 자동화 (선택)
1. Playwright 설치 및 설정
2. Critical path 테스트 작성:
   - Admin login
   - Pro approval
   - Pro rejection
3. CI/CD 파이프라인에 통합

---

## 7. 테스트 데이터 준비

### Supabase 테스트 데이터
```sql
-- 테스트용 대기 프로 생성
INSERT INTO pro_profiles (user_id, slug, title, bio, specialties, is_approved)
VALUES
  ('test-user-1', 'test-pro-1', 'Test Pro 1', 'Test bio', ARRAY['Putting'], false),
  ('test-user-2', 'test-pro-2', 'Test Pro 2', 'Test bio 2', ARRAY['Driver'], false);
```

---

## 8. 알려진 이슈

### 🔴 Critical
없음

### 🟡 Medium
- Admin 페이지 컴포넌트 테스트 실패 (Supabase 환경 변수 미설정)
  - 해결 방법: 테스트 환경에 mock Supabase 클라이언트 추가

### 🟢 Low
- ESLint 설정 경고 (useEslintrc deprecated)
  - 영향: 없음 (빌드는 정상 작동)

---

## 9. 다음 단계

1. **Supabase 환경 설정** (.env.local 파일 생성)
2. **개발 서버 실행** (`npm run dev`)
3. **Admin 로그인 테스트**
4. **Pro Verification 플로우 테스트**
5. **스크린샷 캡처 및 문서화**
6. **(선택) Playwright E2E 테스트 작성**

---

## 부록: 빠른 실행 명령어

```bash
# Backend 테스트
cd /Users/admin/Documents/dev/tee_up/api && npm test

# Frontend 테스트
cd /Users/admin/Documents/dev/tee_up/web && npm test

# Frontend 빌드
cd /Users/admin/Documents/dev/tee_up/web && npm run build

# 개발 서버 실행 (브라우저 테스트용)
cd /Users/admin/Documents/dev/tee_up/web && npm run dev
```
