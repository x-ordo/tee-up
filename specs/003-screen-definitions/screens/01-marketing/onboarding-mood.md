# Screen: Onboarding Mood (온보딩 무드)

**Route**: `/onboarding/mood`
**Status**: Implemented
**Last Updated**: 2025-12-30
**Priority**: P1
**Dependencies**: -

---

## 1. 화면 개요

### 목적
사용자의 레슨 스타일 선호도를 수집하여 AI 기반 프로 매칭에 활용한다.

### 사용자 흐름
```
/ (Landing - Golfers) → /onboarding/mood → AI 분석 → 프로 추천 목록
```

### 접근 조건
- **인증 필요**: No
- **권한 수준**: guest

---

## 2. 레이아웃 구조

### 무드 위저드 Flow

```
Step 1: 레슨 목표 선택
[스코어 향상] [스윙 교정] [기초 배우기] [즐기기]

Step 2: 선호하는 스타일
[체계적/구조화] [자유롭고 유연함]

Step 3: 커뮤니케이션 스타일
[분석적/데이터 중심] [감각적/직관적]

Step 4: 위치 선택
[지역 선택 드롭다운]

→ AI 분석 중... → 맞춤 프로 추천 목록
```

---

## 3. 주요 컴포넌트

- `MoodWizard` - 단계별 위저드 컨테이너
- `MoodOptionCard` - 선택 가능한 무드 카드
- `ProgressBar` - 진행 상태 표시
- `AIMatchingAnimation` - 로딩 애니메이션

---

## 4. 관련 화면

- **이전 화면**: [Landing - Golfers](./home.md)
- **다음 화면**: 프로 추천 목록
