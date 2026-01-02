# Screen: Onboarding Quick Setup (프로 등록 빠른 설정)

**Route**: `/onboarding/quick-setup`
**Status**: Implemented
**Last Updated**: 2025-12-30
**Priority**: P1
**Dependencies**: Pro Verification, Media Upload, Profile Draft

---

## 1. 화면 개요

### 목적
프로가 최소 정보만 입력해 빠르게 등록을 완료하고, 운영팀 인증/컨시어지 흐름으로 넘어가도록 한다.

### 사용자 흐름
```
/pro → /onboarding/quick-setup → 등록 완료 → 인증 대기/프로필 초안 생성 → /dashboard 또는 공유 링크
```

### 접근 조건
- **인증 필요**: No
- **권한 수준**: guest
- **전제 조건**: 신규 프로 등록

---

## 2. 레이아웃 구조

### 폼 섹션 구성 (필수 최소 입력)

1. **기본 정보**
   - 이름 (필수)
   - 생년월일 (필수)
   - 연락처 (필수, 휴대폰)
2. **프로 인증**
   - 프로 인증 서류 업로드 (필수)
3. **주요 활동 위치**
   - 지역/도시 선택 (필수)
4. **프로필 사진**
   - 프로필 사진 1장 업로드 (필수)
5. **제출 CTA**
   - "등록 완료" 버튼
6. **설명 버튼**
   - 우측 상단 "설명" 버튼 → 빠른 등록 안내 오버레이
7. **보상 메시지**
   - "필수 정보만 완료하면 전담 매니저가 검증을 진행해 24시간 내 공개 및 리드 연결을 시작합니다."

### 반응형 동작
- 모바일: 단일 컬럼, 스텝형 폼 + 고정 하단 CTA
- 데스크톱: 단일 컬럼 + 여백 강조, 진행 상태 표시

---

## 3. 주요 컴포넌트

- `QuickSetupWizard`
- `FormField`
- `DateInput`
- `PhoneInput`
- `FileUpload`
- `RegionSelect`
- `PrimaryCTA`

---

## 4. 데이터 요구사항

### 입력 스키마

```typescript
interface QuickSetupInput {
  name: string;
  birthDate: string; // YYYY-MM-DD
  phoneNumber: string;
  proVerificationFileUrl: string;
  primaryRegion: string;
  primaryCity: string;
  profileImageUrl: string;
}
```

### 유효성 기준
- 이름: 2자 이상
- 생년월일: YYYY-MM-DD 형식
- 연락처: 휴대폰 번호 형식
- 프로 인증/프로필 사진: 이미지 파일 (jpg/png/webp)

---

## 5. 인터랙션 정의

### 5.1 등록 제출
1. **Given** 프로가 모든 필수 항목을 입력한 상태에서
2. **When** "등록 완료" CTA를 클릭하면
3. **Then** 프로필 초안이 생성되고 인증 대기 상태로 전환
4. **Then** 완료 화면에서 "24시간 내 공개 + 담당 매니저 연락" 안내
5. **Then** 대시보드 이동/공유 링크 제공

### 5.2 파일 업로드
- 업로드 진행 상태 표시
- 실패 시 재시도 버튼 제공

### 5.3 설명 버튼
1. **Given** 사용자가 폼 진행 중일 때
2. **When** "설명" 버튼을 클릭하면
3. **Then** 필수 입력/프로 인증/프로필 사진의 목적을 안내하는 오버레이가 표시됨
4. **Then** 닫기 버튼으로 오버레이를 종료할 수 있음

---

## 6. 접근성 요구사항

- [ ] 모든 입력에 label 연결
- [ ] 오류 메시지에 aria-describedby 연결
- [ ] 파일 업로드에 키보드 접근 가능
- [ ] CTA 버튼 포커스 링 제공

---

## 7. 에러 케이스

| 에러 유형 | 처리 |
|----------|------|
| 필수 입력 누락 | 필드별 오류 메시지 표시 |
| 파일 업로드 실패 | 재시도 안내 |
| 인증 제출 실패 | 오류 알림 + 재시도 CTA |

---

## 8. 관련 화면

- **이전 화면**: [Landing - Pros](./landing-pro.md)
- **다음 화면**: [Dashboard Home](../04-dashboard/dashboard-home.md), Profile 공유 링크
