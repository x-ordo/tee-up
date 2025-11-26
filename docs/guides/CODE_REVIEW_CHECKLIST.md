# Code Review Checklist

> **목적:** 코드 리뷰 시 일관된 품질 기준 적용  
> **사용법:** PR 생성 시 이 체크리스트를 참고하여 자가 검토 후 리뷰 요청

---

## 📋 General

### 코드 품질
- [ ] 코드가 프로젝트 컨벤션을 따르는가?
- [ ] `console.log()` 등 디버깅 코드가 제거되었는가?
- [ ] 주석 처리된 코드가 제거되었는가?
- [ ] 변수/함수 이름이 의미있고 명확한가?
- [ ] 매직 넘버 대신 상수를 사용했는가?

### 문서화
- [ ] 복잡한 로직에 주석이 추가되었는가?
- [ ] Public API에 JSDoc이 작성되었는가?
- [ ] README 또는 관련 문서가 업데이트되었는가?

---

## 🎯 TypeScript

### 타입 안정성
- [ ] `any` 타입을 사용하지 않았는가? (불가피한 경우 `unknown` 사용)
- [ ] 모든 함수에 반환 타입이 명시되어 있는가?
- [ ] Interface 또는 Type이 적절히 정의되었는가?
- [ ] TypeScript strict mode를 준수하는가?
- [ ] `@ts-ignore` 또는 `@ts-expect-error`를 남용하지 않았는가?

### 타입 정의
```typescript
// ✅ Good
function fetchProfile(id: string): Promise<IProProfile> {
  // ...
}

// ❌ Bad
function fetchProfile(id: any): any {
  // ...
}
```

---

## ⚛️ React / Next.js

### Component 설계
- [ ] Server Component를 기본으로 사용했는가?
- [ ] Client Component는 필요한 경우에만 사용했는가?
- [ ] Props drilling이 과도하지 않은가? (Context 사용 고려)
- [ ] 리스트 렌더링 시 적절한 `key` prop을 사용했는가?
- [ ] 불필요한 리렌더링이 발생하지 않는가?

### Hooks
- [ ] Hooks가 컴포넌트 최상위에서 호출되는가?
- [ ] `useEffect` 의존성 배열이 올바른가?
- [ ] `useMemo`, `useCallback`이 적절히 사용되었는가?
- [ ] Custom hooks가 `use` prefix를 사용하는가?

### Performance
- [ ] 무거운 컴포넌트에 lazy loading을 적용했는가?
- [ ] 이미지에 `next/image`를 사용했는가?
- [ ] 불필요한 inline 함수가 없는가?

```typescript
// ❌ Bad: 매 렌더링마다 새 함수 생성
<button onClick={() => handleClick(id)}>Click</button>

// ✅ Good: useCallback 사용
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

<button onClick={handleClick}>Click</button>
```

---

## 🎨 Styling

### Tailwind CSS
- [ ] Tailwind 유틸리티 클래스를 사용했는가?
- [ ] Design System 색상 변수를 사용했는가? (`bg-calm-*`, `text-accent`)
- [ ] Inline styles를 사용하지 않았는가?
- [ ] 재사용 가능한 패턴은 `global.css`에 정의했는가?

### 반응형 디자인
- [ ] 모바일 우선 (mobile-first) 접근을 따랐는가?
- [ ] 다양한 화면 크기에서 테스트했는가?
- [ ] Breakpoint가 적절히 사용되었는가? (`sm:`, `md:`, `lg:`)

### 접근성 (Accessibility)
- [ ] 시맨틱 HTML을 사용했는가? (`<button>`, `<nav>`, `<main>`)
- [ ] 인터랙티브 요소에 ARIA 라벨이 있는가?
- [ ] 키보드 네비게이션이 가능한가?
- [ ] 색상 대비가 충분한가? (WCAG AA 기준)

```tsx
// ✅ Good: 시맨틱 HTML + ARIA
<button 
  aria-label="프로필 북마크"
  onClick={handleBookmark}
>
  <BookmarkIcon />
</button>

// ❌ Bad: div + 접근성 부족
<div onClick={handleBookmark}>
  <BookmarkIcon />
</div>
```

---

## 🔧 Backend / API

### API 설계
- [ ] RESTful 규칙을 따르는가?
- [ ] HTTP 메서드가 적절히 사용되었는가? (GET, POST, PUT, DELETE)
- [ ] 응답 형식이 일관적인가?
- [ ] 에러 응답에 적절한 상태 코드를 사용했는가?

### 에러 처리
- [ ] Try-catch로 에러를 처리했는가?
- [ ] 사용자 친화적인 에러 메시지를 제공하는가?
- [ ] 에러 로깅이 구현되어 있는가?

```typescript
// ✅ Good
try {
  const data = await fetchData();
  return res.json({ success: true, data });
} catch (error) {
  console.error('Fetch error:', error);
  return res.status(500).json({
    success: false,
    message: '데이터를 불러오는데 실패했습니다.'
  });
}
```

### 보안
- [ ] SQL Injection 방지 (Parameterized queries)
- [ ] XSS 방지 (사용자 입력 sanitize)
- [ ] CSRF 방지 (토큰 사용)
- [ ] 민감한 정보가 로그에 노출되지 않는가?
- [ ] 환경 변수를 사용하여 비밀 정보를 관리하는가?

---

## 🗄️ Database

### 쿼리 최적화
- [ ] N+1 문제가 없는가? (JOIN 사용)
- [ ] 적절한 인덱스가 설정되어 있는가?
- [ ] 페이지네이션이 구현되어 있는가?

### 데이터 무결성
- [ ] Foreign key 제약 조건이 설정되어 있는가?
- [ ] NOT NULL 제약 조건이 적절히 사용되었는가?
- [ ] 데이터 유효성 검사가 구현되어 있는가?

---

## 🧪 Testing

### 테스트 커버리지
- [ ] 중요한 비즈니스 로직에 단위 테스트가 있는가?
- [ ] API 엔드포인트에 통합 테스트가 있는가?
- [ ] 주요 사용자 플로우에 E2E 테스트가 있는가?

### 테스트 품질
- [ ] 테스트가 독립적으로 실행 가능한가?
- [ ] 테스트 이름이 명확한가? (`should [expected] when [condition]`)
- [ ] AAA 패턴을 따르는가? (Arrange, Act, Assert)
- [ ] Mock을 적절히 사용했는가?

```typescript
// ✅ Good
describe('ProCard', () => {
  it('should display pro name when profile is provided', () => {
    // Arrange
    const profile = { name: '김지영', /* ... */ };
    
    // Act
    render(<ProCard profile={profile} />);
    
    // Assert
    expect(screen.getByText('김지영')).toBeInTheDocument();
  });
});
```

---

## 🚀 Performance

### 번들 크기
- [ ] 불필요한 라이브러리를 import하지 않았는가?
- [ ] Tree shaking이 가능하도록 코드를 작성했는가?
- [ ] Dynamic import를 사용하여 코드 스플리팅을 적용했는가?

### 이미지 최적화
- [ ] `next/image`를 사용했는가?
- [ ] 이미지 크기가 적절한가?
- [ ] WebP 형식을 사용했는가?
- [ ] Lazy loading이 적용되어 있는가?

### 렌더링 최적화
- [ ] 불필요한 리렌더링이 없는가?
- [ ] `React.memo`를 적절히 사용했는가?
- [ ] 무거운 계산에 `useMemo`를 사용했는가?

---

## 🔐 Security

### 인증 & 인가
- [ ] 인증이 필요한 엔드포인트가 보호되어 있는가?
- [ ] JWT 토큰이 안전하게 저장되는가?
- [ ] 세션 만료가 적절히 처리되는가?

### 데이터 보호
- [ ] 민감한 데이터가 클라이언트에 노출되지 않는가?
- [ ] API 키가 환경 변수로 관리되는가?
- [ ] HTTPS를 사용하는가?

### Input Validation
- [ ] 사용자 입력이 검증되는가?
- [ ] SQL Injection 방지가 구현되어 있는가?
- [ ] XSS 공격 방지가 구현되어 있는가?

---

## 📱 Mobile / Responsive

### 모바일 친화성
- [ ] 터치 타겟 크기가 충분한가? (최소 44x44px)
- [ ] 모바일에서 텍스트가 읽기 쉬운가?
- [ ] 가로/세로 모드 모두에서 작동하는가?

### 성능
- [ ] 모바일 네트워크에서 빠르게 로드되는가?
- [ ] 이미지가 모바일에 최적화되어 있는가?

---

## 🔄 Git

### Commit
- [ ] Commit 메시지가 명확한가?
- [ ] Conventional Commits 형식을 따르는가?
- [ ] 하나의 commit이 하나의 논리적 변경을 포함하는가?

```bash
# ✅ Good
feat(pro-profile): add video play button overlay
fix(booking): resolve date picker timezone issue

# ❌ Bad
update files
fix bug
```

### Branch
- [ ] Feature branch 이름이 명확한가? (`feature/add-booking-modal`)
- [ ] `main` 브랜치에 직접 push하지 않았는가?

---

## 📊 Business Logic

### 비즈니스 규칙 준수
- [ ] 무료 리드 한도 (3개/월) 로직이 올바른가?
- [ ] 구독 플랜 제한이 적용되는가?
- [ ] 프로 인증 상태가 확인되는가?

### 데이터 일관성
- [ ] 채팅방 생성 시 리드 카운트가 증가하는가?
- [ ] 구독 만료 시 적절한 처리가 되는가?

---

## ✅ Final Checklist

### 배포 전
- [ ] 로컬에서 빌드가 성공하는가?
- [ ] 모든 테스트가 통과하는가?
- [ ] Lint 에러가 없는가?
- [ ] TypeScript 타입 체크가 통과하는가?
- [ ] 브라우저 콘솔에 에러가 없는가?

### 문서화
- [ ] CONTEXT.md 업데이트가 필요한가?
- [ ] API_SPEC.md 업데이트가 필요한가?
- [ ] README 업데이트가 필요한가?

---

## 💡 Review Tips

### For Reviewers
- 코드의 **의도**를 이해하려고 노력하세요
- 건설적인 피드백을 제공하세요
- 질문을 통해 이해를 높이세요
- 칭찬도 잊지 마세요!

### For Authors
- 리뷰어의 시간을 존중하세요 (작은 PR 선호)
- PR 설명을 명확히 작성하세요
- 피드백을 긍정적으로 받아들이세요
- 필요시 추가 설명을 제공하세요

---

**이 체크리스트는 코드 품질 향상을 위한 가이드입니다. 모든 항목이 필수는 아니며, 상황에 따라 유연하게 적용하세요.**
