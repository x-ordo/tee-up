# [Setup] GitHub Secrets 설정 (CI/CD)

**Labels:** `setup`, `critical`, `devops`

---

## 우선순위: Critical

## 설명
CI/CD 파이프라인 실행을 위한 GitHub Secrets 설정이 필요합니다.

## 필요한 작업

### 1. Supabase Secrets (CI 빌드용)

- [ ] **SUPABASE_ANON_KEY**
  - 용도: CI 빌드, 테스트 실행 시 필요
  - 가져오기: Supabase Dashboard → Settings → API → Project API keys
  - 키 타입: `anon` `public` key

### 2. Vercel Secrets (자동 배포용)

- [ ] **VERCEL_TOKEN**
  - 용도: Vercel 자동 배포
  - 가져오기:
    1. https://vercel.com 로그인
    2. Account Settings → Tokens
    3. Create Token
    4. Scope: Full Account

- [ ] **VERCEL_ORG_ID**
  - 용도: Vercel Organization 식별
  - 가져오기:
    1. Vercel Dashboard
    2. Settings → General
    3. Team ID 복사

- [ ] **VERCEL_PROJECT_ID**
  - 용도: Vercel 프로젝트 식별
  - 가져오기:
    1. Vercel 프로젝트 선택
    2. Settings → General
    3. Project ID 복사

### 3. Railway Secrets (백엔드 배포용)

- [ ] **RAILWAY_TOKEN**
  - 용도: Railway 자동 배포
  - 가져오기:
    1. https://railway.app 로그인
    2. Account Settings → Tokens
    3. Create Token

### 4. 선택 Secrets

- [ ] **SLACK_WEBHOOK_URL** (배포 알림)
  - 용도: CI/CD 결과 Slack 알림
  - 가져오기:
    1. Slack Workspace 설정
    2. Apps → Incoming Webhooks 추가
    3. Webhook URL 생성

- [ ] **CODECOV_TOKEN** (코드 커버리지)
  - 용도: 테스트 커버리지 리포트
  - 가져오기:
    1. https://codecov.io 로그인
    2. 프로젝트 생성
    3. Settings → Token 복사

## GitHub에 Secrets 등록하기

### 방법 1: GitHub UI 사용 (권장)

1. GitHub Repository 이동
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Secrets and variables** → **Actions** 클릭
4. **New repository secret** 버튼 클릭
5. Name과 Secret 값 입력
6. **Add secret** 클릭

### 방법 2: GitHub CLI 사용

```bash
# GitHub CLI 설치 (Mac)
brew install gh

# GitHub 로그인
gh auth login

# Secret 등록
gh secret set SUPABASE_ANON_KEY --body "your-anon-key"
gh secret set VERCEL_TOKEN --body "your-vercel-token"
gh secret set VERCEL_ORG_ID --body "your-org-id"
gh secret set VERCEL_PROJECT_ID --body "your-project-id"
gh secret set RAILWAY_TOKEN --body "your-railway-token"

# 선택 Secrets
gh secret set SLACK_WEBHOOK_URL --body "your-webhook-url"
gh secret set CODECOV_TOKEN --body "your-codecov-token"
```

## 설정 확인

### Secrets 등록 확인
- [ ] Repository → Settings → Secrets and variables → Actions
- [ ] 모든 필수 Secrets이 목록에 표시되는지 확인
- [ ] Secret 값은 `***`로 마스킹되어 표시됨

### CI/CD 동작 확인
- [ ] GitHub Actions 탭에서 workflow 실행 확인
- [ ] 빌드 성공 여부 확인
- [ ] 배포 성공 여부 확인

## 설정하지 않으면 발생하는 오류

```bash
# CI 빌드 실패
Error: SUPABASE_ANON_KEY is not set
Run failed: Build Frontend

# Vercel 배포 실패
Error: VERCEL_TOKEN is not set
Error: VERCEL_ORG_ID is not set
Error: VERCEL_PROJECT_ID is not set

# Railway 배포 실패
Error: RAILWAY_TOKEN is not set
```

## 보안 주의사항

⚠️ **절대 소스코드에 Secret을 커밋하지 마세요!**

- ✅ GitHub Secrets 사용 (권장)
- ✅ 환경변수 파일 (.env.local)을 .gitignore에 추가
- ❌ Secret을 코드에 하드코딩
- ❌ Secret을 공개 저장소에 커밋
- ❌ Secret을 로그에 출력

## 참고 파일
- `/.github/workflows/ci.yml`
- `/.github/workflows/deploy-dev.yml`
- `/.github/workflows/deploy-prod.yml`
- `/.github/workflows/test.yml`

---

**마지막 업데이트**: 2025-12-01
