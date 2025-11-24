# Admin Account Setup

## 관리자 계정 생성 방법

TEE:UP 플랫폼의 관리자 계정을 Supabase에서 생성하는 방법입니다.

### 1. Supabase 대시보드에서 계정 생성

1. **Supabase 대시보드** 접속
2. **Authentication** → **Users** 메뉴로 이동
3. **Add user** 또는 **Invite** 버튼 클릭

### 2. 이메일/비밀번호 방식으로 생성

**옵션 A: Dashboard에서 직접 생성**
1. **Add user** → **Create new user** 선택
2. Email: `admin@teeup.com` (또는 원하는 이메일)
3. Password: 강력한 비밀번호 입력
4. **Auto Confirm User** 체크 (이메일 인증 생략)
5. **Create user** 클릭

**옵션 B: SQL로 생성 (권장)**

Supabase SQL Editor에서 다음 쿼리 실행:

```sql
-- 1. 관리자 계정 생성 (Supabase Auth에 등록)
-- 주의: 실제 환경에서는 더 강력한 비밀번호 사용
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@teeup.com',
  crypt('your_strong_password_here', gen_salt('bf')),  -- 비밀번호 변경 필요
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin","full_name":"Admin User"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

### 3. 프로필 자동 생성 확인

`handle_new_user()` 트리거가 자동으로 `profiles` 테이블에 레코드를 생성합니다.

생성된 프로필 확인:
```sql
SELECT * FROM profiles WHERE email = 'admin@teeup.com';
```

Role이 'admin'인지 확인하고, 아니라면 업데이트:
```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@teeup.com';
```

### 4. 로그인 테스트

1. 브라우저에서 `/admin` 페이지 접속
2. 생성한 이메일과 비밀번호로 로그인
3. 성공 시 관리자 대시보드로 이동

### 5. 추가 관리자 생성

필요 시 같은 방법으로 추가 관리자 계정을 생성할 수 있습니다.

### 보안 권장사항

1. **강력한 비밀번호 사용**
   - 최소 12자 이상
   - 대소문자, 숫자, 특수문자 포함

2. **이메일 인증 활성화** (프로덕션 환경)
   - Supabase Dashboard → Authentication → Email Templates 설정
   - SMTP 설정 완료

3. **2단계 인증 (향후 구현 예정)**
   - Supabase Auth는 MFA(Multi-Factor Authentication) 지원

4. **Role 기반 접근 제어**
   - `profiles.role`이 'admin'인 사용자만 `/admin` 접근 가능
   - Middleware에서 role 체크 구현 필요

### 트러블슈팅

**문제: 로그인 후 바로 로그아웃됨**
- 해결: `auth.users` 테이블의 `email_confirmed_at`이 NULL이 아닌지 확인

**문제: "Invalid credentials" 에러**
- 해결: 이메일과 비밀번호가 정확한지 확인
- 해결: SQL로 생성 시 `crypt()` 함수를 사용했는지 확인

**문제: Profiles 테이블에 레코드 없음**
- 해결: `handle_new_user()` 트리거가 실행되었는지 확인
- 해결: 수동으로 profiles 레코드 생성

```sql
INSERT INTO public.profiles (id, full_name, role)
VALUES (
  'user_id_from_auth_users',
  'Admin User',
  'admin'
);
```

### 개발 환경 테스트 계정

개발 중에는 다음 계정을 사용할 수 있습니다:
- Email: `admin@teeup.com`
- Password: `TEEup2024!Admin`

**주의**: 프로덕션 환경에서는 반드시 다른 비밀번호 사용!
