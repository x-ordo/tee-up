# [Setup] 카카오톡 채널 연동

**Labels:** `setup`, `enhancement`

---

## 우선순위: Medium

## 설명
카카오톡 상담 및 공유 기능을 위한 설정이 필요합니다.

## 필요한 작업

### 1. 카카오 개발자 계정 설정
- [ ] https://developers.kakao.com/ 접속
- [ ] 애플리케이션 등록
- [ ] JavaScript 키 발급

### 2. 카카오톡 채널 생성
- [ ] 카카오톡 채널 관리자센터 접속
- [ ] 새 채널 생성
- [ ] 채널 ID 확인

### 3. 환경변수 설정
```bash
NEXT_PUBLIC_KAKAO_CHANNEL_ID=_xxxxxx
NEXT_PUBLIC_KAKAO_JS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 기능
- 카카오톡 채팅 상담
- 프로필 공유
- 알림 메시지 발송

## 설정하지 않으면 발생하는 오류
- 카카오톡 버튼 비활성화
- 공유 기능 비작동

## 참고 파일
- `/web/src/lib/kakao/index.ts`
