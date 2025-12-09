# TEE:UP 컴포넌트 라이브러리 v1.0

본 문서는 TEE:UP 웹 서비스의 공통 UI 컴포넌트를 정의하고 설명합니다. Apple Human Interface Guidelines (HIG) 스타일과 디자인 토큰을 기반으로 일관되고 재사용 가능한 컴포넌트 시스템을 구축하는 것을 목표로 합니다.

## 1. Button (버튼)

다양한 용도와 중요도에 따라 3가지 variants와 2가지 size를 제공합니다.

- **파일**: `web/src/components/ui/Button.tsx`
- **디자인 원칙**: 높이를 충분히 크게 유지하고, `rounded-full`을 적용하여 부드러운 인상을 줍니다. Shadow는 기본적으로 없으며, hover/active 상태는 색상 대비(밝기/채도 조절)만으로 표현합니다.

### 1.1. Props

| Prop      | 타입                               | 기본값       | 설명                                     |
| :--------| :----------------------------------| :------------| :---------------------------------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'`  | 버튼의 스타일 변형.                      |
| `size`    | `'md' \| 'lg'`                      | `'md'`       | 버튼의 크기.                             |
| `withIcon`| `boolean`                          | `false`      | 아이콘 포함 여부. 포함 시 아이콘과 텍스트 간 간격 추가. |
| `className` | `string`                           | `''`         | 추가 CSS 클래스.                         |
| `asChild` | `boolean`                          | `false`      | 자식 컴포넌트를 렌더링할지 여부 (예: Next.js Link). |
| `...rest` | `HTMLButtonElement` 속성            | -            | 표준 버튼 태그 속성.                     |

### 1.2. Variants

-   **Primary**: 핵심 액션, 가장 높은 우선순위. (`bg-tee-accent-primary`, `text-tee-surface`)
    -   `hover`: `bg-tee-accent-primary-hover`
    -   `active`: `bg-tee-accent-primary-active`
    -   `disabled`: `bg-tee-accent-primary-disabled`
-   **Secondary**: 보조 액션, 중간 우선순위. (`bg-tee-background`, `text-tee-ink-strong`, `border-tee-ink-light/20`)
    -   `hover`: `border-tee-accent-primary`, `text-tee-accent-primary`
-   **Ghost**: 가장 낮은 우선순위, 텍스트 링크 형태. (`bg-transparent`, `text-tee-ink-strong`)
    -   `hover`: `bg-tee-background`

### 1.3. Sizes

-   **md**: 높이 `h-10` (40px), 패딩 `px-4 py-2`, `text-body`
-   **lg**: 높이 `h-12` (48px), 패딩 `px-6 py-3`, `text-h3`

### 1.4. 사용 예시

```tsx
import { Button } from '@/components/ui/Button';
import { MailIcon } from 'lucide-react'; // 예시 아이콘

function MyComponent() {
  return (
    <div className="flex gap-4 p-4">
      <Button variant="primary" size="lg">
        무료 매칭 시작
      </Button>
      <Button variant="secondary" size="md" withIcon>
        <MailIcon className="h-4 w-4" /> 문의하기
      </Button>
      <Button variant="ghost">더 보기</Button>
      <Button variant="primary" disabled>
        비활성화 버튼
      </Button>
    </div>
  );
}
```

## 2. Card (카드)

정보를 그룹화하고 시각적 계층을 형성하는 데 사용되는 기본 컨테이너 컴포넌트입니다.

-   **파일**: `web/src/components/ui/Card.tsx`
-   **디자인 원칙**: 프로 프로필, 리스트 아이템, 통계 등 다양한 콘텐츠의 공통 베이스로 사용됩니다. 1px 보더, 최소한의 그림자(`shadow-card`), 넉넉한 내부 패딩(`p-4`)을 통해 Calm Luxury 미학을 유지합니다.

### 2.1. Props

| Prop      | 타입                       | 기본값    | 설명                                  |
| :--------| :--------------------------| :--------| :------------------------------------|
| `className` | `string`                   | `''`     | 추가 CSS 클래스.                      |
| `asChild` | `boolean`                  | `false`  | 자식 컴포넌트를 렌더링할지 여부.        |
| `...rest` | `HTMLDivElement` 속성      | -        | 표준 div 태그 속성.                   |

### 2.2. 사용 예시

```tsx
import { Card } from '@/components/ui/Card';

function MyComponent() {
  return (
    <Card className="max-w-md mx-auto">
      <h3 className="text-h3 font-bold text-tee-ink-strong mb-2">프로필 요약</h3>
      <p className="text-body text-tee-ink-light">
        김프로는 LPGA 투어 경험이 풍부한 전문 골프 코치입니다.
      </p>
      <div className="mt-4 flex justify-end">
        <Button variant="secondary" size="md">자세히 보기</Button>
      </div>
    </Card>
  );
}
```

## 3. Input (입력 폼)

사용자 입력을 받는 표준 입력 필드입니다. `label`, `helperText`, `errorText`를 포함하는 구조를 가집니다.

-   **파일**: `web/src/components/ui/Input.tsx`
-   **디자인 원칙**: 포커스 시 `accent-primary` 색상의 1px 링이 명확하지만 과장되지 않게 나타나 사용자에게 현재 활성화된 필드를 시각적으로 알려줍니다. `rounded-full`을 기본으로 하여 부드러운 형태를 유지합니다.

### 3.1. Props

| Prop        | 타입                               | 기본값   | 설명                                     |
| :----------| :----------------------------------| :-------| :---------------------------------------|
| `label`     | `string`                           | `undefined` | 입력 필드의 레이블.                      |
| `helperText`| `string`                           | `undefined` | 입력 필드에 대한 추가 설명.              |
| `errorText` | `string`                           | `undefined` | 유효성 검사 실패 시 에러 메시지.         |
| `id`        | `string`                           | 자동 생성 | `label`과 `input`을 연결하는 ID. |
| `className` | `string`                           | `''`     | input 태그에 적용될 추가 CSS 클래스.   |
| `...rest`   | `HTMLInputElement` 속성            | -        | 표준 input 태그 속성.                    |

### 3.2. 사용 예시

```tsx
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

function MyForm() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value.length < 3) {
      setError('최소 3자 이상 입력해주세요.');
    } else {
      setError('');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Input
        label="이름"
        placeholder="이름을 입력하세요"
        helperText="실명으로 입력해주세요."
        value={value}
        onChange={handleChange}
      />
      <Input
        label="이메일"
        type="email"
        placeholder="your@email.com"
        errorText={error}
      />
      <Input
        label="비밀번호"
        type="password"
        helperText="8자 이상 입력해주세요."
      />
    </div>
  );
}
```

## 4. Tag (태그 / 배지)

작고 간결하게 정보를 표시하거나 상태를 나타내는 데 사용됩니다. 프로의 인증 상태나 등급을 표시하는 데 적합합니다.

-   **파일**: `web/src/components/ui/Tag.tsx`
-   **디자인 원칙**: `accent-secondary` (골드)를 기본 색상으로 사용하여 프리미엄 인증 배지의 느낌을 줍니다. 텍스트는 `ink-strong`을 사용합니다. `rounded-full`을 적용하여 부드러운 형태를 가집니다.

### 4.1. Props

| Prop      | 타입                               | 기본값       | 설명                                     |
| :--------| :----------------------------------| :------------| :---------------------------------------|
| `variant` | `'primary' \| 'secondary' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'secondary'` | 태그의 색상 변형.                       |
| `className` | `string`                           | `''`         | 추가 CSS 클래스.                         |
| `asChild` | `boolean`                          | `false`      | 자식 컴포넌트를 렌더링할지 여부.        |
| `...rest` | `HTMLDivElement` 속성              | -            | 표준 div 태그 속성.                      |

### 4.2. 사용 예시

```tsx
import { Tag } from '@/components/ui/Tag';

function MyProfileTags() {
  return (
    <div className="flex gap-2 p-4">
      <Tag variant="secondary">KPGA 인증</Tag>
      <Tag variant="success">TOP 100</Tag>
      <Tag variant="primary">추천 프로</Tag>
      <Tag variant="info">신규</Tag>
    </div>
  );
}
```
