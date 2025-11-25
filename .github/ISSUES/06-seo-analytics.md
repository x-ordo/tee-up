# [Setup] SEO 및 분석 도구 설정

**Labels:** `setup`, `enhancement`, `seo`

---

## 우선순위: Low

## 설명
검색 엔진 최적화 및 사용자 분석을 위한 설정입니다.

## 필요한 작업

### 1. Google Search Console
- [ ] https://search.google.com/search-console 접속
- [ ] 사이트 소유권 확인
- [ ] 확인 코드 복사

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=xxx
```

### 2. Naver Search Advisor
- [ ] https://searchadvisor.naver.com/ 접속
- [ ] 사이트 등록
- [ ] 확인 코드 복사

```bash
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=xxx
```

### 3. Google Analytics
- [ ] https://analytics.google.com 접속
- [ ] 새 속성 생성
- [ ] 측정 ID 복사

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 4. Sentry (에러 모니터링)
- [ ] https://sentry.io 접속
- [ ] 프로젝트 생성
- [ ] DSN 복사

```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

## 설정하지 않으면 발생하는 오류
- 검색 엔진 인덱싱 불가
- 사용자 행동 분석 불가
- 에러 추적 불가
