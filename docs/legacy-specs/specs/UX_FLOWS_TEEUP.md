# TEE:UP UX Flows

This document details the core user experience (UX) flows for the TEE:UP platform, guided by Apple Human Interface Guidelines (HIG) and our "Calm Control" design philosophy. Each flow is designed to be intuitive, efficient, and visually clear, ensuring a premium experience for both VIP Golfers and Professional Golfers.

---

## Core UX Principles Applied

*   **Single Primary Action per Screen**: Each screen or major interaction point focuses on guiding the user towards one primary goal.
*   **Minimal Steps & Shallow Hierarchy**: Keep user journeys as short as possible, avoiding deep navigation.
*   **Clear Progress Indicators**: For multi-step processes, clearly show where the user is in the journey.
*   **Visual-First Storytelling**: Leverage imagery, video, and data visualization to convey information quickly and engagingly.
*   **Predictable Interactions**: Consistent UI elements and feedback ensure users know what to expect.
*   **Accessibility First**: Flows are designed with WCAG AA compliance in mind, including keyboard navigation and clear focus states.

---

## 1. Golfer Inquiry & Pro Matching Flow

**Goal**: A VIP Golfer discovers TEE:UP, finds a suitable professional, and initiates contact for a lesson.

### A. Landing Page (Entry Point)

*   **Description**: Introduces TEE:UP, highlights AI matching and premium pros.
*   **Key Components**:
    *   Header (Logo, Primary CTA: "바로 시작하기")
    *   Hero Section (Large Title, AI matching tag, descriptive text, Primary CTA: "3분 만에 AI 매칭 시작하기")
    *   AI Matching Steps (3 Cards: 목표 설정, AI 추천, 바로 상담)
    *   Featured Pros Snippet (Abstract Pro Cards, Secondary CTA: "모든 프로 살펴보기")
    *   Statistics Section (Cards: 검증된 프로 수, 성공 매칭 수, 평균 평점, 재예약률)
    *   Final CTA (Card: "지금 바로 시작해보세요", Primary CTA: "무료 매칭 받아보기")
    *   Footer
*   **HIG Rules Applied**:
    *   **Clarity**: Clear, concise messaging, prominent CTAs.
    *   **Deference**: Content takes precedence over UI elements.
    *   **Feedback**: Subtle animations (e.g., scroll indicator, AI tag pulse).
*   **ASCII Wireframe**:
    ```
    [Header (Logo, CTA)]
    +------------------------------------+
    |             Hero Section           |
    |  [AI Tag]                          |
    |  [Large Title]                     |
    |  [Description]                     |
    |  [Primary CTA Button]              |
    |  [Scroll Indicator]                |
    +------------------------------------+
    |          AI Matching Steps         |
    |  [Card 1] [Card 2] [Card 3]        |
    +------------------------------------+
    |        Featured Pros Snippet       |
    |  [Pro Card 1] [Pro Card 2] ...     |
    |  [View All Pros Link]              |
    +------------------------------------+
    |           Statistics Section       |
    |  [Stat Card 1] [Stat Card 2] ...   |
    +------------------------------------+
    |              Final CTA             |
    |  [Title]                           |
    |  [Description]                     |
    |  [Primary CTA Button]              |
    +------------------------------------+
    [Footer]
    ```

### B. AI Matching Onboarding (Modal or Dedicated Page)

*   **Description**: Guided questionnaire to understand golfer's needs.
*   **Entry Point**: Click "3분 만에 AI 매칭 시작하기" or "무료 매칭 받아보기" CTAs.
*   **Key Components**:
    *   Progress Indicator (e.g., "1/5 단계")
    *   Question Title
    *   Input Fields (Text, Radio, Checkbox, Slider)
    *   Navigation Buttons ("이전", "다음", "건너뛰기")
    *   (If modal) Close button
*   **HIG Rules Applied**:
    *   **Direct Manipulation**: Clear, responsive input controls.
    *   **Feedback**: Immediate validation feedback for inputs.
    *   **Consistency**: Consistent placement of navigation controls.
*   **ASCII Wireframe**:
    ```
    +------------------------------------+
    | [Progress: Step X/Y]    [Close]    |
    |------------------------------------|
    |                                    |
    |    [Question Title]                |
    |                                    |
    |    [Input Field / Radio Group]     |
    |                                    |
    |    [Helper/Error Text]             |
    |                                    |
    |------------------------------------|
    | [Prev Button] [Next/Submit Button] |
    +------------------------------------+
    ```

### C. Recommended Pros List

*   **Description**: Displays a personalized list of pros based on AI matching results.
*   **Entry Point**: Completion of AI Matching Onboarding.
*   **Key Components**:
    *   Header (Search/Filter, CTA)
    *   "나에게 추천하는 프로" Title
    *   Filter/Sort Options (Dropdowns, Tags)
    *   Pro Cards (Image, Name, LPGA/PGA Tag, Rating, Short Bio, CTA: "프로필 보기") - in a grid or list
    *   Pagination/Load More
    *   Footer
*   **HIG Rules Applied**:
    *   **Discovery**: Clear filtering and sorting mechanisms.
    *   **Aesthetic Integrity**: Visually appealing presentation of pro profiles.
    *   **Feedback**: Indicate active filters/sorts.
*   **ASCII Wireframe**:
    ```
    [Header (Search, CTA)]
    +------------------------------------+
    |   나에게 추천하는 프로 Title       |
    |  [Filters/Sort Options]            |
    |------------------------------------|
    |                                    |
    |  [Pro Card 1] [Pro Card 2]         |
    |  [Pro Card 3] [Pro Card 4]         |
    |                                    |
    |  [Pagination / Load More]          |
    +------------------------------------+
    [Footer]
    ```

### D. Pro Detail Page

*   **Description**: Comprehensive view of a single professional golfer's profile.
*   **Entry Point**: Click "프로필 보기" on a Pro Card.
*   **Key Components**:
    *   Header
    *   Hero Section (Pro Image, Name, Certifications (Tags), Rating, Bio, CTA: "레슨 문의하기")
    *   Detailed Sections (경력, 레슨 프로그램, 갤러리, 리뷰, Q&A) - possibly tabbed or accordion
    *   Booking/Inquiry Form (embedded or modal trigger)
    *   Footer
*   **HIG Rules Applied**:
    *   **Depth**: Provides rich, detailed information without overwhelming.
    *   **Hierarchy**: Clear organization of content sections.
    *   **Feedback**: Clear indication of primary action ("레슨 문의하기").
*   **ASCII Wireframe**:
    ```
    [Header]
    +------------------------------------+
    |             Pro Hero               |
    |  [Pro Image]                       |
    |  [Pro Name H1] [Tags] [Rating]     |
    |  [Bio Snippet]                     |
    |  [CTA: 레슨 문의하기]               |
    +------------------------------------+
    |         Detailed Sections          |
    |  [Tabs/Accordion: 경력, 레슨..]    |
    |    [Content for selected tab]      |
    +------------------------------------+
    |    Booking/Inquiry Form (Optional) |
    +------------------------------------+
    [Footer]
    ```

### E. Lesson Inquiry Form / Chat Initiation

*   **Description**: Golfer sends an inquiry or initiates chat with the selected pro.
*   **Entry Point**: Click "레슨 문의하기" on Pro Detail Page.
*   **Key Components**:
    *   Modal/Page with Form (Lesson Type, Date/Time Preference, Message)
    *   Submit Button
    *   (If chat) Chat window interface
*   **HIG Rules Applied**:
    *   **Clarity**: Simple, focused form fields.
    *   **Feedback**: Confirmation after submission.
    *   **Responsiveness**: Smooth transition to chat (if applicable).
*   **ASCII Wireframe**:
    ```
    +------------------------------------+
    | [Title: 레슨 문의하기] [Close]      |
    |------------------------------------|
    |                                    |
    |    [Input: 레슨 종류]              |
    |    [Input: 선호 날짜/시간]         |
    |    [Textarea: 메시지]              |
    |                                    |
    |    [Submit Button]                 |
    +------------------------------------+
    ```

---

## 2. Professional Onboarding Flow

**Goal**: A Professional Golfer signs up, creates a profile, and gets verified to offer lessons.

### A. Pro Sign-up / Registration

*   **Description**: Initial account creation for pros.
*   **Key Components**:
    *   Header (Login/Signup options)
    *   Form (Email, Password, Name, Phone Number)
    *   Terms & Privacy Checkbox
    *   Signup Button
    *   Social Login Options (Kakao, Apple)
*   **HIG Rules Applied**:
    *   **Efficiency**: Streamlined input, clear error states.
    *   **Security**: Clear password requirements.
    *   **Trust**: Prominent links to legal documents.

### B. Profile Creation (Multi-step Form)

*   **Description**: Pros build out their public profile.
*   **Key Components**:
    *   Progress Indicator
    *   Form Sections (Personal Info, Certifications, Experience, Lesson Programs, Gallery/Media)
    *   File Uploaders (for certifications, photos, videos)
    *   Rich Text Editor (for detailed bio/program descriptions)
    *   Navigation Buttons ("이전", "저장", "다음", "제출")
*   **HIG Rules Applied**:
    *   **Direct Manipulation**: Easy media upload, intuitive form elements.
    *   **Feedback**: Progress indicator, visual feedback on file uploads.
    *   **Consistency**: Consistent navigation.

### C. Verification Process Status

*   **Description**: Informs the pro about their verification status.
*   **Key Components**:
    *   Dashboard Header
    *   Status Card (e.g., "Verification Pending", "Verified", "Action Required")
    *   Explanation/Next Steps based on status
    *   (If action required) Link to relevant form/upload
*   **HIG Rules Applied**:
    *   **Clarity**: Clear status messages and actionable advice.
    *   **Feedback**: Visual cues for status.

---

## 3. Pro Dashboard (MVP Overview)

**Goal**: A verified Professional Golfer manages their profile, lessons, and inquiries.

### A. Dashboard Overview

*   **Description**: Summary of recent activities, inquiries, and profile status.
*   **Key Components**:
    *   Header (Profile, Settings, Logout)
    *   Sidebar Navigation (프로필 관리, 레슨 관리, 문의함, 통계)
    *   "환영합니다, [프로 이름]" greeting
    *   Summary Cards (예정된 레슨, 새 문의, 프로필 완성도)
    *   Recent Activity Feed
*   **HIG Rules Applied**:
    *   **Information Hierarchy**: Key information is immediately visible.
    *   **Efficiency**: Quick access to frequently used features.
    *   **Personalization**: Personalized greeting.

### B. Profile Management

*   **Description**: Pros edit their public profile details.
*   **Entry Point**: Sidebar link "프로필 관리".
*   **Key Components**:
    *   Form (same fields as Profile Creation, pre-filled)
    *   Save/Cancel Buttons
    *   Preview Option
*   **HIG Rules Applied**:
    *   **Direct Manipulation**: Easy editing of profile fields.
    *   **Consistency**: Familiar form elements.

### C. Inquiry Management

*   **Description**: Pros view and respond to lesson inquiries.
*   **Entry Point**: Sidebar link "문의함".
*   **Key Components**:
    *   Inquiry List (filterable/sortable)
    *   Inquiry Detail View (Golfer Info, Message, Response Composer)
    *   (Future) Chat Interface
*   **HIG Rules Applied**:
    *   **Efficiency**: Streamlined workflow for responding to inquiries.
    *   **Feedback**: Clear read/unread indicators.

---

This framework ensures that all user interactions are thoughtfully designed, contributing to a cohesive, high-quality, and premium experience consistent with the TEE:UP brand.
