# Error Handling Patterns

> **목적:** 일관된 에러 처리 패턴 정의  
> **적용 범위:** Frontend (Next.js/React) + Backend (Express.js)

---

## 📋 Overview

TEE:UP 프로젝트에서 사용하는 에러 처리 패턴 및 베스트 프랙티스를 정의합니다.

### 핵심 원칙
1. **사용자 친화적:** 기술적 에러 대신 이해하기 쉬운 메시지 제공
2. **일관성:** 모든 에러 응답이 동일한 형식을 따름
3. **로깅:** 모든 에러를 적절히 로깅하여 디버깅 지원
4. **복구 가능성:** 가능한 경우 에러 복구 방법 제시

---

## 🎯 Frontend Error Handling

### API Call Error Handling

**기본 패턴:**
```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchProfiles(): Promise<IProProfile[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/profiles`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data;
    
  } catch (error) {
    console.error('[API Error] Failed to fetch profiles:', error);
    
    // 사용자 친화적인 에러 메시지
    throw new Error('프로필을 불러오는데 실패했습니다. 다시 시도해주세요.');
  }
}
```

### Error Boundaries

**React Error Boundary 컴포넌트:**
```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // 에러 로깅 (Sentry 등)
    console.error('Error caught by boundary:', error, errorInfo);
    
    // TODO: Send to error tracking service
    // sendToSentry(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-calm-white">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-calm-obsidian mb-4">
              문제가 발생했습니다
            </h2>
            <p className="text-calm-charcoal mb-6">
              페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**사용 예시:**
```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

### Loading & Error States

**페이지 레벨 에러 처리:**
```typescript
// app/profile/[slug]/page.tsx
import { Suspense } from 'react';

export default async function ProfilePage({ params }: { params: { slug: string } }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">프로필을 불러올 수 없습니다</h2>
          <p className="text-calm-charcoal">잠시 후 다시 시도해주세요.</p>
        </div>
      }
    >
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent slug={params.slug} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### Form Validation Errors

**클라이언트 사이드 검증:**
```typescript
'use client';

import { useState } from 'react';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  
  const validateForm = (email: string, password: string): FormErrors => {
    const errors: FormErrors = {};
    
    if (!email) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = '올바른 이메일 형식이 아닙니다.';
    }
    
    if (!password) {
      errors.password = '비밀번호를 입력해주세요.';
    } else if (password.length < 8) {
      errors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
    }
    
    return errors;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    // 검증
    const validationErrors = validateForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      await login(email, password);
    } catch (error) {
      setErrors({ email: '로그인에 실패했습니다. 다시 시도해주세요.' });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          name="email"
          className={`input ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>
      
      <div>
        <input
          type="password"
          name="password"
          className={`input ${errors.password ? 'border-red-500' : ''}`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>
      
      <button type="submit" className="btn-primary">
        로그인
      </button>
    </form>
  );
}
```

---

## 🔧 Backend Error Handling

### Custom Error Class

**AppError 클래스:**
```typescript
// api/src/errors/AppError.ts
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// 특정 에러 타입
export class NotFoundError extends AppError {
  constructor(message: string = '리소스를 찾을 수 없습니다.') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = '인증이 필요합니다.') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = '접근 권한이 없습니다.') {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = '입력 정보를 확인해주세요.') {
    super(message, 400);
  }
}
```

### Error Middleware

**Express 에러 핸들러:**
```typescript
// api/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Operational errors (예상된 에러)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Unexpected errors (예상치 못한 에러)
  console.error('Unexpected error:', err);
  
  // Production에서는 상세 에러 숨김
  const message = process.env.NODE_ENV === 'production'
    ? '서버 오류가 발생했습니다.'
    : err.message;
  
  return res.status(500).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { error: err.stack })
  });
}
```

### API Endpoint Error Handling

**사용 예시:**
```typescript
// api/src/index.ts
import express from 'express';
import { AppError, NotFoundError } from './errors/AppError';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Routes
app.get('/api/profiles/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const profile = await findProfileBySlug(slug);
    
    if (!profile) {
      throw new NotFoundError('프로필을 찾을 수 없습니다.');
    }
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);  // 에러를 에러 핸들러로 전달
  }
});

// Error handler는 마지막에 등록
app.use(errorHandler);
```

### Async Error Handling

**Async wrapper 함수:**
```typescript
// api/src/utils/asyncHandler.ts
import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export function asyncHandler(fn: AsyncFunction) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
```

**사용 예시:**
```typescript
// Try-catch 없이 사용 가능
app.get('/api/profiles/:slug', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const profile = await findProfileBySlug(slug);
  
  if (!profile) {
    throw new NotFoundError('프로필을 찾을 수 없습니다.');
  }
  
  res.json({ success: true, data: profile });
}));
```

---

## 📝 Error Messages

### 사용자 친화적 메시지 (Korean)

```typescript
// lib/errorMessages.ts
export const ERROR_MESSAGES = {
  // Network
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  TIMEOUT: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
  
  // Authentication
  UNAUTHORIZED: '로그인이 필요합니다.',
  INVALID_CREDENTIALS: '이메일 또는 비밀번호를 확인해주세요.',
  SESSION_EXPIRED: '세션이 만료되었습니다. 다시 로그인해주세요.',
  
  // Authorization
  FORBIDDEN: '접근 권한이 없습니다.',
  SUBSCRIPTION_REQUIRED: '구독이 필요한 기능입니다.',
  LEAD_LIMIT_EXCEEDED: '무료 리드 한도를 초과했습니다. 구독을 업그레이드해주세요.',
  
  // Resource
  NOT_FOUND: '요청하신 정보를 찾을 수 없습니다.',
  PROFILE_NOT_FOUND: '프로필을 찾을 수 없습니다.',
  CHAT_ROOM_NOT_FOUND: '채팅방을 찾을 수 없습니다.',
  
  // Validation
  VALIDATION_ERROR: '입력 정보를 확인해주세요.',
  INVALID_EMAIL: '올바른 이메일 형식이 아닙니다.',
  INVALID_PHONE: '올바른 전화번호 형식이 아닙니다.',
  PASSWORD_TOO_SHORT: '비밀번호는 최소 8자 이상이어야 합니다.',
  
  // Server
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  DATABASE_ERROR: '데이터베이스 오류가 발생했습니다.',
  
  // Rate Limiting
  TOO_MANY_REQUESTS: '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.',
} as const;
```

---

## 🔍 Error Logging

### Console Logging

**로그 레벨:**
```typescript
// lib/logger.ts
export const logger = {
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
    // TODO: Send to error tracking service (Sentry)
  },
  
  warn: (message: string) => {
    console.warn(`[WARN] ${message}`);
  },
  
  info: (message: string) => {
    console.log(`[INFO] ${message}`);
  },
  
  debug: (message: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`);
    }
  }
};
```

### Error Tracking (Phase 2)

**Sentry 통합:**
```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
    });
  }
}

export function captureError(error: Error, context?: Record<string, any>) {
  console.error('Error:', error);
  
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  }
}
```

---

## 🎨 UI Error Display

### Toast Notifications

**에러 토스트:**
```typescript
// components/Toast.tsx
'use client';

import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'error' | 'success' | 'info';
  duration?: number;
}

export function Toast({ message, type, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);
  
  if (!isVisible) return null;
  
  const bgColor = {
    error: 'bg-red-500',
    success: 'bg-green-500',
    info: 'bg-blue-500',
  }[type];
  
  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg`}>
      {message}
    </div>
  );
}
```

### Error Pages

**404 페이지:**
```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-calm-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-calm-obsidian mb-4">404</h1>
        <p className="text-xl text-calm-charcoal mb-8">
          페이지를 찾을 수 없습니다.
        </p>
        <a href="/" className="btn-primary">
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}
```

---

## 📊 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| **200** | OK | 성공적인 GET, PUT, PATCH |
| **201** | Created | 성공적인 POST |
| **204** | No Content | 성공적인 DELETE |
| **400** | Bad Request | 잘못된 요청 데이터 |
| **401** | Unauthorized | 인증 필요 |
| **403** | Forbidden | 권한 없음 |
| **404** | Not Found | 리소스 없음 |
| **409** | Conflict | 리소스 충돌 (중복 등) |
| **422** | Unprocessable Entity | 검증 실패 |
| **429** | Too Many Requests | Rate limit 초과 |
| **500** | Internal Server Error | 서버 오류 |
| **502** | Bad Gateway | 게이트웨이 오류 |
| **503** | Service Unavailable | 서비스 일시 중단 |

---

## ✅ Best Practices

### Do's ✅
- 사용자 친화적인 에러 메시지 제공
- 모든 에러를 로깅
- 적절한 HTTP 상태 코드 사용
- 에러 복구 방법 제시
- 민감한 정보 노출 방지

### Don'ts ❌
- 기술적 에러 메시지를 사용자에게 노출
- 에러를 무시하거나 숨김
- 모든 에러를 500으로 처리
- Stack trace를 프로덕션에 노출
- 에러 로깅 없이 catch만 사용

---

**일관된 에러 처리로 사용자 경험과 디버깅 효율성을 향상시킵니다.**
