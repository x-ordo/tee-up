# TEE:UP Component Library

This document specifies the core UI components for the TEE:UP web service, adhering to our design principles of "Korean Luxury Minimalism" and Apple Human Interface Guidelines. Each component is designed for reusability, accessibility, and visual consistency.

---

## 1. Button

Interactive elements for user actions.

### A. Anatomy & Structure

```html
<Button variant="primary" size="lg" withIcon={true}>
  {/* Optional Icon (e.g., SVG or image) */}
  <span>Button Text</span>
</Button>
```

### B. Props

| Prop Name    | Type                                | Default   | Description                                                                 |
|--------------|-------------------------------------|-----------|-----------------------------------------------------------------------------|
| `variant`    | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Defines the visual style of the button.                             |
| `size`       | `'md' \| 'lg'`                      | `'md'`    | Defines the size of the button (medium or large).                           |
| `withIcon`   | `boolean`                           | `false`   | If `true`, adds space for an icon and centers content.                      |
| `asChild`    | `boolean`                           | `false`   | Renders the child component instead of a `<button>`, inheriting styles. Used for integrating with routing libraries like Next.js `Link`. |
| `className`  | `string`                            |           | Additional Tailwind CSS classes to apply.                                   |
| `ref`        | `React.Ref<HTMLButtonElement>`      |           | Ref to the underlying button DOM element.                                   |

### C. Variants & States

*   **`primary`**: Main call-to-action.
    *   **Default**: `bg-tee-accent-primary`, `text-tee-surface`, `border-tee-accent-primary`, `shadow-sm`
    *   **Hover**: `bg-tee-accent-primary-hover`, `border-tee-accent-primary-hover`
    *   **Active**: `bg-tee-accent-primary-active`, `border-tee-accent-primary-active`
    *   **Disabled**: `bg-tee-accent-primary-disabled`, `border-tee-accent-primary-disabled`, `cursor-not-allowed`
*   **`secondary`**: Secondary actions, often informational or less emphasized.
    *   **Default**: `bg-tee-background`, `text-tee-ink-strong`, `border-tee-ink-light/20`
    *   **Hover**: `border-tee-accent-primary`, `text-tee-accent-primary`
    *   **Disabled**: `border-tee-ink-light/20`, `text-tee-ink-light`, `cursor-not-allowed`
*   **`ghost`**: Minimal styling, often used for subtle actions or within other components.
    *   **Default**: `bg-transparent`, `text-tee-ink-strong`, `border-transparent`
    *   **Hover**: `bg-tee-background`
    *   **Disabled**: `text-tee-ink-light`, `cursor-not-allowed`

### D. Sizes

*   **`md`**: `h-10`, `px-4`, `py-2`, `text-body`, `rounded-full` (40px height)
*   **`lg`**: `h-12`, `px-6`, `py-3`, `text-h3`, `rounded-full` (48px height)

### E. Usage Example

```jsx
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

function MyComponent() {
  return (
    <div className="flex gap-4">
      <Button variant="primary" size="lg">
        AI 매칭 시작하기
      </Button>
      <Button variant="secondary" size="md" withIcon>
        <svg>{/* Icon SVG */}</svg>
        더 알아보기
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/settings">
          설정
        </Link>
      </Button>
      <Button disabled>
        비활성화 버튼
      </Button>
    </div>
  );
}
```

---

## 2. Card

A versatile container for grouping related content.

### A. Anatomy & Structure

```html
<Card className="flex flex-col gap-4">
  <h3>Card Title</h3>
  <p>Some descriptive text for the card content.</p>
  <Button variant="ghost" size="md">Action</Button>
</Card>
```

### B. Props

| Prop Name   | Type                               | Default | Description                            |
|-------------|------------------------------------|---------|----------------------------------------|
| `className` | `string`                           |         | Additional Tailwind CSS classes to apply. |
| `ref`       | `React.Ref<HTMLDivElement>`        |         | Ref to the underlying div DOM element. |

### C. Style

*   **Default**: `rounded-xl`, `border-tee-ink-light/20`, `bg-tee-surface`, `shadow-card`, `p-space-8`

### D. Usage Example

```jsx
import { Card } from '@/components/ui/Card';

function DashboardCard({ title, value }) {
  return (
    <Card className="text-center">
      <h3 className="text-h2 font-bold">{title}</h3>
      <p className="text-body text-tee-ink-light">{value}</p>
    </Card>
  );
}
```

---

## 3. Input

Standard input fields for text, numbers, and other data entry.

### A. Anatomy & Structure

```html
<Input
  label="이름"
  type="text"
  placeholder="이름을 입력하세요"
  helperText="공개적으로 표시됩니다."
  error="이름은 필수입니다."
/>
```

### B. Props

| Prop Name    | Type                                | Default     | Description                                                          |
|--------------|-------------------------------------|-------------|----------------------------------------------------------------------|
| `label`      | `string`                            |             | Label text displayed above the input.                                |
| `helperText` | `string`                            |             | Small helper text displayed below the input.                         |
| `error`      | `string`                            |             | Error message displayed below the input, overrides `helperText`.     |
| `type`       | `React.InputHTMLAttributes<HTMLInputElement>['type']` | `'text'`    | Type of the input field (e.g., 'text', 'email', 'password', 'number'). |
| `className`  | `string`                            |             | Additional Tailwind CSS classes to apply to the input element.       |
| `ref`        | `React.Ref<HTMLInputElement>`       |             | Ref to the underlying input DOM element.                             |

### C. Style

*   **Default**: `flex`, `h-10`, `w-full`, `rounded-full`, `border-tee-ink-light/20`, `bg-tee-surface`, `px-space-4`, `py-space-2`, `text-body`, `text-tee-ink-strong`, `placeholder:text-tee-ink-light`
*   **Focus**: `focus:border-tee-accent-primary`, `focus:outline-none`, `focus:ring-2`, `focus:ring-tee-accent-primary`, `focus:ring-offset-2`
*   **Error**: `border-tee-error`, `focus:ring-tee-error` (applied when `error` prop is present)
*   **Disabled**: `disabled:cursor-not-allowed`, `disabled:bg-tee-background`, `disabled:text-tee-ink-light`

### D. Usage Example

```jsx
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

function ProfileForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setNameError('이름을 입력해주세요.');
    } else {
      setNameError('');
      // Submit form
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="이름"
        type="text"
        placeholder="이름을 입력하세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
        helperText="공개적으로 표시됩니다."
        error={nameError}
      />
      <Input
        label="이메일"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit">저장</Button>
    </form>
  );
}
```

---

## 4. Tag

Small, descriptive labels for categorization, status, or attributes.

### A. Anatomy & Structure

```html
<Tag variant="default" size="md">
  LPGA Certified
</Tag>
```

### B. Props

| Prop Name   | Type                               | Default   | Description                                  |
|-------------|------------------------------------|-----------|----------------------------------------------|
| `variant`   | `'default' \| 'primary' \| 'outline'` | `'default'` | Visual style of the tag.                     |
| `size`      | `'md' \| 'lg'`                     | `'md'`    | Size of the tag.                             |
| `className` | `string`                           |           | Additional Tailwind CSS classes to apply.    |
| `ref`       | `React.Ref<HTMLDivElement>`        |           | Ref to the underlying div DOM element.       |

### C. Variants & Sizes

*   **`default`**: `bg-tee-accent-secondary`, `text-tee-ink-strong`
*   **`primary`**: `bg-tee-accent-primary`, `text-tee-surface`
*   **`outline`**: `border border-tee-ink-light/20`, `text-tee-ink-strong`
*   **`md`**: `h-6`, `px-space-2` (standard height)
*   **`lg`**: `h-8`, `px-space-3` (larger height)

### D. Usage Example

```jsx
import { Tag } from '@/components/ui/Tag';

function ProProfileTags() {
  return (
    <div className="flex gap-2">
      <Tag variant="default">PGA Class A</Tag>
      <Tag variant="primary" size="lg">Experienced</Tag>
      <Tag variant="outline">Driving Range</Tag>
    </div>
  );
}
```
