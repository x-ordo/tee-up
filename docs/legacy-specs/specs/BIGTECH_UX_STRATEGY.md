# TEE:UP 빅테크 UX 전략 이식 기획서
## Google · Toss · Kakao UX 원칙의 골프 매칭 플랫폼 적용

> **문서 목적:** 글로벌 빅테크의 검증된 UX 전략을 TEE:UP의 체류시간 증대 및 리드 전환율 최적화에 이식
> **작성일:** 2025-12-01
> **버전:** 1.0

---

## Executive Summary

TEE:UP은 프리미엄 골프 레슨 매칭 플랫폼으로, 핵심 수익 모델은 **프로 구독료(₩49,000/월)**입니다.
구독 전환의 전제 조건은 **골퍼의 문의(Lead) 발생**이며, 이는 곧 **체류시간**과 **탐색 깊이**에 비례합니다.

본 기획서는 Google, Toss, Kakao의 UX 전략을 분석하여 다음 목표를 달성합니다:

| 목표 | 측정 지표 | 현재 추정 | 목표 |
|------|----------|----------|------|
| 체류시간 증대 | 평균 세션 시간 | 2분 | 5분+ |
| 탐색 깊이 확대 | 세션당 페이지 뷰 | 2.5 PV | 5+ PV |
| 리드 전환율 향상 | 프로필 → 문의 | 15% | 30%+ |
| 공유 바이럴 | 월간 공유 수 | - | 500+ |

---

## 1. 전략의 재해석 (Re-interpretation)

### 1.1 Google: Discovery & Frictionless Navigation

#### 원본 전략 (앱 기반)
Google의 Discover 피드는 **사용자 관심사 기반 무한 콘텐츠 스트림**으로, 탐색 비용을 제로에 가깝게 만들어 체류시간을 극대화합니다.

#### TEE:UP 이식 전략

**A. 관련 프로 추천 섹션 ("이런 프로는 어떠세요?")**

```typescript
// 프로 프로필 페이지 하단 컴포넌트
<section className="mt-16 border-t border-calm-stone pt-12">
  <h2 className="text-2xl font-semibold text-calm-obsidian mb-8">
    이런 프로는 어떠세요?
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {relatedPros.map(pro => <ProCard key={pro.id} {...pro} />)}
  </div>
</section>
```

**추천 로직 (서버 없이 구현 가능):**
1. **동일 지역** 프로 (location 필터링)
2. **동일 전문분야** 프로 (specialty 매칭)
3. **유사 가격대** 프로 (price range ±20%)
4. **랜덤 셔플** (동일 조건 내)

**B. 무한 스크롤 / Load More (프로 디렉토리)**

```typescript
// 프로 디렉토리 페이지
const [visibleCount, setVisibleCount] = useState(12);

return (
  <>
    <ProGrid pros={pros.slice(0, visibleCount)} />

    {visibleCount < pros.length && (
      <button
        onClick={() => setVisibleCount(prev => prev + 12)}
        className="btn-secondary mx-auto mt-8 flex items-center gap-2"
      >
        더 많은 프로 보기
        <span className="text-calm-ash">
          ({pros.length - visibleCount}명 남음)
        </span>
      </button>
    )}
  </>
);
```

**C. 스크롤 깊이 프로그레스 바**

```typescript
// 프로 프로필 페이지 상단 고정
<div className="fixed top-0 left-0 w-full h-1 bg-calm-cloud z-50">
  <div
    className="h-full bg-calm-accent transition-all duration-150"
    style={{ width: `${scrollProgress}%` }}
  />
</div>
```

> **[Google Material Design 원칙 적용]** Progress indicators는 사용자에게 현재 위치와 남은 콘텐츠량을 직관적으로 전달하여 이탈을 방지합니다.

---

### 1.2 Toss: Simplicity & Gamification

#### 원본 전략 (앱 기반)
Toss는 **만보기 혜택**, **복권 긁기**, **폭죽 효과** 등 즉각적인 도파민 보상 시스템으로 일일 활성 사용자(DAU)를 극대화합니다.

#### TEE:UP 이식 전략

**A. 골프 실력 진단 퀴즈 (마이크로 인터랙션)**

```typescript
// /quiz/golf-level 페이지
const questions = [
  {
    id: 1,
    question: "평균 드라이버 비거리는?",
    options: ["150m 이하", "150-200m", "200-250m", "250m 이상"],
    scores: [1, 2, 3, 4]
  },
  {
    id: 2,
    question: "주로 어떤 부분을 개선하고 싶으신가요?",
    options: ["드라이버", "아이언", "퍼팅", "숏게임"],
    tags: ["power", "accuracy", "putting", "short-game"]
  },
  // ... 5개 질문
];

// 결과에 따른 프로 추천
const getRecommendedPros = (answers) => {
  const tags = extractTags(answers);
  return pros.filter(pro =>
    pro.specialties.some(s => tags.includes(s))
  );
};
```

**UI 플로우:**
```
┌─────────────────────────────────────────┐
│  🏌️ 나에게 맞는 프로 찾기              │
│  ─────────────────────────────────────  │
│  Q1. 평균 드라이버 비거리는?            │
│                                         │
│  ┌─────────────┐  ┌─────────────┐       │
│  │  150m 이하  │  │  150-200m   │       │
│  └─────────────┘  └─────────────┘       │
│  ┌─────────────┐  ┌─────────────┐       │
│  │  200-250m   │  │  250m 이상  │       │
│  └─────────────┘  └─────────────┘       │
│                                         │
│  ■ □ □ □ □  (1/5)                       │
└─────────────────────────────────────────┘
```

**B. 레슨 비용 계산기 (인터랙티브 도구)**

```typescript
// /tools/lesson-calculator 페이지
const [frequency, setFrequency] = useState(4); // 월 4회
const [lessonType, setLessonType] = useState('basic'); // basic, premium, field

const prices = {
  basic: 150000,
  premium: 200000,
  field: 300000
};

const monthlyCost = frequency * prices[lessonType];
const yearlyCost = monthlyCost * 12;
const savingsWithPackage = yearlyCost * 0.15; // 15% 패키지 할인 가정

return (
  <div className="card p-8">
    <h2 className="text-xl font-semibold mb-6">레슨 비용 계산기</h2>

    {/* 슬라이더 + 실시간 계산 */}
    <div className="space-y-6">
      <div>
        <label className="label">월 레슨 횟수</label>
        <input
          type="range"
          min={1}
          max={12}
          value={frequency}
          onChange={(e) => setFrequency(Number(e.target.value))}
          className="w-full accent-calm-accent"
        />
        <span className="text-2xl font-mono font-bold text-calm-accent">
          {frequency}회/월
        </span>
      </div>

      {/* 결과 카드 */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="metric-card">
          <p className="metric-label">월 예상 비용</p>
          <p className="metric-number">₩{monthlyCost.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">연간 예상 비용</p>
          <p className="metric-number">₩{yearlyCost.toLocaleString()}</p>
        </div>
        <div className="metric-card border-calm-success">
          <p className="metric-label">패키지 시 절약</p>
          <p className="metric-number text-calm-success">
            ₩{savingsWithPackage.toLocaleString()}
          </p>
        </div>
      </div>
    </div>

    {/* CTA */}
    <button className="btn-primary w-full mt-8">
      내 예산에 맞는 프로 찾기
    </button>
  </div>
);
```

**C. Confetti 효과 (성공 피드백)**

```typescript
// 예약 완료, 문의 발송 성공 시
import confetti from 'canvas-confetti';

const handleBookingSuccess = () => {
  // Toss 스타일 축하 효과
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#3B82F6', '#DBEAFE', '#1E40AF'] // calm-accent 계열
  });

  setShowSuccessModal(true);
};
```

> **[Toss Design System 원칙 적용]** 즉각적인 시각적 피드백(폭죽, 체크마크 애니메이션)은 사용자에게 "성공"의 감정을 각인시켜 재방문율을 높입니다.

**D. 프로그레스 기반 문의 폼 (Frictionless)**

```typescript
// 3단계 간소화 폼 (Toss의 단순함 원칙)
const steps = [
  { id: 1, label: '레슨 선택', fields: ['serviceType'] },
  { id: 2, label: '일정 선택', fields: ['preferredDate', 'preferredTime'] },
  { id: 3, label: '연락처', fields: ['name', 'phone'] }
];

// 각 단계는 1-2개 필드만
// 키보드 엔터로 다음 단계 진행
// 실시간 유효성 검사
```

---

### 1.3 Kakao: Social Context & Shareability

#### 원본 전략 (앱 기반)
카카오는 **친구 탭**, **선물하기**, **공유하기** 등 소셜 컨텍스트를 모든 기능에 녹여 바이럴 루프를 형성합니다.

#### TEE:UP 이식 전략

**A. 플로팅 공유 버튼 (Sticky Share)**

```typescript
// 프로 프로필 페이지 - 우측 하단 고정
<div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
  {/* 카카오톡 공유 (Primary) */}
  <button
    onClick={shareToKakao}
    className="w-14 h-14 rounded-full bg-[#FEE500] shadow-lg
               hover:scale-110 transition-transform duration-200
               flex items-center justify-center"
  >
    <KakaoIcon className="w-8 h-8" />
  </button>

  {/* 링크 복사 */}
  <button
    onClick={copyLink}
    className="w-14 h-14 rounded-full bg-calm-accent shadow-lg
               hover:scale-110 transition-transform duration-200
               flex items-center justify-center text-white"
  >
    <LinkIcon className="w-6 h-6" />
  </button>

  {/* 더보기 (SMS, 인스타 등) */}
  <button
    onClick={() => setShowShareMenu(true)}
    className="w-14 h-14 rounded-full bg-white border border-calm-stone
               shadow-lg hover:scale-110 transition-transform duration-200
               flex items-center justify-center"
  >
    <MoreIcon className="w-6 h-6 text-calm-charcoal" />
  </button>
</div>
```

**B. 공유 최적화 UX 라이팅**

```typescript
// 카카오톡 공유 메시지 템플릿
const kakaoShareTemplate = {
  objectType: 'feed',
  content: {
    title: `${proName} 프로 | TEE:UP`,
    description: `${proTitle} · ${location} · ${priceRange}`,
    imageUrl: proImageUrl,
    link: {
      mobileWebUrl: `https://teeup.kr/profile/${proSlug}`,
      webUrl: `https://teeup.kr/profile/${proSlug}`
    }
  },
  social: {
    likeCount: viewCount,
    commentCount: reviewCount
  },
  buttons: [
    {
      title: '프로필 보기',
      link: {
        mobileWebUrl: `https://teeup.kr/profile/${proSlug}`,
        webUrl: `https://teeup.kr/profile/${proSlug}`
      }
    }
  ]
};
```

**C. 공유 유도 넛지 (Share Nudge)**

```typescript
// 프로 프로필 열람 30초 후 표시
{showShareNudge && (
  <div className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-xl
                  p-4 max-w-xs animate-slideUp border border-calm-stone">
    <button
      onClick={() => setShowShareNudge(false)}
      className="absolute top-2 right-2 text-calm-ash hover:text-calm-charcoal"
    >
      ×
    </button>
    <p className="text-sm text-calm-charcoal">
      <span className="font-semibold">{proName}</span> 프로가 마음에 드셨나요?
      <br />
      골프 동호회에 공유해보세요!
    </p>
    <button
      onClick={shareToKakao}
      className="btn-primary w-full mt-3 text-sm py-2"
    >
      카카오톡으로 공유
    </button>
  </div>
)}
```

**D. 추천인 코드 시스템 (향후 확장)**

```typescript
// URL 파라미터 기반 추적
// https://teeup.kr/profile/kim-pro?ref=user123

const trackReferral = (referrerCode: string) => {
  // Analytics 기록
  gtag('event', 'referral_visit', {
    referrer: referrerCode,
    pro_slug: proSlug
  });
};
```

> **[Kakao UX 원칙 적용]** 소셜 공유는 단순 버튼이 아닌 "친구에게 추천"이라는 감정적 맥락을 담아야 전환율이 높습니다.

---

## 2. UI/UX 상세 설계 (Detailed Layout)

### 2.1 Above the Fold (상단 영역)

**원칙:** 3초 안에 사용자가 "여기서 무엇을 할 수 있는지" 이해해야 함

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]                    [검색]              [로그인] [문의하기] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │     🏌️ 검증된 프로에게 배우는                           │   │
│  │        프리미엄 골프 레슨                                │   │
│  │                                                         │   │
│  │     ┌──────────────────────────────────────────────┐   │   │
│  │     │ 🔍 지역, 전문분야, 프로 이름으로 검색         │   │   │
│  │     └──────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │     [프로 둘러보기]  [실력 진단 퀴즈]                    │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  "150+ 검증된 KPGA/LPGA 프로 | 평균 응답 4시간 | 98% 만족도"   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                          ↓ 스크롤 유도 화살표
```

**핵심 요소:**
1. **후킹 헤드라인:** 감정적 이익 (검증된, 프리미엄)
2. **즉시 행동 가능한 검색:** 탐색 비용 최소화
3. **듀얼 CTA:** 탐색 vs 진단 (두 가지 진입점)
4. **신뢰 지표:** 구체적 숫자로 신뢰 구축

### 2.2 Frictionless Reading (본문 가독성)

**TDS(Toss Design System) 원칙 적용:**

```css
/* 텍스트 컨테이너 */
.prose-teeup {
  max-width: 680px;           /* 최적 가독성 너비 */
  margin: 0 auto;
  padding: 0 24px;
}

/* 문단 간격 */
.prose-teeup p {
  margin-bottom: 1.5rem;      /* 24px - 충분한 호흡 */
  line-height: 1.75;          /* 넉넉한 행간 */
  color: var(--calm-charcoal);
}

/* 섹션 간격 */
.prose-teeup section {
  margin-bottom: 4rem;        /* 64px - 명확한 구분 */
}

/* 리스트 아이템 */
.prose-teeup li {
  margin-bottom: 0.75rem;     /* 12px */
  padding-left: 1.5rem;
  position: relative;
}

.prose-teeup li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--calm-accent);
}
```

**프로 프로필 본문 구조:**

```
┌─────────────────────────────────────────┐
│ 📸 히어로 이미지 (16:9, 풀 너비)         │
├─────────────────────────────────────────┤
│                                         │
│  김프로 | KPGA 정회원 ✓                  │
│  ─────────────────────────────           │
│  강남 · 드라이버 전문 · 10년 경력         │
│                                         │
│  [문의하기]  [카카오톡]  [공유]           │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ## 소개                                 │  ← 섹션 구분선 없음, 여백으로 구분
│                                         │
│  안녕하세요, 김프로입니다. 10년간 500명   │
│  이상의 골퍼를 지도하며...                │
│                                         │
│  [여백 64px]                             │
│                                         │
│  ## 전문 분야                            │
│                                         │
│  • 드라이버 비거리 향상                   │
│  • 슬라이스 교정                         │
│  • 체형별 맞춤 스윙                      │
│                                         │
│  [여백 64px]                             │
│                                         │
│  ## 레슨 안내                            │
│                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ 체험레슨  │ │ 정규레슨  │ │ 필드레슨  │ │
│  │ ₩80,000  │ │ ₩150,000 │ │ ₩300,000 │ │
│  └──────────┘ └──────────┘ └──────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### 2.3 Navigation Loop (순환 유도)

**Internal Linking 전략:**

```typescript
// 프로 프로필 하단 - 3단계 넛지
<section className="space-y-12">
  {/* 1단계: 관련 프로 (같은 지역/전문분야) */}
  <div>
    <h3 className="text-xl font-semibold mb-6">
      {location}의 다른 프로
    </h3>
    <ProCardGrid pros={sameLocationPros} limit={3} />
  </div>

  {/* 2단계: 다른 전문분야 프로 */}
  <div>
    <h3 className="text-xl font-semibold mb-6">
      다른 전문분야도 둘러보세요
    </h3>
    <SpecialtyTags specialties={otherSpecialties} />
  </div>

  {/* 3단계: 도구/콘텐츠로 유도 */}
  <div className="bg-calm-cloud rounded-2xl p-8 text-center">
    <h3 className="text-xl font-semibold mb-4">
      어떤 프로가 나에게 맞을까요?
    </h3>
    <p className="text-calm-charcoal mb-6">
      간단한 테스트로 맞춤 프로를 추천받으세요
    </p>
    <Link href="/quiz/golf-level" className="btn-primary">
      실력 진단 시작하기 (2분)
    </Link>
  </div>
</section>
```

**"다음 프로" 넛지 (스크롤 완료 시):**

```typescript
// 프로 프로필 끝까지 스크롤 시 표시
{scrolledToBottom && (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t
                  border-calm-stone p-4 shadow-lg animate-slideUp">
    <div className="max-w-4xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={nextPro.image}
          alt={nextPro.name}
          width={48} height={48}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold">{nextPro.name} 프로</p>
          <p className="text-sm text-calm-ash">{nextPro.specialty}</p>
        </div>
      </div>
      <Link
        href={`/profile/${nextPro.slug}`}
        className="btn-secondary text-sm"
      >
        다음 프로 보기 →
      </Link>
    </div>
  </div>
)}
```

---

## 3. 기능 명세 (Feature Specs)

### 3.1 스크롤 깊이 프로그레스 바

**목적:** 사용자에게 현재 위치와 남은 콘텐츠량 시각화 → 이탈 방지

```typescript
// hooks/useScrollProgress.ts
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

// 사용
const progress = useScrollProgress();
<ProgressBar progress={progress} />
```

**UI 스펙:**
- 위치: 페이지 최상단 고정 (top: 0)
- 높이: 3px
- 배경: `--calm-cloud`
- 채움: `--calm-accent`
- 애니메이션: `transition: width 150ms ease-out`

### 3.2 골프 실력 진단 퀴즈

**목적:** 게이미피케이션을 통한 체류시간 증대 + 맞춤 프로 추천

**퀴즈 구조:**
```typescript
interface QuizQuestion {
  id: number;
  question: string;
  type: 'single' | 'multiple' | 'scale';
  options: {
    label: string;
    value: string;
    tags?: string[];  // 프로 매칭용
  }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "골프를 시작한 지 얼마나 되셨나요?",
    type: 'single',
    options: [
      { label: "1년 미만", value: "beginner", tags: ["beginner-friendly"] },
      { label: "1-3년", value: "intermediate", tags: ["skill-improvement"] },
      { label: "3년 이상", value: "advanced", tags: ["advanced-technique"] }
    ]
  },
  {
    id: 2,
    question: "가장 개선하고 싶은 부분은?",
    type: 'multiple',
    options: [
      { label: "드라이버 비거리", value: "driver", tags: ["driver", "power"] },
      { label: "아이언 정확도", value: "iron", tags: ["iron", "accuracy"] },
      { label: "숏게임", value: "short", tags: ["short-game", "wedge"] },
      { label: "퍼팅", value: "putting", tags: ["putting", "green-reading"] }
    ]
  },
  // ... 3개 더
];
```

**결과 화면:**
```
┌─────────────────────────────────────────┐
│                                         │
│  🎉 진단 완료!                           │
│                                         │
│  당신은 "성장형 중급 골퍼"입니다         │
│                                         │
│  추천 레슨 포인트:                       │
│  • 드라이버 스윙 궤도 교정               │
│  • 아이언 컨택 일관성 향상               │
│                                         │
│  ────────────────────────────────       │
│                                         │
│  맞춤 추천 프로 3명                      │
│                                         │
│  ┌─────┐  ┌─────┐  ┌─────┐             │
│  │ Pro │  │ Pro │  │ Pro │             │
│  │  1  │  │  2  │  │  3  │             │
│  └─────┘  └─────┘  └─────┘             │
│                                         │
│  [결과 공유하기]  [모든 프로 보기]        │
│                                         │
└─────────────────────────────────────────┘
```

### 3.3 레슨 비용 계산기

**목적:** 인터랙티브 도구로 체류시간 증대 + 가격 투명성 제공

**입력 필드:**
1. 월 레슨 횟수 (슬라이더: 1-12회)
2. 레슨 타입 (라디오: 체험/정규/필드)
3. 희망 지역 (선택: 서울/경기/기타)

**출력:**
- 월 예상 비용
- 연간 예상 비용
- 패키지 할인 시 절약액
- 추천 프로 리스트 (예산 범위 내)

### 3.4 실시간 인기 프로 표시

**목적:** 사회적 증거(Social Proof)로 탐색 유도

```typescript
// 프로 카드에 실시간 배지 표시
<div className="absolute top-4 left-4">
  {pro.isPopular && (
    <span className="tag bg-calm-accent text-white">
      🔥 지금 인기
    </span>
  )}
  {pro.recentViews > 50 && (
    <span className="tag bg-calm-warning-bg text-calm-warning">
      👀 {pro.recentViews}명이 보는 중
    </span>
  )}
</div>
```

### 3.5 "나중에 보기" 저장 기능

**목적:** 이탈 시에도 재방문 유도

```typescript
// localStorage 기반 (로그인 불필요)
const [savedPros, setSavedPros] = useLocalStorage('savedPros', []);

const toggleSave = (proId: string) => {
  setSavedPros(prev =>
    prev.includes(proId)
      ? prev.filter(id => id !== proId)
      : [...prev, proId]
  );
};

// 저장된 프로 페이지
// /saved → 로컬스토리지 기반 목록 표시
```

---

## 4. 성과 측정 지표 (KPIs)

### 4.1 핵심 지표 (Primary Metrics)

| 지표 | 정의 | 현재 추정 | 목표 | 측정 방법 |
|------|------|----------|------|----------|
| **평균 세션 시간** | 방문당 체류 시간 | 2분 | 5분+ | GA4 |
| **세션당 페이지 뷰** | 방문당 페이지 조회 수 | 2.5 PV | 5+ PV | GA4 |
| **이탈률** | 단일 페이지 방문 후 이탈 | 60% | 40% 이하 | GA4 |
| **프로필 → 문의 전환율** | 프로필 조회 → 문의 발송 | 15% | 30%+ | 커스텀 이벤트 |

### 4.2 보조 지표 (Secondary Metrics)

| 지표 | 정의 | 목표 | 측정 방법 |
|------|------|------|----------|
| 스크롤 깊이 | 프로 프로필 75% 이상 스크롤 | 60% | GA4 스크롤 이벤트 |
| 퀴즈 완료율 | 퀴즈 시작 → 완료 | 70%+ | 퍼널 분석 |
| 계산기 사용률 | 계산기 페이지 방문 | 월 1,000회+ | 페이지 뷰 |
| 공유 수 | 카카오톡/링크 공유 횟수 | 월 500회+ | 공유 버튼 클릭 |
| 재방문율 | 7일 내 재방문 비율 | 30%+ | GA4 리텐션 |

### 4.3 실험 지표 (Experiment Metrics)

```typescript
// A/B 테스트용 이벤트 추적
const trackExperiment = (experimentName: string, variant: string, action: string) => {
  gtag('event', 'experiment', {
    experiment_name: experimentName,
    variant: variant,
    action: action
  });
};

// 예: 공유 버튼 위치 테스트
// A: 플로팅 버튼 vs B: 프로필 헤더 내장
trackExperiment('share_button_position', 'floating', 'click');
```

### 4.4 대시보드 설계

```
┌─────────────────────────────────────────────────────────────────┐
│  TEE:UP 체류시간 대시보드                         [기간: 최근 7일] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │ 평균 세션    │  │ 세션당 PV   │  │ 이탈률      │  │ 전환율   │ │
│  │   4:32      │  │   4.2       │  │   42%       │  │  28%    │ │
│  │   ↑ 15%    │  │   ↑ 8%     │  │   ↓ 12%    │  │  ↑ 5%  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
│                                                                 │
│  [체류시간 트렌드 그래프]                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                 │
│  [인기 페이지]              [퀴즈 퍼널]           [공유 채널]    │
│  1. 홈페이지 (35%)          시작: 500           카카오: 320    │
│  2. 프로 디렉토리 (28%)     Q1: 450 (90%)       링크: 150      │
│  3. 김프로 프로필 (12%)     Q2: 380 (84%)       기타: 30       │
│  4. 퀴즈 (8%)              완료: 350 (92%)                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. 구현 로드맵

### Phase 1: 기반 구축 (1주)

- [ ] 스크롤 프로그레스 바 컴포넌트
- [ ] useScrollProgress 훅
- [ ] 플로팅 공유 버튼 컴포넌트
- [ ] 카카오톡 공유 템플릿 설정
- [ ] GA4 이벤트 추적 설정

### Phase 2: 인터랙티브 도구 (2주)

- [ ] 골프 실력 진단 퀴즈 페이지
- [ ] 퀴즈 결과 → 프로 매칭 로직
- [ ] 레슨 비용 계산기 페이지
- [ ] 계산기 → 프로 추천 연동

### Phase 3: Navigation Loop (1주)

- [ ] 관련 프로 추천 섹션
- [ ] "다음 프로 보기" 넛지
- [ ] 프로 디렉토리 무한 스크롤/Load More
- [ ] 나중에 보기 기능 (localStorage)

### Phase 4: 최적화 & 테스트 (1주)

- [ ] A/B 테스트 설정 (공유 버튼 위치, CTA 문구)
- [ ] 성능 최적화 (LCP < 2.5s)
- [ ] 모바일 UX 검증
- [ ] KPI 대시보드 구축

---

## 6. 기술 스택 & 의존성

### 신규 라이브러리

```json
{
  "dependencies": {
    "canvas-confetti": "^1.9.2",      // Confetti 효과
    "framer-motion": "^10.16.0",      // 애니메이션
    "@vercel/analytics": "^1.1.1"     // 분석 (GA4 보완)
  }
}
```

### 카카오 SDK 설정

```typescript
// lib/kakao/share.ts
export const initKakaoSDK = () => {
  if (typeof window !== 'undefined' && !window.Kakao?.isInitialized()) {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
  }
};

export const shareToKakao = (template: KakaoShareTemplate) => {
  if (window.Kakao) {
    window.Kakao.Share.sendDefault(template);
  }
};
```

---

## 7. 리스크 & 완화 전략

| 리스크 | 영향 | 완화 전략 |
|--------|------|----------|
| 퀴즈 이탈률 높음 | 체류시간 목표 미달 | 질문 수 5개로 제한, 프로그레스 바 표시 |
| 공유 기능 저조 | 바이럴 목표 미달 | 공유 후 "포인트" 인센티브 (Phase 2) |
| 모바일 성능 저하 | 이탈률 증가 | Confetti 모바일 비활성화, 이미지 최적화 |
| 무한 스크롤 피로감 | 부정적 UX | "Load More" 버튼으로 대체, 명확한 끝 표시 |

---

## 8. 성공 기준 요약

본 기획의 성공은 다음 기준으로 평가합니다:

1. **체류시간 2.5배 증가:** 2분 → 5분
2. **PV 2배 증가:** 2.5 → 5 PV/세션
3. **전환율 2배 증가:** 15% → 30%
4. **월간 공유 500회 달성**

이 목표 달성 시, 예상되는 비즈니스 임팩트:
- 리드 수 2배 증가 → 프로 구독 전환 증가
- 월 MRR ₩5M → ₩10M 달성 가속화

---

*문서 버전: 1.0*
*최종 수정: 2025-12-01*
*작성: Claude Code (CPO 역할 수행)*
