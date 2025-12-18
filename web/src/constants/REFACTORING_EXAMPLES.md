# Terminology Abstraction - Refactoring Examples

이 문서는 `terms.ts`를 사용하여 하드코딩된 용어를 추상화하는 방법을 보여줍니다.

## 1. BookingSheet.tsx 리팩토링

### Before (하드코딩)

```tsx
// BookingSheet.tsx
interface BookingSheetProps {
  proId: string;        // ❌ 골프 특화
  proName?: string;     // ❌ 골프 특화
  // ...
}

export function BookingSheet({
  proId,
  proName = '프로',     // ❌ 하드코딩
  // ...
}: BookingSheetProps) {
  return (
    <Drawer>
      <DrawerHeader>
        <DrawerTitle>
          {isDepositRequired ? 'VIP 레슨 예약' : '레슨 예약'}  {/* ❌ */}
        </DrawerTitle>
        <DrawerDescription>
          {proName} 프로님과의 레슨을 예약합니다  {/* ❌ */}
        </DrawerDescription>
      </DrawerHeader>

      {/* ... */}

      <textarea
        placeholder="프로님께 전달할 메시지 (선택)"  {/* ❌ */}
      />

      {/* ... */}

      <p className="text-xs">
        예약금은 레슨 당일 수강료에서 차감됩니다.  {/* ❌ */}
      </p>
    </Drawer>
  );
}
```

### After (추상화 적용)

```tsx
// BookingSheet.tsx
import {
  TERMS,
  withExpertName,
  bookingTitle
} from '@/constants/terms';

interface BookingSheetProps {
  expertId: string;       // ✅ 범용
  expertName?: string;    // ✅ 범용
  // ...
}

export function BookingSheet({
  expertId,
  expertName = TERMS.EXPERT_TITLE,  // ✅ 상수 사용
  // ...
}: BookingSheetProps) {
  return (
    <Drawer>
      <DrawerHeader>
        <DrawerTitle>
          {isDepositRequired
            ? `${TERMS.SERVICE_PREMIUM} 예약`     // ✅
            : `${TERMS.SERVICE_NAME} 예약`}       // ✅
        </DrawerTitle>
        <DrawerDescription>
          {bookingTitle(expertName)}              {/* ✅ 헬퍼 함수 */}
        </DrawerDescription>
      </DrawerHeader>

      {/* ... */}

      <textarea
        placeholder={`${TERMS.EXPERT_TITLE_HONORIFIC}께 전달할 메시지 (선택)`}  {/* ✅ */}
      />

      {/* ... */}

      <p className="text-xs">
        예약금은 {TERMS.SERVICE_NAME} 당일 {TERMS.PRICING}에서 차감됩니다.  {/* ✅ */}
      </p>
    </Drawer>
  );
}
```

---

## 2. Leads Page 리팩토링

### Before

```tsx
// dashboard/leads/page.tsx
export default async function LeadsPage() {
  return (
    <div>
      <h1>리드 관리</h1>
      <p>포트폴리오를 통해 들어온 문의를 확인하세요</p>
      {/* ... */}
    </div>
  );
}
```

### After

```tsx
// dashboard/leads/page.tsx
import { TERMS } from '@/constants/terms';

export default async function LeadsPage() {
  return (
    <div>
      <h1>{TERMS.PROSPECT} 관리</h1>
      <p>{TERMS.PORTFOLIO_PAGE}를 통해 들어온 문의를 확인하세요</p>
      {/* ... */}
    </div>
  );
}
```

---

## 3. Success Content 리팩토링

### Before

```tsx
function SuccessContent({ proName, isDeposit }: SuccessContentProps) {
  return (
    <div>
      <h3>{isDeposit ? 'VIP 예약 확정!' : '예약 요청 완료!'}</h3>
      <p>
        {isDeposit ? (
          <>
            예약금 결제가 완료되었습니다.
            <br />
            {proName} 프로님과의 레슨이 확정되었습니다.
          </>
        ) : (
          <>
            {proName} 프로님이 예약을 확인하면
            연락드릴 예정입니다.
          </>
        )}
      </p>
    </div>
  );
}
```

### After

```tsx
import {
  TERMS,
  withExpertName,
  serviceConfirmedMessage,
  bookingPendingMessage
} from '@/constants/terms';

function SuccessContent({ expertName, isDeposit }: SuccessContentProps) {
  return (
    <div>
      <h3>
        {isDeposit
          ? `${TERMS.SERVICE_PREMIUM} 예약 확정!`
          : `${TERMS.SERVICE_BOOKING} 완료!`}
      </h3>
      <p>
        {isDeposit ? (
          <>
            예약금 결제가 완료되었습니다.
            <br />
            {serviceConfirmedMessage(expertName)}
          </>
        ) : (
          bookingPendingMessage(expertName)
        )}
      </p>
    </div>
  );
}
```

---

## 4. 변수명 리팩토링 (점진적 마이그레이션)

### Phase 1: 새 코드에서 범용 변수명 사용

```typescript
// ✅ 새로 작성하는 코드
interface SessionBooking {
  expertId: string;
  clientId: string;
  sessionPrice: number;
  sessionDuration: number;
}
```

### Phase 2: 기존 코드 점진적 마이그레이션

```typescript
// types.ts - 타입 별칭으로 호환성 유지
export interface BookingRequest {
  /** @deprecated pro_id → expert_id 마이그레이션 예정 */
  pro_id: string;
  // ... 기존 필드
}

// 새 인터페이스
export interface SessionRequest {
  expert_id: string;
  client_id: string;
  // ...
}

// 어댑터 함수
export function toSessionRequest(booking: BookingRequest): SessionRequest {
  return {
    expert_id: booking.pro_id,
    // ...
  };
}
```

---

## 5. 적용 체크리스트

### 즉시 적용 (Low Risk)
- [ ] 새 컴포넌트 작성 시 `TERMS` 사용
- [ ] 새 변수명은 범용 규칙 따르기
- [ ] UI 텍스트 하드코딩 대신 상수 사용

### 점진적 적용 (Medium Risk)
- [ ] 기존 컴포넌트 UI 텍스트 교체
- [ ] Props 이름 변경 (with deprecation)

### 향후 적용 (High Risk - DB 마이그레이션 필요)
- [ ] 테이블명/컬럼명 변경
- [ ] API 응답 필드명 변경

---

## 6. 파일별 수정 필요 목록

`grep -r "프로님\|레슨\|회원님"` 결과 기반:

| 파일 | 우선순위 | 변경 내용 |
|------|---------|----------|
| `BookingSheet.tsx` | P0 | 예약 UI 텍스트 |
| `SuccessContent.tsx` | P0 | 완료 메시지 |
| `ContactSection.tsx` | P1 | 연락처 섹션 |
| `VisualTemplate.tsx` | P1 | 템플릿 텍스트 |
| `CurriculumTemplate.tsx` | P1 | 템플릿 텍스트 |
| `SocialTemplate.tsx` | P1 | 템플릿 텍스트 |
| `admin/pros/` | P2 | 관리자 페이지 |
| `legal/terms/` | P3 | 법적 문서 (별도 관리) |
