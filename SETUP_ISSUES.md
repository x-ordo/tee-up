# 수동 설정 필요 항목 (Setup Issues)

프로젝트 실행을 위해 사람이 직접 설정해야 하는 항목들입니다.

---

## Issue #1: Supabase 프로젝트 초기 설정

### 우선순위: Critical

### 설명
Supabase 프로젝트 생성 및 데이터베이스 스키마 적용이 필요합니다.

### 필요한 작업

#### 1. Supabase 프로젝트 생성
- [ ] https://supabase.com 에서 계정 생성
- [ ] 새 프로젝트 생성 (지역: Northeast Asia 권장)
- [ ] 프로젝트 URL 복사: `https://your-project.supabase.co`
- [ ] API Keys 복사:
  - `anon` key (공개)
  - `service_role` key (비밀)

#### 2. 데이터베이스 스키마 적용
- [ ] Supabase Dashboard → SQL Editor 접속
- [ ] `/supabase/schema.sql` 파일 내용 실행

```sql
-- 주요 테이블:
-- - profiles (사용자 프로필)
-- - pro_profiles (프로 프로필)
-- - chat_rooms (채팅방)
-- - messages (메시지)
-- - subscriptions (구독)
```

#### 3. RLS (Row Level Security) 확인
- [ ] 각 테이블에 RLS 정책이 적용되었는지 확인
- [ ] Authentication → Settings에서 Site URL 설정

#### 4. 환경변수 설정

**프론트엔드 (`web/.env.local`)**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**백엔드 (`api/.env`)**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 설정하지 않으면 발생하는 오류
```
Error: Supabase URL not configured
Error: relation "public.profiles" does not exist
Error: new row violates row-level security policy
```

### 참고 문서
- `/supabase/README.md`
- `/supabase/schema.sql`

---

## Issue #2: 관리자 계정 생성

### 우선순위: Critical

### 설명
관리자 대시보드 접근을 위한 관리자 계정을 생성해야 합니다.

### 필요한 작업

#### 방법 A: Supabase Dashboard에서 생성 (간단)
- [ ] Supabase Dashboard → Authentication → Users
- [ ] "Add user" 클릭
- [ ] Email: `admin@teeup.com` (변경 가능)
- [ ] Password: 강력한 비밀번호 설정
- [ ] "Auto Confirm User" 체크

#### 방법 B: SQL로 생성 (권장)
```sql
-- 1. 사용자 생성
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@teeup.com',
  crypt('YourStrongPassword123!', gen_salt('bf')),
  NOW(), NOW(), NOW()
);

-- 2. 프로필에 관리자 역할 부여
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@teeup.com';
```

### 설정하지 않으면 발생하는 오류
- `/admin` 페이지 접근 시 로그인 불가
- "Invalid credentials" 에러

### 참고 문서
- `/supabase/ADMIN_SETUP.md`

---

## Issue #3: Toss Payments 결제 연동

### 우선순위: High (프로 기능 사용 시)

### 설명
구독 결제 기능을 위한 Toss Payments 연동이 필요합니다.

### 필요한 작업

#### 1. Toss Payments 계정 설정
- [ ] https://developers.tosspayments.com/ 접속
- [ ] 개발자 계정 생성
- [ ] 테스트 API 키 발급
  - Client Key
  - Secret Key

#### 2. 환경변수 설정

**프론트엔드 (`web/.env.local`)**
```bash
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxxxxxxxxxxxx
```

**백엔드 (`api/.env`)**
```bash
TOSS_SECRET_KEY=test_sk_xxxxxxxxxxxxxxx
```

#### 3. 웹훅 설정 (프로덕션)
- [ ] Toss Payments 대시보드에서 웹훅 URL 등록
- [ ] `/api/webhooks/payment` 엔드포인트 구현

#### 4. 프로덕션 전환
- [ ] 사업자 등록증 제출
- [ ] 실 결제 API 키 발급
- [ ] 환경변수 변경

### 현재 구현된 구독 플랜
| 플랜 | 가격 | 기능 |
|------|------|------|
| Basic | 무료 | 월 3건 무료 리드 |
| Pro Monthly | ₩99,000/월 | 무제한 리드 |
| Pro Yearly | ₩990,000/년 | 무제한 리드 (17% 할인) |

### 설정하지 않으면 발생하는 오류
```
Error: Toss Payments SDK not available
Error: Failed to load Toss Payments SDK
```

### 참고 파일
- `/web/src/lib/payments/index.ts`
- `/web/src/app/pricing/page.tsx`

---

## Issue #4: 카카오톡 채널 연동

### 우선순위: Medium

### 설명
카카오톡 상담 및 공유 기능을 위한 설정이 필요합니다.

### 필요한 작업

#### 1. 카카오 개발자 계정 설정
- [ ] https://developers.kakao.com/ 접속
- [ ] 애플리케이션 등록
- [ ] JavaScript 키 발급

#### 2. 카카오톡 채널 생성
- [ ] 카카오톡 채널 관리자센터 접속
- [ ] 새 채널 생성
- [ ] 채널 ID 확인

#### 3. 환경변수 설정
```bash
NEXT_PUBLIC_KAKAO_CHANNEL_ID=_xxxxxx
NEXT_PUBLIC_KAKAO_JS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 기능
- 카카오톡 채팅 상담
- 프로필 공유
- 알림 메시지 발송

### 설정하지 않으면 발생하는 오류
- 카카오톡 버튼 비활성화
- 공유 기능 비작동

### 참고 파일
- `/web/src/lib/kakao/index.ts`

---

## Issue #5: 배포 환경 설정 (Vercel + Railway)

### 우선순위: High (배포 시)

### 설명
CI/CD 파이프라인 및 배포 환경 설정이 필요합니다.

### 필요한 작업

#### 1. Vercel 설정 (프론트엔드)
- [ ] https://vercel.com 접속
- [ ] GitHub 연동
- [ ] 프로젝트 Import (`web` 디렉토리)
- [ ] 환경변수 설정

**Vercel 환경변수:**
```
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_TOSS_CLIENT_KEY=xxx
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

#### 2. Railway 설정 (백엔드)
- [ ] https://railway.app 접속
- [ ] GitHub 연동
- [ ] 프로젝트 Import (`api` 디렉토리)
- [ ] 환경변수 설정

#### 3. GitHub Secrets 설정
```
VERCEL_TOKEN=xxx
VERCEL_ORG_ID=xxx
VERCEL_PROJECT_ID=xxx
RAILWAY_TOKEN=xxx
SLACK_WEBHOOK_URL=xxx (선택)
```

#### 4. 도메인 설정
- [ ] 도메인 구입 (예: teeup.kr)
- [ ] Vercel에서 도메인 연결
- [ ] SSL 인증서 자동 설정 확인

### 설정하지 않으면 발생하는 오류
```
Error: VERCEL_TOKEN is not set
Error: VERCEL_ORG_ID is not set
```

### 참고 파일
- `/.github/workflows/deploy-dev.yml`
- `/.github/workflows/deploy-prod.yml`

---

## Issue #6: SEO 및 분석 도구 설정

### 우선순위: Low (런칭 전)

### 설명
검색 엔진 최적화 및 사용자 분석을 위한 설정입니다.

### 필요한 작업

#### 1. Google Search Console
- [ ] https://search.google.com/search-console 접속
- [ ] 사이트 소유권 확인
- [ ] 확인 코드 복사

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=xxx
```

#### 2. Naver Search Advisor
- [ ] https://searchadvisor.naver.com/ 접속
- [ ] 사이트 등록
- [ ] 확인 코드 복사

```bash
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=xxx
```

#### 3. Google Analytics
- [ ] https://analytics.google.com 접속
- [ ] 새 속성 생성
- [ ] 측정 ID 복사

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### 4. Sentry (에러 모니터링)
- [ ] https://sentry.io 접속
- [ ] 프로젝트 생성
- [ ] DSN 복사

```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 설정하지 않으면 발생하는 오류
- 검색 엔진 인덱싱 불가
- 사용자 행동 분석 불가
- 에러 추적 불가

---

## 설정 체크리스트

### 개발 환경
- [ ] Node.js 20.x 설치
- [ ] Supabase 프로젝트 생성 (Issue #1)
- [ ] 관리자 계정 생성 (Issue #2)
- [ ] `web/.env.local` 생성
- [ ] `api/.env` 생성
- [ ] 로컬 서버 실행 확인

### 스테이징 환경
- [ ] Supabase 스테이징 프로젝트
- [ ] Vercel Preview 설정
- [ ] Toss Payments 테스트 키

### 프로덕션 환경
- [ ] Supabase 프로덕션 프로젝트
- [ ] 도메인 설정
- [ ] Toss Payments 실제 키
- [ ] 카카오톡 채널
- [ ] SEO 설정
- [ ] 분석 도구 설정

---

## 우선순위 요약

| 순위 | 이슈 | 상태 |
|------|------|------|
| 1 | Supabase 초기 설정 | Critical |
| 2 | 관리자 계정 생성 | Critical |
| 3 | 배포 환경 설정 | High |
| 4 | Toss Payments 연동 | High |
| 5 | 카카오톡 연동 | Medium |
| 6 | SEO/분석 도구 | Low |

---

**마지막 업데이트**: 2025-11-25
