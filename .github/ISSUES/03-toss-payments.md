# [Setup] Toss Payments 결제 연동

**Labels:** `setup`, `enhancement`, `payment`

---

## 우선순위: High

## 설명
구독 결제 기능을 위한 Toss Payments 연동이 필요합니다.

## 필요한 작업

### 1. Toss Payments 계정 설정
- [ ] https://developers.tosspayments.com/ 접속
- [ ] 개발자 계정 생성
- [ ] 테스트 API 키 발급
  - Client Key
  - Secret Key

### 2. 환경변수 설정

**프론트엔드 (`web/.env.local`)**
```bash
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxxxxxxxxxxxx
```

**백엔드 (`api/.env`)**
```bash
TOSS_SECRET_KEY=test_sk_xxxxxxxxxxxxxxx
```

### 3. 웹훅 설정 (프로덕션)
- [ ] Toss Payments 대시보드에서 웹훅 URL 등록
- [ ] `/api/webhooks/payment` 엔드포인트 구현

### 4. 프로덕션 전환
- [ ] 사업자 등록증 제출
- [ ] 실 결제 API 키 발급
- [ ] 환경변수 변경

## 현재 구현된 구독 플랜
| 플랜 | 가격 | 기능 |
|------|------|------|
| Basic | 무료 | 월 3건 무료 리드 |
| Pro Monthly | ₩99,000/월 | 무제한 리드 |
| Pro Yearly | ₩990,000/년 | 무제한 리드 (17% 할인) |

## 설정하지 않으면 발생하는 오류
```
Error: Toss Payments SDK not available
Error: Failed to load Toss Payments SDK
```

## 참고 파일
- `/web/src/lib/payments/index.ts`
- `/web/src/app/pricing/page.tsx`
