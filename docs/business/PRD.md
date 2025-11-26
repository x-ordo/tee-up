
# PRD: TEE:UP (티업) - 프리미엄 골프 레슨 매칭 플랫폼

**Version:** 1.0
**Status:** Draft
**Target:** MVP (Minimum Viable Product)
**Author:** [Your Name] (CTO) & [Partner Name] (Gangnam Pro - Content/Biz)

-----

## 1\. 프로젝트 개요 (Overview)

### 1.1. 제품 비전

**"골프 레슨의 시작, TEE:UP"**
검증된 프로들의 '프로필'을 매거진처럼 세련되게 보여주고, 채팅을 통해 레슨 문의를 연결하는 프리미엄 중개 플랫폼. 결제는 현장에서 자유롭게 이루어지되, **문의량(Lead) 기반의 구독료**로 수익을 창출한다.

### 1.2. 핵심 가치 (Value Proposition)

  * **For Pro (Supply):** 자신의 가치를 증명하는 '퍼스널 브랜딩' 페이지 제공. 문의 관리를 통한 잠재 고객 확보.
  * **For Golfer (Demand):** 강남 일대 검증된 프로들의 스타일, 경력, 리뷰를 한눈에 비교하고 부담 없이 1:1 채팅으로 문의.

### 1.3. 비즈니스 모델 (Hybrid Subscription)

  * **프로필 등록:** 무료 (진입장벽 제거).
  * **레슨 결제:** 현장 결제/계좌 이체 등 자유 (플랫폼 내 결제 강제 X).
  * **수익 모델 (BM):** **'성과 기반 구독 모델'**
      * 채팅 문의 수(Lead)와 매칭 성사율을 트래킹.
      * 월 무료 문의 건수(예: 3건) 초과 시, 'Pro' 멤버십 구독 필요 (월 고정비 청구).

-----

## 2\. 사용자 페르소나 (User Persona)

### A. User (골퍼) - "강남 영앤리치 & VIP"

  * **특징:** 가격보다는 프로의 '스타일', '외모/호감도', '티칭 철학'이 중요.
  * **Pain Point:** 인스타 DM은 답장이 느리고 신뢰하기 어렵다. 숨고 등은 너무 가볍고 저가 느낌이 난다.
  * **Needs:** 룩북(Lookbook)을 보듯 프로를 고르고, 프라이빗하게 대화하고 싶다.

### B. Pro (코치) - "퍼스널 브랜딩이 필요한 전문가"

  * **특징:** 레슨 실력은 좋으나 마케팅과 고객 관리가 귀찮음.
  * **Pain Point:** 여기저기 홍보하느라 피곤함. 진성 고객(레슨비 지불 의사가 확실한)만 받고 싶음.
  * **Needs:** 내 프로필이 '간지나게' 보였으면 좋겠음. 일정 관리와 문의가 한곳에서 되길 원함.

-----

## 3\. 핵심 기능 명세 (Functional Requirements)

### 3.1. 프로필 (The "Showcase") - *Core Feature*

  * **목표:** '캐치테이블' 식당 상세페이지처럼, 프로의 매력을 극대화.
  * **기능 상세:**
      * **Visual Header:** 세로형 숏폼 영상 또는 고화질 스윙 프로필 사진 자동 재생.
      * **Info Card:** 이름, 투어 경력(KPGA/KLPGA), 주요 레슨 지역(강남, 청담 등).
      * **Tag System:** `#비거리교정`, `#필드레슨`, `#속성3개월`, `#유소년` 등 키워드 태그.
      * **Curriculum:** 텍스트 나열이 아닌, '타임라인' 형태의 커리큘럼 시각화.
      * **Review (Premium):** 인증된 회원만 남길 수 있는 클린 리뷰 (별점 + 포토).

### 3.2. 1:1 채팅 (The "Gatekeeper")

  * **목표:** 전화번호 노출 없이 앱 내에서 상담을 종결시키고, '매칭' 여부를 판단.
  * **기능 상세:**
      * **문의하기 버튼:** 프로필 하단 고정 (Sticky Footer).
      * **채팅방 생성:** 유저가 첫 메시지를 보낼 때 `Lead` 카운트 +1.
      * **안심번호/필터링:** 전화번호/카톡ID 직접 노출 시 경고 메시지 (초기에는 느슨하게, 추후 강화).
      * **매칭 확정 버튼:** 채팅방 내 상단에 [레슨 확정하기] 버튼 존재. 프로가 누르고 유저가 수락하면 `Matched` 카운트 +1.

### 3.3. 프로 전용 대시보드 (The "Manager")

  * **목표:** 구독 결제를 유도하기 위한 성과 지표 시각화.
  * **기능 상세:**
      * **내 프로필 조회수:** "이번 주 300명이 프로님을 봤어요\!"
      * **채팅 문의 수:** "이번 달 신규 문의 5건" (3건 초과 시 구독 유도 팝업).
      * **매칭 확정 수:** 실제 레슨으로 이어진 건수 관리.

-----

## 4\. 디자인 & UX 가이드 (Design Guidelines)

  * **Keywords:** Sophisticated, Minimal, High-End.
  * **Color Palette:**
      * Primary: `Deep Green` (\#1A4D2E) - 골프장 잔디의 깊은 색감.
      * Accent: `Matte Gold` (\#D4AF37) - 프리미엄 포인트.
      * Background: `Off-White` (\#F9F9F9) - 눈이 편안한 종이 질감.
  * **Typography:** 제목은 세리프(Serif) 폰트로 우아하게, 본문은 산세리프(Sans-Serif)로 가독성 있게.
  * **Interaction:**
      * 프로필 스크롤 시 이미지가 부드럽게 확대/축소되는 패럴랙스(Parallax) 효과.
      * '문의하기' 버튼 클릭 시 햅틱 피드백.

-----

## 5\. 기술 스택 및 아키텍처 (Tech Stack)

개발 효율성과 '강남 프로(동업자)'와의 빠른 피드백을 위해 생산성 높은 스택 선정.

  * **Frontend (App/Web):** `Flutter` (크로스 플랫폼) 또는 `Next.js` (모바일 웹 우선, SEO 유리).
      * *추천:* 초기 마케팅(검색 노출)이 중요하다면 **Next.js (PWA)** 로 시작.
  * **Backend (BaaS):** `Supabase` (PostgreSQL 기반, 채팅 기능 구현 용이, 인증 포함).
  * **Image/Video:** `Cloudinary` 또는 `AWS S3` (고화질 이미지 최적화 필수).
  * **Payment:** `Toss Payments` (프로들의 월 구독료 결제용).

-----

## 6\. 데이터 스키마 (Database Schema - Draft)

Claude Code에게 전달할 핵심 데이터 구조입니다.

```sql
-- Users (골퍼 및 프로 통합 관리)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  role VARCHAR CHECK (role IN ('golfer', 'pro')),
  name VARCHAR,
  phone VARCHAR,
  created_at TIMESTAMP
);

-- Pros (프로 상세 정보)
CREATE TABLE pro_profiles (
  user_id UUID REFERENCES users(id),
  bio TEXT, -- 자기소개
  career JSONB, -- 경력사항 배열
  tags TEXT[], -- 태그 배열
  main_image_url VARCHAR,
  gallery_images TEXT[],
  location VARCHAR, -- 주요 활동 지역
  subscription_tier VARCHAR DEFAULT 'basic', -- basic, premium
  monthly_chat_count INT DEFAULT 0 -- 이번 달 문의 수 (과금 기준)
);

-- Chat Rooms (문의 내역)
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY,
  pro_id UUID REFERENCES users(id),
  golfer_id UUID REFERENCES users(id),
  status VARCHAR DEFAULT 'active', -- active, matched, closed
  created_at TIMESTAMP
);

-- Messages (채팅 메시지)
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id),
  sender_id UUID REFERENCES users(id),
  content TEXT,
  read_at TIMESTAMP,
  created_at TIMESTAMP
);
```

-----

## 7\. 개발 로드맵 (Phases)

### Phase 1: MVP (4주) - "Showcase"

  * **목표:** 강남 프로 10명의 고퀄리티 프로필 업로드 및 웹 런칭.
  * **기능:** 프로필 페이지(Read Only), 카카오톡 오픈채팅 링크 연결(임시), 관리자 페이지.
  * **비고:** 이 단계에서는 채팅 개발 대신 '카카오톡 연결 버튼' 클릭 수로 수요 검증.

### Phase 2: Beta (8주) - "Lock-in"

  * **목표:** 자체 채팅 도입 및 구독 모델 적용.
  * **기능:** 인앱 채팅(Supabase Realtime), 회원가입/로그인, 프로 대시보드, 결제 모듈 연동.
  * **BM:** 월 문의 3건까지 무료, 이후 유료 전환 테스트.

-----

## 8\. Claude Code 프롬프트 가이드

이 PRD를 바탕으로 AI에게 코딩을 시킬 때 사용할 첫 번째 명령어입니다.

```markdown
너는 시니어 풀스택 개발자야. 
우리는 'TEE:UP'이라는 프리미엄 골프 레슨 매칭 플랫폼을 만들 거야.
Tech Stack은 Next.js 14 (App router), Tailwind CSS, Supabase(DB/Auth)를 사용할 거야.

핵심 비즈니스 로직:
1. 프로는 프로필을 무료로 생성한다.
2. 골퍼는 프로필을 보고 '1:1 문의하기' 채팅을 건다.
3. 채팅방이 생성되는 순간을 'Lead'로 정의하고 카운팅한다.
4. 프로는 월간 Lead 수에 따라 구독료를 지불해야 한다.

우선, 상기 PRD의 [6. 데이터 스키마]를 참고하여 Supabase용 Table 생성 SQL을 작성하고, 
Next.js 프로젝트의 기본 폴더 구조를 잡아줘. 
디자인은 'Catchtable' 처럼 이미지 중심의 모던하고 고급스러운 UI여야 해.
```
