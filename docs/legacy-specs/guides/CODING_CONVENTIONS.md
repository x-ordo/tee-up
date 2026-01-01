# Coding Conventions

> **목적:** TEE:UP 프로젝트의 일관된 코드 스타일 및 베스트 프랙티스 정의  
> **적용 범위:** Frontend (Next.js/React) + Backend (Express.js)

---

## 📝 General Principles

1. **일관성 (Consistency):** 기존 코드 스타일을 따릅니다
2. **가독성 (Readability):** 명확하고 이해하기 쉬운 코드를 작성합니다
3. **단순성 (Simplicity):** 복잡한 로직보다 단순한 해결책을 선호합니다
4. **재사용성 (Reusability):** DRY (Don't Repeat Yourself) 원칙을 따릅니다

---

## 🎯 TypeScript

### Strict Mode
모든 파일에서 TypeScript strict mode를 사용합니다.

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Naming Conventions

| 요소 | 컨벤션 | 예시 |
|------|--------|------|
| **Components** | PascalCase | `ProCard`, `BookingModal` |
| **Functions** | camelCase | `fetchProfiles()`, `handleClick()` |
| **Variables** | camelCase | `userName`, `isLoading` |
| **Constants** | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRY_COUNT` |
| **Interfaces** | PascalCase with `I` prefix | `IProProfile`, `IUser` |
| **Types** | PascalCase | `ProStatus`, `ChatRoomStatus` |
| **Enums** | PascalCase | `UserRole`, `SubscriptionTier` |

### Type Definitions

**✅ Good: 명시적 타입**
```typescript
interface IProProfile {
  id: string;
  name: string;
  specialty: string[];
  rating: number;
}

function fetchProfile(id: string): Promise<IProProfile> {
  // ...
}
```

**❌ Bad: any 사용**
```typescript
function fetchProfile(id: any): any {
  // ...
}
```

### Type vs Interface

**Interface 사용 (권장):**
- 객체 구조 정의
- 확장 가능성이 있는 경우

```typescript
interface IUser {
  id: string;
  name: string;
}

interface IProUser extends IUser {
  specialty: string[];
}
```

**Type 사용:**
- Union, Intersection 타입
- Primitive 타입 별칭

```typescript
type UserRole = 'golfer' | 'pro' | 'admin';
type ProStatus = 'pending' | 'verified' | 'rejected';
```

---

## ⚛️ React / Next.js

### Component Structure

**기본 템플릿:**
```typescript
// 1. Imports (외부 → 내부)
import { useState } from 'react';
import { IProProfile } from '@/types';
import { Button } from '@/components/ui';

// 2. Type definitions
interface ProCardProps {
  profile: IProProfile;
  onBook?: () => void;
}

// 3. Component
export default function ProCard({ profile, onBook }: ProCardProps) {
  // 3.1 Hooks
  const [isHovered, setIsHovered] = useState(false);
  
  // 3.2 Derived state / Memoization
  const displayName = useMemo(() => {
    return profile.name.toUpperCase();
  }, [profile.name]);
  
  // 3.3 Event handlers
  const handleClick = useCallback(() => {
    onBook?.();
  }, [onBook]);
  
  // 3.4 Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // 3.5 Render
  return (
    <div onClick={handleClick}>
      {displayName}
    </div>
  );
}
```

### Server vs Client Components

**Server Component (기본):**
```typescript
// 데이터 페칭, 정적 컨텐츠
export default function ProCard({ profile }: ProCardProps) {
  return <div>{profile.name}</div>;
}
```

**Client Component:**
```typescript
'use client';

import { useState } from 'react';

// 상태 관리, 이벤트 핸들러, 브라우저 API
export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  return <div>{/* ... */}</div>;
}
```

### Props Naming

| Props 타입 | 네이밍 | 예시 |
|------------|--------|------|
| **Event handlers** | `on[Event]` | `onClick`, `onSubmit`, `onChange` |
| **Boolean** | `is[State]`, `has[Feature]` | `isOpen`, `hasError`, `isLoading` |
| **Render functions** | `render[Element]` | `renderHeader`, `renderFooter` |
| **Data** | 명사 | `profile`, `user`, `items` |

### Hooks Rules

**✅ Good:**
```typescript
function Component() {
  // 1. 모든 hooks를 최상위에서 호출
  const [state, setState] = useState(false);
  const data = useMemo(() => computeData(), []);
  
  // 2. 조건문 밖에서 호출
  if (state) {
    // ✅ OK
  }
  
  return <div />;
}
```

**❌ Bad:**
```typescript
function Component() {
  if (condition) {
    // ❌ 조건문 안에서 hook 호출
    const [state, setState] = useState(false);
  }
  
  return <div />;
}
```

### Custom Hooks

**네이밍:** `use` prefix 사용

```typescript
function useProProfile(slug: string) {
  const [profile, setProfile] = useState<IProProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProfile(slug).then(setProfile).finally(() => setLoading(false));
  }, [slug]);
  
  return { profile, loading };
}

// 사용
function ProPage({ slug }: { slug: string }) {
  const { profile, loading } = useProProfile(slug);
  
  if (loading) return <div>Loading...</div>;
  return <div>{profile?.name}</div>;
}
```

---

## 🎨 CSS / Tailwind

### Class Organization

**논리적 그룹화:**
```tsx
<div className="
  // Layout
  flex items-center justify-between
  
  // Spacing
  px-4 py-2 gap-2
  
  // Colors
  bg-calm-cloud text-calm-obsidian
  
  // Border & Radius
  border border-calm-stone rounded-lg
  
  // Effects
  hover:bg-calm-stone
  transition-colors duration-300
">
```

### Design System 색상 사용

**✅ Good: Design System 변수 사용**
```tsx
<div className="bg-calm-white text-calm-obsidian">
  <button className="bg-accent text-white">CTA</button>
</div>
```

**❌ Bad: 임의의 색상 사용**
```tsx
<div className="bg-gray-100 text-gray-900">
  <button className="bg-blue-500 text-white">CTA</button>
</div>
```

### Custom CSS Classes

재사용 가능한 패턴은 `global.css`에 정의:

```css
/* global.css */
.btn-primary {
  @apply px-6 py-3 bg-accent text-white rounded-lg;
  @apply hover:bg-accent-dark transition-colors;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.card {
  @apply bg-calm-cloud rounded-lg p-6;
  @apply border border-calm-stone;
  @apply hover:shadow-lg transition-shadow;
}
```

---

## 📁 File Organization

### Directory Structure

```
/web/src/app/
├── components/          # 공통 컴포넌트
│   ├── ui/             # UI 프리미티브
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   └── features/       # 기능 컴포넌트
│       ├── ProCard.tsx
│       └── BookingModal.tsx
├── [page]/             # 페이지 라우트
│   ├── page.tsx
│   ├── layout.tsx
│   └── components/     # 페이지 전용 컴포넌트
├── lib/                # 유틸리티 함수
│   ├── api.ts
│   └── utils.ts
├── types/              # TypeScript 타입
│   └── index.ts
└── styles/             # 글로벌 스타일
    └── global.css
```

### File Naming

| 파일 타입 | 네이밍 | 예시 |
|-----------|--------|------|
| **Components** | PascalCase.tsx | `ProCard.tsx`, `BookingModal.tsx` |
| **Pages** | lowercase.tsx | `page.tsx`, `layout.tsx` |
| **Utilities** | camelCase.ts | `api.ts`, `utils.ts` |
| **Types** | camelCase.ts | `types.ts`, `interfaces.ts` |
| **Styles** | lowercase.css | `global.css`, `theme.css` |

---

## 🔧 Functions

### Function Naming

**동사 + 명사 패턴:**
```typescript
// ✅ Good
function fetchProfiles() {}
function createUser() {}
function validateEmail() {}
function handleClick() {}

// ❌ Bad
function profiles() {}
function user() {}
function email() {}
function click() {}
```

### Function Size

**단일 책임 원칙 (SRP):**
- 함수는 하나의 일만 수행
- 15-20줄 이내 권장
- 복잡한 로직은 작은 함수로 분리

**✅ Good:**
```typescript
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^010-\d{4}-\d{4}$/.test(phone);
}

function validateUser(user: IUser): boolean {
  return validateEmail(user.email) && validatePhone(user.phone);
}
```

**❌ Bad:**
```typescript
function validateUser(user: IUser): boolean {
  // 너무 많은 책임
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);
  const phoneValid = /^010-\d{4}-\d{4}$/.test(user.phone);
  const nameValid = user.name.length > 0;
  const ageValid = user.age >= 18;
  // ...
  return emailValid && phoneValid && nameValid && ageValid;
}
```

### Arrow Functions vs Function Declarations

**Arrow functions:** 간단한 함수, 콜백
```typescript
const add = (a: number, b: number) => a + b;
const double = (x: number) => x * 2;

items.map(item => item.name);
```

**Function declarations:** 복잡한 로직, 재사용 함수
```typescript
function calculateTotalPrice(items: ICartItem[]): number {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}
```

---

## 💬 Comments & Documentation

### JSDoc

**Public API에 JSDoc 주석 추가:**
```typescript
/**
 * 프로 골퍼 프로필을 조회합니다.
 * 
 * @param slug - 프로 프로필 슬러그
 * @returns 프로 프로필 데이터 또는 null
 * @throws {Error} 네트워크 오류 시
 * 
 * @example
 * ```typescript
 * const profile = await fetchProfile('kim-jiyoung');
 * ```
 */
async function fetchProfile(slug: string): Promise<IProProfile | null> {
  // ...
}
```

### Inline Comments

**언제 주석을 작성하는가:**
- ✅ **Why (왜):** 비즈니스 로직, 복잡한 알고리즘
- ❌ **What (무엇):** 코드 자체가 설명

**✅ Good:**
```typescript
// 무료 리드 한도 초과 시 구독 업그레이드 필요
if (pro.monthly_chat_count >= FREE_LEAD_LIMIT) {
  return { requiresUpgrade: true };
}
```

**❌ Bad:**
```typescript
// monthly_chat_count가 3보다 크거나 같으면
if (pro.monthly_chat_count >= 3) {
  return { requiresUpgrade: true };
}
```

---

## 🔐 Error Handling

### Try-Catch

**API 호출 시 에러 처리:**
```typescript
async function fetchProfiles(): Promise<IProProfile[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/profiles`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch profiles:', error);
    throw new Error('프로필을 불러오는데 실패했습니다.');
  }
}
```

### Error Messages

**사용자 친화적인 메시지:**
```typescript
const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  NOT_FOUND: '요청하신 정보를 찾을 수 없습니다.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
};
```

---

## 🧪 Testing

### Test File Naming

```
ComponentName.tsx
ComponentName.test.tsx  // 또는 ComponentName.spec.tsx
```

### Test Structure (AAA Pattern)

```typescript
describe('ProCard', () => {
  it('should display pro name', () => {
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

## 📦 Imports

### Import Order

```typescript
// 1. External libraries
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Internal modules (절대 경로)
import { IProProfile } from '@/types';
import { Button } from '@/components/ui';
import { fetchProfiles } from '@/lib/api';

// 3. Relative imports
import { ProCard } from './components/ProCard';
import styles from './styles.module.css';
```

### Absolute vs Relative Imports

**Absolute imports (권장):**
```typescript
import { Button } from '@/components/ui/Button';
import { IUser } from '@/types';
```

**Relative imports:**
```typescript
import { ProCard } from './ProCard';  // 같은 디렉토리
import { utils } from '../lib/utils';  // 부모 디렉토리
```

---

## ✅ Code Review Checklist

코드 리뷰 시 확인 사항:
- [ ] TypeScript strict mode 준수
- [ ] `any` 타입 사용 최소화
- [ ] 네이밍 컨벤션 준수
- [ ] Server/Client Component 적절히 사용
- [ ] Design System 색상 사용
- [ ] 에러 처리 구현
- [ ] JSDoc 주석 추가 (public API)
- [ ] 테스트 작성 (중요 로직)

---

**이 컨벤션은 팀의 합의에 따라 지속적으로 업데이트됩니다.**
