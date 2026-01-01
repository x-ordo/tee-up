# API Specification

> **Version:** 1.0.0  
> **Last Updated:** 2025-11-24  
> **Status:** Phase 1 (MVP)

---

## 📋 Overview

TEE:UP RESTful API 명세서입니다. 프론트엔드와 백엔드 간의 계약을 정의합니다.

### Base URL
- **Development:** `http://localhost:5000/api`
- **Staging:** `https://staging-api.teeup.kr/api`
- **Production:** `https://api.teeup.kr/api`

### Authentication
- **Phase 1:** No authentication (public endpoints)
- **Phase 2:** Supabase JWT tokens in `Authorization` header

### Response Format
모든 API 응답은 다음 형식을 따릅니다:

**성공 응답:**
```json
{
  "success": true,
  "data": { /* 응답 데이터 */ }
}
```

**에러 응답:**
```json
{
  "success": false,
  "message": "사용자 친화적인 에러 메시지",
  "error": "개발용 상세 에러 (production에서는 제외)"
}
```

---

## 🏌️ Pro Profiles

### GET /api/profiles
모든 프로 프로필 요약 정보를 조회합니다.

**Request:**
```http
GET /api/profiles
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | 이름 또는 위치로 검색 |
| `specialty` | string | No | 전문 분야 필터 (driver, iron, short-game, putting) |
| `location` | string | No | 지역 필터 |
| `limit` | number | No | 결과 개수 제한 (기본: 20) |
| `offset` | number | No | 페이지네이션 오프셋 (기본: 0) |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "profiles": [
      {
        "id": "uuid",
        "slug": "kim-jiyoung",
        "name": "김지영",
        "specialty": ["driver", "iron"],
        "location": "강남구",
        "rating": 4.9,
        "imageUrl": "https://example.com/image.jpg",
        "verified": true,
        "tier": "LPGA"
      }
    ],
    "total": 50,
    "limit": 20,
    "offset": 0
  }
}
```

**Error Responses:**
- `500 Internal Server Error`: 서버 오류

---

### GET /api/profiles/:slug
특정 프로 프로필의 상세 정보를 조회합니다.

**Request:**
```http
GET /api/profiles/kim-jiyoung
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | 프로 프로필 슬러그 |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "kim-jiyoung",
    "name": "김지영",
    "bio": "LPGA 투어 5년 경력의 프로 골퍼입니다.",
    "career": {
      "tourExperience": "LPGA 투어 5년",
      "achievements": ["2023 LPGA 챔피언십 우승"],
      "certifications": ["LPGA Class A"]
    },
    "specialty": ["driver", "iron"],
    "location": "강남구",
    "rating": 4.9,
    "reviewCount": 127,
    "rebookingRate": 89,
    "pricing": {
      "individual": 150000,
      "group": 300000
    },
    "mainImage": "https://example.com/main.jpg",
    "gallery": [
      "https://example.com/gallery1.jpg",
      "https://example.com/gallery2.jpg"
    ],
    "videoUrl": "https://youtube.com/watch?v=xxx",
    "verified": true,
    "tier": "LPGA",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-11-24T00:00:00Z"
  }
}
```

**Error Responses:**
- `404 Not Found`: 프로필을 찾을 수 없음
- `500 Internal Server Error`: 서버 오류

---

## 💬 Chat Rooms (Phase 2)

### POST /api/chat/rooms
새 채팅방을 생성합니다 (골퍼 → 프로 문의).

**Request:**
```http
POST /api/chat/rooms
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "proId": "uuid",
  "message": "레슨 문의드립니다."
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `proId` | string (uuid) | Yes | 프로 사용자 ID |
| `message` | string | Yes | 첫 메시지 내용 |

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "roomId": "uuid",
    "proId": "uuid",
    "golferId": "uuid",
    "status": "active",
    "createdAt": "2024-11-24T00:00:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: 잘못된 요청 데이터
- `401 Unauthorized`: 인증 필요
- `403 Forbidden`: 프로의 무료 리드 한도 초과
- `500 Internal Server Error`: 서버 오류

---

### GET /api/chat/rooms/:roomId/messages
채팅방의 메시지 목록을 조회합니다.

**Request:**
```http
GET /api/chat/rooms/uuid/messages?limit=50&before=2024-11-24T00:00:00Z
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `roomId` | string (uuid) | 채팅방 ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | 메시지 개수 (기본: 50) |
| `before` | string (ISO 8601) | No | 이 시간 이전 메시지만 조회 |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "roomId": "uuid",
        "senderId": "uuid",
        "content": "안녕하세요, 레슨 문의드립니다.",
        "readAt": "2024-11-24T00:05:00Z",
        "createdAt": "2024-11-24T00:00:00Z"
      }
    ],
    "hasMore": false
  }
}
```

**Error Responses:**
- `401 Unauthorized`: 인증 필요
- `403 Forbidden`: 채팅방 접근 권한 없음
- `404 Not Found`: 채팅방을 찾을 수 없음

---

### POST /api/chat/rooms/:roomId/messages
채팅방에 새 메시지를 전송합니다.

**Request:**
```http
POST /api/chat/rooms/uuid/messages
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "content": "네, 가능합니다!"
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | Yes | 메시지 내용 (최대 1000자) |

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "roomId": "uuid",
    "senderId": "uuid",
    "content": "네, 가능합니다!",
    "readAt": null,
    "createdAt": "2024-11-24T00:10:00Z"
  }
}
```

---

## 👤 Users (Phase 2)

### POST /api/auth/signup
새 사용자를 등록합니다.

**Request:**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "role": "golfer"
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | 이메일 주소 |
| `password` | string | Yes | 비밀번호 (최소 8자) |
| `name` | string | Yes | 이름 |
| `phone` | string | Yes | 전화번호 |
| `role` | string | Yes | 사용자 역할 (golfer, pro) |

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "홍길동",
      "role": "golfer"
    },
    "token": "jwt_token"
  }
}
```

---

### POST /api/auth/login
사용자 로그인.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "홍길동",
      "role": "golfer"
    },
    "token": "jwt_token"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: 잘못된 이메일 또는 비밀번호

---

## 📊 Pro Dashboard (Phase 2)

### GET /api/dashboard/stats
프로 대시보드 통계를 조회합니다.

**Request:**
```http
GET /api/dashboard/stats
Authorization: Bearer <jwt_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "profileViews": {
      "today": 45,
      "thisWeek": 312,
      "thisMonth": 1250
    },
    "leads": {
      "thisMonth": 8,
      "total": 127,
      "limit": 3,
      "remaining": 0
    },
    "matchedLessons": {
      "thisMonth": 6,
      "total": 89
    },
    "rating": {
      "average": 4.9,
      "count": 127
    },
    "subscription": {
      "tier": "basic",
      "expiresAt": "2024-12-24T00:00:00Z"
    }
  }
}
```

---

## 💳 Subscriptions (Phase 2)

### GET /api/subscriptions/plans
구독 플랜 목록을 조회합니다.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "basic",
        "name": "Basic",
        "price": 0,
        "leadLimit": 3,
        "features": ["3 무료 리드/월", "기본 프로필"]
      },
      {
        "id": "pro",
        "name": "Pro",
        "price": 49000,
        "leadLimit": -1,
        "features": ["무제한 리드", "고급 분석", "우선 노출"]
      }
    ]
  }
}
```

---

### POST /api/subscriptions/checkout
구독 결제를 시작합니다.

**Request:**
```http
POST /api/subscriptions/checkout
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "planId": "pro"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://toss.im/checkout/xxx",
    "orderId": "uuid"
  }
}
```

---

## 🔧 Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | 성공적인 GET, PUT, PATCH |
| 201 | Created | 성공적인 POST |
| 204 | No Content | 성공적인 DELETE |
| 400 | Bad Request | 잘못된 요청 데이터 |
| 401 | Unauthorized | 인증 필요 |
| 403 | Forbidden | 권한 없음 |
| 404 | Not Found | 리소스 없음 |
| 429 | Too Many Requests | Rate limit 초과 |
| 500 | Internal Server Error | 서버 오류 |

---

## 📝 Changelog

### v1.0.0 (2024-11-24)
- Initial API specification
- Pro profiles endpoints
- Chat rooms endpoints (Phase 2)
- Authentication endpoints (Phase 2)
- Dashboard endpoints (Phase 2)
- Subscription endpoints (Phase 2)

---

**이 문서는 API 개발 진행에 따라 지속적으로 업데이트됩니다.**
