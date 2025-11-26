# Development Environment Setup

> **목적:** TEE:UP 프로젝트 개발 환경을 처음부터 설정하는 가이드  
> **대상:** 신규 개발자, 팀원

---

## 📋 Prerequisites

### 필수 소프트웨어
- **Node.js:** 18.x 이상 (권장: 20.x LTS)
- **npm:** 9.x 이상
- **Git:** 최신 버전
- **IDE:** VS Code (권장)

### 설치 확인
```bash
node --version   # v20.x.x
npm --version    # 9.x.x
git --version    # 2.x.x
```

---

## 🚀 Initial Setup

### 1. Repository Clone
```bash
git clone https://github.com/your-org/tee_up.git
cd tee_up
```

### 2. 의존성 설치

#### Frontend
```bash
cd web
npm install
```

#### Backend
```bash
cd ../api
npm install
```

### 3. 환경 변수 설정

#### Frontend 환경 변수
```bash
cd web
cp .env.example .env.local
```

`.env.local` 파일을 열어 다음 값을 설정:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Backend 환경 변수
```bash
cd ../api
cp .env.example .env
```

`.env` 파일을 열어 다음 값을 설정:
```bash
PORT=5000
NODE_ENV=development
```

### 4. 개발 서버 시작

#### Terminal 1: Frontend
```bash
cd web
npm run dev
```
✅ Frontend: http://localhost:3000

#### Terminal 2: Backend
```bash
cd api
npm start
```
✅ Backend: http://localhost:5000/api/profiles

### 5. 설치 확인
브라우저에서 http://localhost:3000 접속하여 홈페이지가 정상적으로 로딩되는지 확인합니다.

---

## 🛠 IDE Setup (VS Code)

### 권장 확장 프로그램
다음 확장 프로그램을 설치하세요:

1. **ESLint** (`dbaeumer.vscode-eslint`)
   - JavaScript/TypeScript 린팅

2. **Prettier** (`esbenp.prettier-vscode`)
   - 코드 포매팅

3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
   - Tailwind 클래스 자동완성

4. **TypeScript Vue Plugin (Volar)** (`Vue.volar`)
   - TypeScript 지원 강화

5. **GitLens** (`eamodio.gitlens`)
   - Git 히스토리 시각화

### VS Code 설정
`.vscode/settings.json` 파일을 생성하고 다음 설정을 추가:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["className\\s*=\\s*['\"`]([^'\"`]*)['\"`]", "([^\\s]+)"]
  ]
}
```

---

## 📁 Project Structure

```
tee_up/
├── .agent/                # Claude workflow 파일
│   └── workflows/
├── .claude/               # Claude 설정
│   └── settings.local.json
├── web/                   # Next.js 프론트엔드
│   ├── src/
│   │   └── app/
│   ├── package.json
│   └── .env.local
├── api/                   # Express.js 백엔드
│   ├── src/
│   ├── package.json
│   └── .env
├── business/              # 비즈니스 문서
├── specs/                 # 기술 명세서
├── guides/                # 개발 가이드
├── CONTEXT.md             # 시스템 컨텍스트
└── README.md              # 프로젝트 개요
```

---

## 🔧 Troubleshooting

### 포트가 이미 사용 중인 경우

#### macOS/Linux
```bash
# 포트 3000 프로세스 종료
lsof -ti:3000 | xargs kill -9

# 포트 5000 프로세스 종료
lsof -ti:5000 | xargs kill -9
```

#### Windows
```bash
# 포트 3000 프로세스 찾기
netstat -ano | findstr :3000

# 프로세스 종료 (PID는 위 명령어 결과에서 확인)
taskkill /PID <PID> /F
```

### 모듈을 찾을 수 없는 경우
```bash
# 캐시 삭제 및 재설치
rm -rf node_modules package-lock.json
npm install
```

### TypeScript 에러
```bash
# TypeScript 버전 확인
npx tsc --version

# 타입 체크
npx tsc --noEmit
```

### Next.js 빌드 에러
```bash
# .next 캐시 삭제
rm -rf .next

# 재빌드
npm run build
```

---

## 🧪 Testing Setup (Phase 2)

### Jest + React Testing Library
```bash
cd web
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### Playwright (E2E)
```bash
cd web
npm install --save-dev @playwright/test
npx playwright install
```

---

## 🔐 Git Configuration

### Git Hooks (선택사항)
Husky를 사용하여 커밋 전 자동 검사:

```bash
cd web
npm install --save-dev husky lint-staged
npx husky install
```

`.husky/pre-commit` 파일 생성:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npx tsc --noEmit
```

---

## 📚 Next Steps

1. **문서 읽기**
   - [CONTEXT.md](../CONTEXT.md) - 시스템 컨텍스트
   - [plan.md](./plan.md) - 개발 로드맵
   - [CLAUDE_GUIDE.md](./CLAUDE_GUIDE.md) - Claude 활용 가이드

2. **Workflow 활용**
   - `/dev-server` - 개발 서버 시작
   - `/create-page` - 새 페이지 생성
   - `/create-component` - 컴포넌트 생성

3. **첫 작업 시작**
   - `plan.md`에서 현재 진행 중인 작업 확인
   - 작업 브랜치 생성: `git checkout -b feature/your-feature`
   - 개발 시작!

---

## 💡 Tips

### 빠른 명령어
```bash
# Frontend + Backend 동시 실행 (tmux 사용)
tmux new-session -d -s teeup 'cd web && npm run dev'
tmux split-window -h 'cd api && npm start'
tmux attach -t teeup
```

### 유용한 VS Code 단축키
- `Cmd/Ctrl + P`: 파일 빠르게 열기
- `Cmd/Ctrl + Shift + P`: 명령 팔레트
- `Cmd/Ctrl + B`: 사이드바 토글
- `Cmd/Ctrl + \``: 터미널 토글

---

**개발 환경 설정이 완료되었습니다! 🎉**

문제가 발생하면 팀 Slack 채널 `#teeup-dev`에 문의하세요.
