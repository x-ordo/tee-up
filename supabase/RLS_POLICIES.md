# Row Level Security (RLS) Policies

> **Last Updated:** 2025-01
> **Version:** 1.0
> **Total Tables:** 19 | **Total Policies:** 82

이 문서는 TEE:UP 데이터베이스의 모든 Row Level Security 정책을 설명합니다.

---

## 목차

1. [보안 전략 개요](#보안-전략-개요)
2. [주요 보안 패턴](#주요-보안-패턴)
3. [테이블별 정책](#테이블별-정책)
4. [감사 체크리스트](#감사-체크리스트)

---

## 보안 전략 개요

### 원칙

1. **최소 권한 원칙 (Principle of Least Privilege)**
   - 사용자는 필요한 데이터에만 접근 가능
   - 기본적으로 모든 접근 차단, 명시적 허용만 가능

2. **소유권 기반 접근 (Ownership-based Access)**
   - 대부분의 리소스는 소유자만 수정/삭제 가능
   - `auth.uid() = user_id` 패턴 사용

3. **단계적 공개 (Progressive Disclosure)**
   - 공개 콘텐츠: `is_approved = true` 또는 `status = 'published'`
   - 비공개 콘텐츠: 소유자만 접근 가능

4. **관리자 우회 (Admin Override)**
   - 관리자는 필요 시 모든 데이터 접근 가능
   - `role = 'admin'` 체크로 구현

### 접근 수준

| 수준 | 설명 | 예시 |
|------|------|------|
| **Public** | 누구나 접근 가능 | 승인된 프로필, 공개 스튜디오 |
| **Authenticated** | 로그인 사용자만 | 자신의 구독 정보 |
| **Owner** | 리소스 소유자만 | 프로필 수정, 리드 조회 |
| **Participant** | 참여자만 | 채팅방 메시지 |
| **Admin** | 관리자만 | 분쟁 조정, 전체 예약 조회 |

---

## 주요 보안 패턴

### 1. 소유권 확인 패턴
```sql
-- 직접 소유권 확인
user_id = auth.uid()

-- 관련 테이블 통한 소유권 확인
EXISTS (
  SELECT 1 FROM public.pro_profiles
  WHERE id = target_table.pro_id
  AND user_id = auth.uid()
)
```

### 2. 공개/승인 상태 패턴
```sql
-- 승인된 콘텐츠만 공개
is_approved = true OR user_id = auth.uid()

-- 게시 상태 확인
status = 'published' OR owner_id = auth.uid()
```

### 3. 참여자 확인 패턴 (채팅)
```sql
-- 양측 참여자 모두 접근 가능
pro_id = auth.uid() OR golfer_id = auth.uid()
```

### 4. 익명 생성 허용 패턴
```sql
-- 공개 폼 제출 허용
WITH CHECK (true)
```

### 5. RPC 우회 패턴
```sql
-- 직접 INSERT 차단, 함수 통해서만 생성
WITH CHECK (false)
-- RPC 함수는 SECURITY DEFINER로 RLS 우회
```

### 6. 소프트 삭제 패턴
```sql
-- 아카이브된 데이터 제외
is_archived = false AND ...
```

---

## 테이블별 정책

### 1. profiles (사용자 프로필)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Public profiles are viewable by everyone | SELECT | `true` | 모든 프로필 공개 조회 허용 |
| Users can update own profile | UPDATE | `auth.uid() = id` | 본인 프로필만 수정 가능 |

**보안 근거:**
- 프로필은 플랫폼 내 기본 정보로 공개
- 개인정보는 별도 테이블(비공개)에 저장
- 수정은 본인만 가능하여 데이터 무결성 보장

---

### 2. pro_profiles (프로 프로필)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Approved pro profiles are viewable by everyone | SELECT | `is_approved = true OR user_id = auth.uid()` | 승인된 프로필만 공개, 본인은 항상 조회 가능 |
| Pros can update own profile | UPDATE | `user_id = auth.uid()` | 본인 프로필만 수정 가능 |

**보안 근거:**
- 승인 프로세스를 통해 품질 관리
- 미승인 프로는 본인만 볼 수 있어 개발/테스트 가능
- 수정 권한을 소유자로 제한하여 무단 변경 방지

---

### 3. studios (스튜디오/아카데미)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Public studios are viewable by everyone | SELECT | `is_public = true OR owner_id = auth.uid()` | 공개 스튜디오만 노출 |
| Owners can insert their studios | INSERT | `owner_id = auth.uid()` | 본인 소유 스튜디오만 생성 |
| Owners can update their studios | UPDATE | `owner_id = auth.uid()` | 본인 스튜디오만 수정 |
| Owners can delete their studios | DELETE | `owner_id = auth.uid()` | 본인 스튜디오만 삭제 |

**보안 근거:**
- 스튜디오 공개 여부는 소유자가 결정
- 완전한 CRUD 권한을 소유자에게만 부여
- 멤버 관리는 별도 테이블(studio_members)에서 처리

---

### 4. leads (리드/문의)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Pros can view their leads | SELECT | `EXISTS (SELECT 1 FROM pro_profiles WHERE id = leads.pro_id AND user_id = auth.uid())` | 해당 프로만 리드 조회 가능 |
| Anyone can create leads | INSERT | `true` | 익명 문의 허용 (로그인 불필요) |

**보안 근거:**
- 리드는 **민감한 비즈니스 데이터** - 해당 프로만 조회
- 익명 리드 생성 허용으로 전환율 극대화
- UPDATE/DELETE 없음 - 리드 변조 방지 (감사 추적용)

---

### 5. bookings (예약)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Pros can view their bookings | SELECT | 프로 소유권 확인 | 프로가 받은 예약 조회 |
| Users can view own bookings | SELECT | `user_id = auth.uid()` | 본인이 한 예약 조회 |
| Anyone can create bookings | INSERT | `true` | 게스트 예약 허용 |
| Pros can update their bookings | UPDATE | 프로 소유권 확인 | 예약 상태 변경 (확정/취소) |
| Users can update own bookings | UPDATE | `user_id = auth.uid()` | 예약 수정/취소 |

**보안 근거:**
- 양측(프로/고객) 모두 조회 가능
- 게스트 예약 지원으로 회원가입 장벽 제거
- 삭제 불가 - 예약 기록은 영구 보존 (분쟁 대비)

---

### 6. booking_requests (예약 요청)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Pros can view own booking requests | SELECT | 프로 소유권 확인 | 본인에게 온 요청만 조회 |
| Pros can update own booking requests | UPDATE | 프로 소유권 확인 | 요청 승인/거절 |
| Anyone can create booking requests | INSERT | `true` | 공개 폼 제출 허용 |
| Admins have full access | ALL | `role = 'admin'` | 관리자 전체 접근 |

**보안 근거:**
- 예약 요청은 leads와 유사하게 익명 생성 허용
- 프로만 자신의 요청 관리 가능
- 관리자는 분쟁 조정을 위해 전체 접근

---

### 7. availability_schedules (가용 시간)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Public can view approved pro schedules | SELECT | `is_approved = true` | 예약 UI용 공개 조회 |
| Pros can view own schedules | SELECT | 프로 소유권 확인 | 본인 스케줄 관리 |
| Pros can create/update/delete own schedules | INSERT/UPDATE/DELETE | 프로 소유권 확인 | 완전한 스케줄 관리 권한 |

**보안 근거:**
- 승인된 프로의 스케줄만 공개 (예약 페이지용)
- 프로가 직접 가용 시간 관리
- 스케줄 정보는 민감하지 않아 공개 가능

---

### 8. blocked_slots (차단 시간)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Public can view blocked slots | SELECT | 프로 승인 상태 확인 | 예약 UI에서 차단 시간 표시 |
| Pros can manage own blocked slots | ALL | 프로 소유권 확인 | 휴무/개인 일정 관리 |

**보안 근거:**
- 차단 시간은 예약 불가 표시용으로 공개 필요
- 프로만 자신의 차단 시간 관리

---

### 9. chat_rooms (채팅방) - Legacy

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Users can view own chat rooms | SELECT | `is_archived = false AND (pro_id = auth.uid() OR golfer_id = auth.uid())` | 참여자만 조회, 아카이브 제외 |
| Golfers can create chat rooms | INSERT | `golfer_id = auth.uid()` | 골퍼만 채팅방 생성 가능 |
| Participants can update chat rooms | UPDATE | 참여자 확인 | 상태 변경 (매칭 완료 등) |

**보안 근거:**
- 채팅방은 1:1 대화로 참여자만 접근
- 골퍼가 먼저 문의하는 구조
- 소프트 삭제로 기록 보존

---

### 10. messages (메시지) - Legacy

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Users can view messages in their chat rooms | SELECT | 채팅방 참여자 확인 + 아카이브 제외 | 본인 채팅방 메시지만 조회 |
| Chat participants can send messages | INSERT | `sender_id = auth.uid()` + 채팅방 참여자 확인 | 본인으로만 메시지 전송 가능 |

**보안 근거:**
- 메시지는 채팅방 참여자만 접근
- 메시지 위조 방지 (sender_id 확인)
- UPDATE/DELETE 없음 - 메시지 변조 방지

---

### 11. portfolio_sections (포트폴리오 섹션)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Portfolio sections are public for approved profiles | SELECT | 프로 승인 상태 확인 | 승인된 프로의 포트폴리오만 공개 |
| Pros can manage their portfolio sections | INSERT/UPDATE/DELETE | 프로 소유권 확인 | 본인 포트폴리오 관리 |

**보안 근거:**
- 포트폴리오는 프로필의 일부로 승인 상태 따름
- 프로가 직접 콘텐츠 관리

---

### 12. sites (사이트)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Published sites are viewable by everyone | SELECT | `status = 'published' OR owner_id = auth.uid()` | 게시된 사이트만 공개 |
| Users can manage their own sites | ALL | `owner_id = auth.uid()` | 완전한 사이트 관리 권한 |

**보안 근거:**
- 사이트 게시 여부는 소유자가 결정
- 초안(draft) 상태는 비공개

---

### 13. site_events (사이트 이벤트)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Users can view their site events | SELECT | 사이트 소유권 확인 | 본인 사이트 분석용 |
| No direct insert to site_events | INSERT | `false` | RPC 함수 통해서만 생성 |

**보안 근거:**
- 이벤트는 **과금 데이터** - 직접 조작 방지
- `tup_log_site_event` RPC 함수만 생성 가능
- 조회는 소유자만 가능

---

### 14. rate_limits (속도 제한)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Rate limits are system managed | ALL | `false` | 모든 사용자 접근 차단 |

**보안 근거:**
- 시스템 내부 테이블로 사용자 접근 불필요
- Service Role만 접근 가능

---

### 15. memberships (멤버십)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Users can view/create/update own membership | SELECT/INSERT/UPDATE | `user_id = auth.uid()` | 본인 멤버십 관리 |

**보안 근거:**
- 멤버십 정보는 민감한 결제 데이터
- 본인만 조회/수정 가능
- DELETE 없음 - 멤버십 취소는 상태 변경으로 처리
- 웹훅 처리는 Service Role 사용

---

### 16. subscriptions (구독) - Legacy

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Users can view/insert/update own subscription | SELECT/INSERT/UPDATE | `user_id = auth.uid()` | 본인 구독 관리 |

**보안 근거:**
- memberships와 동일한 보안 모델
- 레거시 테이블 (하위 호환용)

---

### 17. payment_history (결제 이력)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Users can view/insert own payment history | SELECT/INSERT | `user_id = auth.uid()` | 본인 결제 기록 조회/생성 |

**보안 근거:**
- 결제 기록은 민감한 금융 데이터
- UPDATE/DELETE 없음 - 결제 기록 변조 방지

---

### 18. studio_members (스튜디오 멤버)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Public can view members of public studios | SELECT | 스튜디오 공개 상태 확인 | 공개 스튜디오 멤버 목록 표시 |
| Studio owners can view their members | SELECT | 스튜디오 소유권 확인 | 멤버 관리용 |
| Members can view own membership | SELECT | 프로 소유권 확인 | 본인 소속 확인 |
| Studio owners can add/update members | INSERT/UPDATE | 스튜디오 소유권 확인 | 멤버 초대/역할 변경 |
| Pros can join via invite | INSERT | 프로 소유권 확인 | 초대 수락 |
| Studio owners can remove members | DELETE | 스튜디오 소유권 + `role = 'member'` | 멤버 제거 (오너 제외) |
| Members can leave studio | DELETE | 프로 소유권 + `role = 'member'` | 자발적 탈퇴 (오너 제외) |

**보안 근거:**
- 복잡한 다중 역할 구조 지원
- 오너는 삭제 불가 (스튜디오 무결성 보장)
- 멤버는 자발적으로 탈퇴 가능

---

### 19. studio_invites (스튜디오 초대)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Studio owners can view invites | SELECT | 스튜디오 소유권 확인 | 발송한 초대 관리 |
| Anyone can view invite by token | SELECT | `status = 'pending' AND expires_at > NOW()` | 초대 링크 검증용 |
| Studio owners can manage invites | INSERT/UPDATE/DELETE | 스튜디오 소유권 확인 | 초대 생성/취소 |

**보안 근거:**
- 초대 토큰은 공개 접근 가능 (링크 공유)
- 만료된/사용된 초대는 조회 불가
- 오너만 초대 관리 가능

---

### 20. dispute_logs (분쟁 기록)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Admins can view all dispute logs | SELECT | `role = 'admin'` | 분쟁 조정용 전체 조회 |
| Pros can view dispute logs for their bookings | SELECT | 예약-프로 관계 확인 | 본인 예약 분쟁 조회 |
| Users can view/create dispute logs for their bookings | SELECT/INSERT | `user_id = auth.uid()` | 분쟁 제기/조회 |
| Pros can create dispute logs | INSERT | 예약-프로 관계 확인 | 프로 측 분쟁 대응 |
| Admins can create dispute logs | INSERT | `role = 'admin'` | 관리자 메모/결정 기록 |

**보안 근거:**
- 분쟁 기록은 법적 증거가 될 수 있음
- 양측(고객/프로) + 관리자 모두 기록 가능
- UPDATE/DELETE 없음 - 분쟁 기록 변조 방지

---

### 21. lesson_logs (레슨 기록)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Pros can view own lesson logs | SELECT | 프로 소유권 확인 | 본인 레슨 기록 관리 |
| Students can view shared lesson logs | SELECT | `student_id = auth.uid() AND is_shared_with_student = true` | 공유된 기록만 학생 조회 |
| Pros can manage own lesson logs | INSERT/UPDATE/DELETE | 프로 소유권 확인 | 완전한 레슨 기록 관리 |

**보안 근거:**
- 레슨 기록은 프로의 지적 재산
- 학생과 공유 여부는 프로가 결정
- 프로만 레슨 기록 수정/삭제 가능

---

### 22. lesson_media (레슨 미디어)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Pros can view own lesson media | SELECT | lesson_log → pro 관계 확인 | 본인 미디어 관리 |
| Students can view shared lesson media | SELECT | lesson_log 공유 상태 확인 | 공유된 미디어만 학생 조회 |
| Pros can manage own lesson media | INSERT/UPDATE/DELETE | lesson_log → pro 관계 확인 | 완전한 미디어 관리 |

**보안 근거:**
- lesson_logs와 동일한 보안 모델
- 미디어 접근은 부모 레슨 기록의 공유 상태 따름

---

### 23. theme_presets (테마 프리셋)

| 정책명 | 작업 | 조건 | 의도 |
|--------|------|------|------|
| Anyone can read active theme presets | SELECT | `is_active = true` | 활성화된 테마만 공개 |

**보안 근거:**
- 테마 프리셋은 시스템 데이터 (읽기 전용)
- 비활성 테마는 개발/테스트용으로 숨김
- 수정은 관리자(Service Role)만 가능

---

## 감사 체크리스트

### 정기 보안 검토 항목

- [ ] 모든 테이블에 RLS 활성화 확인
- [ ] 새 테이블 추가 시 RLS 정책 정의
- [ ] INSERT 정책에서 `user_id = auth.uid()` 확인 (위조 방지)
- [ ] 민감 데이터 테이블 UPDATE/DELETE 제한 확인
- [ ] 공개 데이터 최소화 (is_approved, status 활용)
- [ ] Admin 우회 정책 최소화 및 로깅

### 잠재적 취약점

| 항목 | 위험도 | 상태 | 비고 |
|------|--------|------|------|
| leads INSERT 익명 허용 | 중 | 의도적 | 스팸 방지는 rate_limits로 처리 |
| bookings INSERT 익명 허용 | 중 | 의도적 | 게스트 예약 지원 필요 |
| booking_requests INSERT 익명 허용 | 중 | 의도적 | 공개 폼 제출 필요 |
| site_events 직접 INSERT 차단 | 하 | 정상 | RPC 함수 우회 의도적 |

### 권장 사항

1. **정기 감사**: 분기별 RLS 정책 검토
2. **로깅**: 관리자 작업 로그 기록 (audit_logs 테이블 고려)
3. **테스트**: 각 역할별 접근 테스트 자동화
4. **문서 동기화**: 마이그레이션 시 이 문서 업데이트

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2025-01 | 1.0 | 초기 문서화 (82개 정책) |
