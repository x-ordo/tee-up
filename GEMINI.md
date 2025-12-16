# TEE:UP Project Overview

## Project Summary

TEE:UP (티업) is a premium golf lesson matching platform currently in Phase 1 MVP active development, targeting a Q1 2025 launch. It aims to connect VIP golfers with verified professional golfers, offering a magazine-style, data-driven experience.

**Core Functionality:**
*   **Visual-First Profiles:** Showcasing professional golfers with rich imagery, videos, and verified credentials.
*   **Real-time Matching:** Enabling quick connections through real-time chat (planned for Phase 2).
*   **Trust Building:** Utilizing LPGA/PGA certification badges, performance statistics, and user reviews.
*   **Transparent Pricing:** Clear lesson fees with offline payment options.
*   **Pro Dashboard:** Analytics, lead management, and subscription management for professionals (planned for Phase 2).

## Technologies & Architecture

TEE:UP is structured as a monorepo, comprising a Next.js frontend and an Express.js backend, primarily using TypeScript.

*   **Frontend:**
    *   **Framework:** Next.js 14.x (App Router)
    *   **Language:** TypeScript 5.x
    *   **Styling:** Tailwind CSS 3.x
    *   **Fonts:** Pretendard (Korean), Inter (English)
*   **Backend:**
    *   **Framework:** Express.js 4.x
    *   **Language:** TypeScript 5.x
*   **Database & Auth:** Supabase (PostgreSQL, Authentication, Realtime features)
*   **Planned Infrastructure:** Supabase, Cloudinary/S3 (media storage), Toss Payments (subscriptions), Vercel (frontend hosting), Railway/Fly.io (backend hosting).

## Design Philosophy

The project adheres to a "Korean Luxury Minimalism" design philosophy, centered around "Calm Control." This approach emphasizes visual calm and operational clarity, catering to both Pro Golfers (efficiency, control) and VIP Golfers (simplicity, trust). The UI/UX design is influenced by inspirations such as Amorepacific, Gentle Monster, Shadcn/ui, Magic UI, and uiverse.io. The project also aims to incorporate **Material3 design system principles** to further enhance user experience and deliver a sophisticated and modern aesthetic.

Key design principles include:
*   **Visual-First Storytelling:** Prioritizing visual elements over text.
*   **Cognitive Ease:** Reducing cognitive load and maintaining transparency.
*   **Data Clarity:** Ensuring metrics and data are easily scannable.
*   **Monochrome + Single Accent:** A color system primarily using neutrals with a distinct accent color for interactive elements.
*   **Accessibility:** Adhering to WCAG AA standards, with focus on contrast, keyboard navigation, and semantic HTML.

## Building and Running the Project

### Prerequisites

*   Node.js: 18+ (`node -v`)
*   npm: 9+ (`npm -v`)
*   Git: 2.x (`git --version`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-org/tee-up.git
    cd tee-up
    ```
2.  **Install frontend dependencies:**
    ```bash
    cd web
    npm install
    ```
3.  **Install backend dependencies:**
    ```bash
    cd ../api
    npm install
    ```

### Environment Variable Setup

*   **Frontend:**
    ```bash
    cp web/.env.example web/.env.local
    ```
*   **Backend:**
    ```bash
    cp api/.env.example api/.env
    ```
    Refer to `ENVIRONMENT.md` for detailed configuration.

### Development Server

*   **Frontend (http://localhost:3000):**
    ```bash
    cd web
    npm run dev
    ```
*   **Backend (http://localhost:5000):**
    ```bash
    cd api
    npm start
    ```

### Production Build

*   **Frontend:**
    ```bash
    cd web
    npm run build
    npm run start
    ```
*   **Backend:**
    ```bash
    cd api
    npm run build
    npm start
    ```

## Development Conventions

### Code Standards
*   **Language:** TypeScript strict mode
*   **Linting & Formatting:** ESLint + Prettier
*   **Accessibility:** WCAG AA compliance

### Commit Standards
The project follows Conventional Commits.
*   `feat`: New features
*   `fix`: Bug fixes
*   `refactor`: Code refactoring
*   `docs`: Documentation changes
*   `test`: Test additions or corrections
*   `chore`: Build process or auxiliary tool changes

### Development Workflow
Developers are expected to:
1.  Fork the repository.
2.  Create feature branches (e.g., `feat/amazing-feature`).
3.  Commit changes using Conventional Commits.
4.  Push branches to origin.
5.  Create Pull Requests for review.

## Key Documentation

*   [`CONTEXT.md`](CONTEXT.md): Project's single source of truth.
*   [`ENVIRONMENT.md`](ENVIRONMENT.md): Comprehensive guide for environment setup.
*   [`docs/specs/DESIGN_SYSTEM.md`](docs/specs/DESIGN_SYSTEM.md): Detailed specifications for the project's design system.
*   [`docs/specs/ARCHITECTURE.md`](docs/specs/ARCHITECTURE.md): Overview of the system architecture.
*   [`docs/specs/API_SPEC.md`](docs/specs/API_SPEC.md): Specifications for REST APIs.
*   [`docs/specs/DATA_MODEL.md`](docs/specs/DATA_MODEL.md): Database schema and data model.
*   [`docs/guides/TDD_GUIDE.md`](docs/guides/TDD_GUIDE.md): Guide to Test-Driven Development practices.
*   [`docs/guides/CONTRIBUTING.md`](docs/guides/CONTRIBUTING.md): Guidelines for contributing to the project.
