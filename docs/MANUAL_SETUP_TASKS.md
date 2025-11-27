# 수동 설정 작업 목록

> **본 문서는 사람이 직접 수행해야 하는 외부 서비스 설정 작업입니다.**
>
> 작성일: 2025-11-27
> 관련 Issues: #5, #6, #7, #8, #9, #10

---

## 1. Supabase 프로젝트 설정 (Issue #5) - Critical

### 작업 단계
- [ ] https://supabase.com 에서 계정 생성/로그인
- [ ] 새 프로젝트 생성 (지역: Northeast Asia - ap-northeast-1 권장)
- [ ] Dashboard → Settings → API에서 키 복사:
  - [ ] Project URL: `https://xxxxx.supabase.co`
  - [ ] anon key (공개)
  - [ ] service_role key (비밀)
- [ ] SQL Editor에서 `/supabase/schema.sql` 실행

### 복사할 값
```
Project URL: ___________________________________
Anon Key: _____________________________________
Service Role Key: _____________________________
```

---

## 2. 관리자 계정 생성 (Issue #6) - Critical

### 작업 단계
- [ ] Supabase Dashboard → Authentication → Users
- [ ] "Add user" 클릭
- [ ] 정보 입력:
  - Email: `admin@teeup.com` (변경 가능)
  - Password: 강력한 비밀번호
  - "Auto Confirm User" 체크
- [ ] 생성된 사용자 확인

### 기록
```
Admin Email: __________________________________
Password: ____________________________________
```

---

## 3. Toss Payments 연동 (Issue #7) - High

### 작업 단계
- [ ] https://developers.tosspayments.com 접속
- [ ] 개발자 계정 생성
- [ ] 테스트 API 키 발급

### 복사할 값
```
Client Key (test_ck_xxx): _____________________
Secret Key (test_sk_xxx): _____________________
```

### 프로덕션 전환 시 (나중에)
- [ ] 사업자 등록증 제출
- [ ] 실 결제 API 키 발급

---

## 4. 카카오톡 채널 연동 (Issue #8) - Medium

### 작업 단계
- [ ] https://developers.kakao.com 에서 앱 등록
- [ ] JavaScript 키 발급 (앱 설정 → 앱 키)
- [ ] https://center-pf.kakao.com 에서 채널 생성
- [ ] 채널 ID 확인 (`_xxxxxx` 형식)

### 복사할 값
```
JavaScript Key: _______________________________
Channel ID: ___________________________________
```

---

## 5. 배포 환경 설정 (Issue #9) - High

### Vercel (프론트엔드)
- [ ] https://vercel.com 가입
- [ ] GitHub 저장소 연동 (Prometheus-P/tee-up)
- [ ] `web` 디렉토리 선택하여 Import
- [ ] 환경변수 설정 (아래 참조)

### Railway (백엔드)
- [ ] https://railway.app 가입
- [ ] GitHub 저장소 연동
- [ ] `api` 디렉토리 선택하여 Import
- [ ] 환경변수 설정 (아래 참조)

### 도메인 설정 (선택)
- [ ] 도메인 구입 (예: teeup.kr)
- [ ] Vercel에서 도메인 연결
- [ ] SSL 인증서 확인

---

## 6. SEO 및 분석 도구 (Issue #10) - Low

### Google Search Console
- [ ] https://search.google.com/search-console
- [ ] 사이트 소유권 확인
- [ ] 확인 코드: ___________________________________

### Naver Search Advisor
- [ ] https://searchadvisor.naver.com
- [ ] 사이트 등록
- [ ] 확인 코드: ___________________________________

### Google Analytics
- [ ] https://analytics.google.com
- [ ] 새 속성 생성
- [ ] 측정 ID (G-XXXXXXXXXX): _____________________

### Sentry (에러 모니터링)
- [ ] https://sentry.io
- [ ] 프로젝트 생성
- [ ] DSN: _________________________________________

---

## 환경변수 설정 가이드

위 작업 완료 후 아래 파일에 값을 입력하세요.

### `web/.env.local`
```bash
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Toss Payments (Phase 2)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxx

# Kakao (Phase 1 Week 4)
NEXT_PUBLIC_KAKAO_CHANNEL_ID=_xxxxxx
NEXT_PUBLIC_KAKAO_JS_KEY=xxxxxxxx

# SEO/Analytics (선택)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=xxx
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=xxx
```

### `api/.env`
```bash
# Supabase (필수)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Toss Payments (Phase 2)
TOSS_SECRET_KEY=test_sk_xxx

# Server
PORT=5000
NODE_ENV=development
```

---

## 완료 체크리스트

| 작업 | 우선순위 | 완료 |
|------|----------|------|
| Supabase 설정 | Critical | [ ] |
| 관리자 계정 | Critical | [ ] |
| Toss Payments | High | [ ] |
| 배포 환경 | High | [ ] |
| 카카오톡 | Medium | [ ] |
| SEO/분석 | Low | [ ] |

---

**완료 후 Claude에게 알려주시면 환경변수 적용 및 코드 연동을 진행합니다.**
