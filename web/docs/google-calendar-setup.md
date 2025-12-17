# Google Calendar 연동 설정 가이드

TEE:UP 프로 스케줄러와 Google Calendar를 연동하기 위한 설정 가이드입니다.

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성 및 API 활성화

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **APIs & Services > Library**로 이동
4. "Google Calendar API" 검색 후 **Enable** 클릭

### 1.2 OAuth 동의 화면 설정

1. **APIs & Services > OAuth consent screen** 이동
2. User Type: **External** 선택
3. 앱 정보 입력:
   - App name: `TEE:UP`
   - User support email: 지원 이메일
   - Developer contact: 개발자 이메일
4. **Scopes** 단계에서 다음 스코프 추가:
   ```
   https://www.googleapis.com/auth/calendar
   https://www.googleapis.com/auth/calendar.events
   ```
5. **Test users**에 테스트 계정 추가 (개발 중)

### 1.3 OAuth 2.0 Client ID 생성

1. **APIs & Services > Credentials** 이동
2. **Create Credentials > OAuth client ID** 클릭
3. Application type: **Web application**
4. Name: `TEE:UP Web Client`
5. Authorized redirect URIs 추가:
   ```
   https://<your-supabase-project>.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback  (개발용)
   ```
6. **Client ID**와 **Client Secret** 저장

## 2. Supabase 설정

### 2.1 Google Provider 활성화

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택 > **Authentication > Providers**
3. **Google** 토글 활성화
4. 입력:
   - **Client ID**: Google Cloud에서 생성한 Client ID
   - **Client Secret**: Google Cloud에서 생성한 Client Secret

### 2.2 Google Calendar 스코프 추가 (중요!)

Supabase Dashboard에서 직접 스코프를 추가할 수 없으므로, 클라이언트 측에서 로그인 시 스코프를 지정해야 합니다.

```typescript
// web/src/lib/supabase/auth.ts
import { createClient } from './client';

export async function signInWithGoogleCalendar() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: 'https://www.googleapis.com/auth/calendar.events',
      queryParams: {
        access_type: 'offline',  // Refresh token 발급을 위해 필수
        prompt: 'consent',       // 항상 동의 화면 표시 (refresh token 보장)
      },
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return { data, error };
}
```

### 2.3 환경 변수 설정

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 3. Refresh Token 보안 관리

### 3.1 Supabase Session 활용

Supabase Auth는 Google OAuth의 access_token과 refresh_token을 세션에 저장합니다.
**provider_token**과 **provider_refresh_token**으로 접근 가능합니다.

```typescript
// 세션에서 Google tokens 가져오기
const { data: { session } } = await supabase.auth.getSession();

if (session) {
  const googleAccessToken = session.provider_token;
  const googleRefreshToken = session.provider_refresh_token;
}
```

### 3.2 보안 고려사항

1. **서버 사이드에서만 토큰 사용**
   - Google Calendar API 호출은 Server Actions에서만 수행
   - 클라이언트에 access_token 노출 최소화

2. **토큰 저장하지 않기**
   - Refresh token을 별도 DB에 저장하지 않음
   - Supabase Auth 세션 관리에 위임
   - 세션 만료 시 재로그인 유도

3. **스코프 최소화**
   - `calendar.events`만 요청 (전체 calendar 권한 X)
   - 읽기/쓰기 필요시에만 권한 요청

### 3.3 토큰 갱신 흐름

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Client    │────▶│  Supabase    │────▶│  Google OAuth   │
│  (Browser)  │     │    Auth      │     │    Server       │
└─────────────┘     └──────────────┘     └─────────────────┘
       │                    │                      │
       │  1. Login          │                      │
       │───────────────────▶│  2. OAuth Flow       │
       │                    │─────────────────────▶│
       │                    │  3. Tokens           │
       │                    │◀─────────────────────│
       │  4. Session        │                      │
       │◀───────────────────│                      │
       │                    │                      │
       │  5. API Call       │                      │
       │───────────────────▶│  6. Auto Refresh     │
       │                    │─────────────────────▶│
       │  7. Response       │                      │
       │◀───────────────────│                      │
```

## 4. 테스트 체크리스트

- [ ] Google Cloud에서 Calendar API 활성화됨
- [ ] OAuth 동의 화면에 calendar 스코프 포함
- [ ] Supabase에 Google Provider Client ID/Secret 설정됨
- [ ] 로그인 시 Calendar 권한 요청 화면 표시
- [ ] 로그인 후 `session.provider_token` 존재 확인
- [ ] Calendar API 호출 테스트 성공

## 5. 프로덕션 배포 전 체크리스트

- [ ] Google OAuth 앱 "프로덕션" 상태로 전환
- [ ] Google Cloud Console에서 앱 검증 완료
- [ ] Supabase redirect URL에 프로덕션 도메인 추가
- [ ] 에러 핸들링 및 토큰 만료 처리 구현
