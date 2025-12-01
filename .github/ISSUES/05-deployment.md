# [Setup] 배포 환경 설정 (Vercel + Railway)

**Labels:** `setup`, `devops`, `deployment`

---

## 우선순위: High

## 설명
CI/CD 파이프라인 및 배포 환경 설정이 필요합니다.

## 필요한 작업

### 1. Vercel 설정 (프론트엔드)
- [ ] https://vercel.com 접속
- [ ] GitHub 연동
- [ ] 프로젝트 Import (`web` 디렉토리)
- [ ] Root Directory: `web` 설정
- [ ] Framework Preset: Next.js 자동 감지 확인
- [ ] Build Command: `npm run build` (기본값)
- [ ] Output Directory: `.next` (기본값)
- [ ] Install Command: `npm install` (기본값)
- [ ] 환경변수 설정 (Settings → Environment Variables)

**Vercel 필수 환경변수:**
```bash
# Supabase 설정 (Critical)
NEXT_PUBLIC_SUPABASE_URL=https://yrdfopkerrrhsafynakg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase Dashboard에서 복사>

# Site URL (Critical)
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# Toss Payments (Phase 2 - 선택)
NEXT_PUBLIC_TOSS_CLIENT_KEY=<Phase 2에서 설정>

# Kakao (Phase 2 - 선택)
NEXT_PUBLIC_KAKAO_CHANNEL_ID=<Phase 2에서 설정>
NEXT_PUBLIC_KAKAO_JS_KEY=<Phase 2에서 설정>

# Analytics (선택)
NEXT_PUBLIC_GA_ID=<Google Analytics ID>
NEXT_PUBLIC_SENTRY_DSN=<Sentry DSN>
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<Google Search Console 확인 코드>
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=<Naver Search Advisor 확인 코드>
```

**Vercel 프로젝트 설정 확인:**
- [ ] Node.js Version: 18.x 이상
- [ ] Deploy Hook 생성 (자동 배포용)

### 2. Railway 설정 (백엔드)
- [ ] https://railway.app 접속
- [ ] GitHub 연동
- [ ] 프로젝트 Import (`api` 디렉토리)
- [ ] Root Directory: `api` 설정
- [ ] Build Command: `npm run build` 설정
- [ ] Start Command: `npm start` 설정
- [ ] 환경변수 설정

**Railway 필수 환경변수:**
```bash
# Server Configuration (Critical)
PORT=5000
NODE_ENV=production

# Supabase (Critical)
SUPABASE_URL=https://yrdfopkerrrhsafynakg.supabase.co
SUPABASE_ANON_KEY=<Supabase Dashboard에서 복사>
SUPABASE_SERVICE_ROLE_KEY=<Supabase Dashboard에서 복사 - 주의: 비밀키>

# CORS (Critical)
ALLOWED_ORIGINS=https://your-domain.vercel.app,https://teeup.kr

# Toss Payments (Phase 2 - 선택)
TOSS_SECRET_KEY=<Phase 2에서 설정>
```

**Railway 프로젝트 설정 확인:**
- [ ] Node.js Version: 18.x 이상
- [ ] Health Check Path: `/health` 설정
- [ ] Public Domain 활성화 및 URL 복사
- [ ] Vercel 환경변수에 백엔드 URL 추가: `NEXT_PUBLIC_API_URL=<Railway Public Domain>`

### 3. Supabase 프로덕션 설정
- [ ] Supabase Dashboard → Settings → Authentication 접속
- [ ] Site URL 설정: `https://your-domain.vercel.app`
- [ ] Redirect URLs 추가:
  - `https://your-domain.vercel.app/auth/callback`
  - `https://your-domain.vercel.app/admin`
- [ ] Email Templates 확인 및 커스터마이징
- [ ] Database → Settings → Connection pooling 활성화 (고트래픽 대비)

### 4. GitHub Secrets 설정 (CI/CD용)

**필수 Secrets (GitHub Repository Settings → Secrets and variables → Actions)**

- [ ] **SUPABASE_ANON_KEY** (Critical)
  - Supabase Dashboard → Settings → API → `anon` `public` key 복사
  - CI 빌드 및 테스트에 필요

**배포 Secrets (자동 배포 사용 시)**

- [ ] **VERCEL_TOKEN**
  - Vercel Account Settings → Tokens → Create Token
  - Scope: Full Account

- [ ] **VERCEL_ORG_ID**
  - Vercel Dashboard → Settings → General → Team ID 복사

- [ ] **VERCEL_PROJECT_ID**
  - Vercel 프로젝트 → Settings → General → Project ID 복사

- [ ] **RAILWAY_TOKEN**
  - Railway Dashboard → Account → Tokens → Create Token

**선택 Secrets**

- [ ] **SLACK_WEBHOOK_URL** (배포 알림용)
  - Slack App → Incoming Webhooks → Webhook URL 복사

- [ ] **CODECOV_TOKEN** (코드 커버리지용)
  - Codecov.io 프로젝트 → Settings → Token 복사

**설정 방법:**
```bash
# GitHub Repository 접속
# Settings → Secrets and variables → Actions → New repository secret

# 각 Secret을 위 목록대로 추가
Name: SUPABASE_ANON_KEY
Secret: <실제 key 값>
```

### 5. 도메인 설정
- [ ] 도메인 구입 (예: teeup.kr)
- [ ] Vercel에서 도메인 연결
  - Settings → Domains → Add Domain
  - DNS 레코드 설정 (A/CNAME)
- [ ] SSL 인증서 자동 설정 확인 (Let's Encrypt)
- [ ] www 리다이렉트 설정 (선택)
- [ ] Supabase에서 새 도메인으로 Site URL 업데이트

### 6. 배포 후 확인사항
- [ ] 프론트엔드 접속 확인: `https://your-domain.vercel.app`
- [ ] 백엔드 Health Check: `https://your-api.railway.app/health`
- [ ] Supabase 연결 확인 (로그인 테스트)
- [ ] 프로 목록 조회 테스트
- [ ] 프로 상세 페이지 테스트
- [ ] 관리자 로그인 테스트 (`/admin`)
- [ ] Sentry 에러 모니터링 확인
- [ ] Vercel Analytics 데이터 수집 확인

## 설정하지 않으면 발생하는 오류
```
Error: VERCEL_TOKEN is not set
Error: VERCEL_ORG_ID is not set
```

## 참고 파일
- `/.github/workflows/deploy-dev.yml`
- `/.github/workflows/deploy-prod.yml`
