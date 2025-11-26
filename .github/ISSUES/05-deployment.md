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
- [ ] 환경변수 설정

**Vercel 환경변수:**
```
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_TOSS_CLIENT_KEY=xxx
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2. Railway 설정 (백엔드)
- [ ] https://railway.app 접속
- [ ] GitHub 연동
- [ ] 프로젝트 Import (`api` 디렉토리)
- [ ] 환경변수 설정

### 3. GitHub Secrets 설정
```
VERCEL_TOKEN=xxx
VERCEL_ORG_ID=xxx
VERCEL_PROJECT_ID=xxx
RAILWAY_TOKEN=xxx
SLACK_WEBHOOK_URL=xxx (선택)
```

### 4. 도메인 설정
- [ ] 도메인 구입 (예: teeup.kr)
- [ ] Vercel에서 도메인 연결
- [ ] SSL 인증서 자동 설정 확인

## 설정하지 않으면 발생하는 오류
```
Error: VERCEL_TOKEN is not set
Error: VERCEL_ORG_ID is not set
```

## 참고 파일
- `/.github/workflows/deploy-dev.yml`
- `/.github/workflows/deploy-prod.yml`
