---
title: TEE:UP 환경 설정 가이드
version: 1.0.0
status: Approved
owner: "@tech-lead"
created: 2025-11-25
updated: 2025-11-25
reviewers: ["@backend-lead", "@frontend-lead"]
language: Korean (한국어)
---

# ENVIRONMENT.md

## 환경 설정 가이드

> **본 문서는 TEE:UP 프로젝트의 개발 환경 설정에 필요한 모든 정보를 제공합니다.**

---

## 변경 이력 (Changelog)

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0.0 | 2025-11-25 | @tech-lead | 최초 작성 |

## 관련 문서 (Related Documents)

- [README.md](README.md) — 빠른 시작 가이드
- [CONTEXT.md](CONTEXT.md) — 시스템 컨텍스트
- [CONTRIBUTING.md](docs/guides/CONTRIBUTING.md) — 기여 가이드

---

## 1. 시스템 요구사항

### 1.1 필수 도구

| 도구 | 최소 버전 | 권장 버전 | 확인 명령어 | 설치 방법 |
|------|----------|----------|------------|----------|
| Node.js | 18.0.0 | 20.x LTS | `node -v` | [nodejs.org](https://nodejs.org) |
| npm | 9.0.0 | 10.x | `npm -v` | Node.js와 함께 설치 |
| Git | 2.30.0 | 2.40+ | `git --version` | [git-scm.com](https://git-scm.com) |
| Docker | 20.10.0 | 24.x | `docker -v` | [docker.com](https://docker.com) (선택) |

### 1.2 권장 IDE

| IDE | 버전 | 비고 |
|-----|------|------|
| VS Code | 최신 | 권장 |
| WebStorm | 2023.x+ | 대안 |
| Cursor | 최신 | AI 지원 |

### 1.3 VS Code 권장 확장

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-azuretools.vscode-docker",
    "eamodio.gitlens",
    "usernamehw.errorlens",
    "formulahendry.auto-rename-tag"
  ]
}
```

---

## 2. 프로젝트 설치

### 2.1 저장소 클론

```bash
# HTTPS
git clone https://github.com/your-org/tee-up.git

# SSH (권장)
git clone git@github.com:your-org/tee-up.git

# 디렉토리 이동
cd tee-up
```

### 2.2 의존성 설치

```bash
# 프론트엔드 의존성
cd web
npm install

# 백엔드 의존성
cd ../api
npm install

# 루트로 복귀
cd ..
```

### 2.3 환경 변수 설정

```bash
# 프론트엔드 환경 변수
cp web/.env.example web/.env.local

# 백엔드 환경 변수
cp api/.env.example api/.env
```

---

## 3. 환경 변수

### 3.1 프론트엔드 환경 변수 (web/.env.local)

```bash
# ═══════════════════════════════════════════════════════════════
# TEE:UP 프론트엔드 환경 변수
# ═══════════════════════════════════════════════════════════════

# 앱 설정
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=TEE:UP

# API 설정
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 분석 (선택)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token

# Sentry (선택)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 3.2 백엔드 환경 변수 (api/.env)

```bash
# ═══════════════════════════════════════════════════════════════
# TEE:UP 백엔드 환경 변수
# ═══════════════════════════════════════════════════════════════

# 서버 설정
NODE_ENV=development
PORT=5000
HOST=localhost

# Supabase 설정
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# JWT 설정
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# CORS 설정
CORS_ORIGIN=http://localhost:3000

# 로깅
LOG_LEVEL=debug

# Toss Payments (Phase 2)
TOSS_CLIENT_KEY=your-toss-client-key
TOSS_SECRET_KEY=your-toss-secret-key

# Cloudinary (선택)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Sentry (선택)
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 3.3 환경별 설정

| 환경 | 파일 | 용도 |
|------|------|------|
| Development | `.env.local` / `.env` | 로컬 개발 |
| Staging | `.env.staging` | 스테이징 서버 |
| Production | `.env.production` | 프로덕션 서버 |

**중요:** `.env` 파일은 절대 Git에 커밋하지 않습니다. `.gitignore`에 포함되어 있습니다.

---

## 4. Supabase 설정

### 4.1 Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 접속
2. 새 프로젝트 생성
3. 프로젝트 URL 및 API 키 복사

### 4.2 데이터베이스 스키마 적용

```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref your-project-ref

# 마이그레이션 실행
supabase db push
```

### 4.3 RLS 정책 확인

Supabase Dashboard에서 각 테이블의 Row Level Security 정책이 활성화되어 있는지 확인합니다.

```sql
-- RLS 활성화 확인
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

---

## 5. 개발 서버 실행

### 5.1 프론트엔드 개발 서버

```bash
cd web
npm run dev

# 실행 결과
# ▲ Next.js 14.x
# - Local:        http://localhost:3000
# - Environments: .env.local
```

### 5.2 백엔드 개발 서버

```bash
cd api
npm run dev

# 또는
npm start

# 실행 결과
# Server running on http://localhost:5000
# API docs: http://localhost:5000/api/docs
```

### 5.3 동시 실행 (권장)

터미널 2개를 열고 각각 실행하거나, 루트에서 concurrently 사용:

```bash
# package.json에 스크립트 추가 시
npm run dev:all
```

---

## 6. Docker 설정 (선택)

### 6.1 Docker Compose 실행

```bash
# 전체 서비스 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down
```

### 6.2 docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000/api
    depends_on:
      - backend

  backend:
    build:
      context: ./api
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - PORT=5000
    env_file:
      - ./api/.env

  # 로컬 PostgreSQL (Supabase 대신 사용 시)
  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: teeup
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 7. 테스트 환경

### 7.1 단위 테스트

```bash
# 프론트엔드 테스트
cd web
npm run test

# 백엔드 테스트
cd api
npm run test
```

### 7.2 E2E 테스트

```bash
# Playwright 설치
npx playwright install

# E2E 테스트 실행
npm run test:e2e
```

### 7.3 테스트 커버리지

```bash
# 커버리지 리포트 생성
npm run test:coverage
```

---

## 8. 코드 품질 도구

### 8.1 ESLint

```bash
# 린트 실행
npm run lint

# 린트 자동 수정
npm run lint:fix
```

### 8.2 Prettier

```bash
# 포매팅 확인
npm run format:check

# 포매팅 적용
npm run format
```

### 8.3 TypeScript 타입 체크

```bash
# 타입 체크
npm run type-check
```

---

## 9. 트러블슈팅

### 9.1 일반적인 문제

#### Node.js 버전 불일치

```bash
# nvm 사용 시
nvm use 20

# 또는 .nvmrc 파일 사용
echo "20" > .nvmrc
nvm use
```

#### 의존성 설치 실패

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

#### 포트 충돌

```bash
# 사용 중인 포트 확인 (macOS/Linux)
lsof -i :3000
lsof -i :5000

# 프로세스 종료
kill -9 <PID>
```

### 9.2 Supabase 연결 문제

1. Supabase URL 및 키 확인
2. 네트워크 연결 상태 확인
3. RLS 정책 확인

```bash
# Supabase 연결 테스트
curl https://your-project.supabase.co/rest/v1/ \
  -H "apikey: $SUPABASE_ANON_KEY"
```

> **참고:** `$SUPABASE_ANON_KEY`는 환경 변수에서 읽어옵니다. 직접 키를 입력하지 마세요.

### 9.3 CORS 에러

```bash
# api/.env에서 CORS_ORIGIN 확인
CORS_ORIGIN=http://localhost:3000

# 여러 도메인 허용 시
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

---

## 10. 환경별 URL

| 환경 | 프론트엔드 | 백엔드 |
|------|-----------|--------|
| Development | http://localhost:3000 | http://localhost:5000 |
| Staging | https://staging.teeup.kr | https://staging-api.teeup.kr |
| Production | https://teeup.kr | https://api.teeup.kr |

---

## 11. 유용한 스크립트

### 11.1 데이터베이스 리셋

```bash
# Supabase 데이터베이스 리셋
supabase db reset

# 시드 데이터 적용
npm run db:seed
```

### 11.2 캐시 클리어

```bash
# Next.js 캐시 클리어
cd web
rm -rf .next

# npm 캐시 클리어
npm cache clean --force
```

### 11.3 빌드 확인

```bash
# 프로덕션 빌드 테스트
cd web
npm run build
npm run start
```

---

## 12. 보안 주의사항

| 항목 | 설명 |
|------|------|
| **.env 파일** | 절대 Git에 커밋하지 않음 |
| **API 키** | 환경 변수로만 관리 |
| **Service Role 키** | 백엔드에서만 사용 |
| **JWT Secret** | 최소 32자 이상 |

### 12.1 시크릿 관리 권장사항

```bash
# 시크릿 생성 (예: JWT_SECRET)
openssl rand -base64 32
```

---

## 13. 추가 리소스

### 13.1 공식 문서

- [Next.js 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Express.js 문서](https://expressjs.com/)

### 13.2 프로젝트 문서

- [CONTEXT.md](CONTEXT.md) — 시스템 컨텍스트
- [ARCHITECTURE.md](docs/specs/ARCHITECTURE.md) — 아키텍처 설계
- [API_SPEC.md](docs/specs/API_SPEC.md) — API 명세

---

**환경 설정에 문제가 있으면 Slack #teeup-dev 채널에 문의하세요.**

═══════════════════════════════════════════════════════════════
✅ VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════
- [x] 목적이 명확하게 정의됨
- [x] 대상 독자가 식별됨
- [x] 범위가 명시됨
- [x] 예제 코드/다이어그램 포함
- [x] 실행 가능한 명령어 포함
- [x] 트러블슈팅 섹션 포함
- [x] 보안 주의사항 포함
- [x] 한국어(Korean)로 작성됨
═══════════════════════════════════════════════════════════════
