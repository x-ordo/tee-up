# 프로젝트 진행 Quick Reference

> **목적:** 프로젝트를 순차적으로 진행하기 위한 빠른 참조 가이드  
> **사용법:** 각 단계를 순서대로 따라가세요

---

## 🚀 신규 프로젝트 시작하기

### Step 1: 프로젝트 초기화 (Day 1)

```bash
# 1. Git 저장소 생성
git init
git remote add origin [repository-url]

# 2. 디렉토리 구조 생성
mkdir -p .agent/workflows .claude business specs guides scripts
mkdir -p [frontend-dir] [backend-dir]

# 3. .gitignore 생성
# (TEE:UP의 .gitignore를 템플릿으로 사용)
```

### Step 2: 핵심 문서 작성 (Day 1-2)

**우선순위 순서:**

#### 1. CONTEXT.md (필수 - 2시간)
```
Claude에게 요청:
"다음 정보를 바탕으로 CONTEXT.md를 작성해주세요:
- 프로젝트명: [이름]
- 목적: [설명]
- 타겟 사용자: [페르소나]
- 기술 스택: [스택]
- 주요 기능: [기능 목록]"
```

#### 2. README.md (필수 - 1시간)
```
Claude에게 요청:
"CONTEXT.md를 참고하여 README.md를 작성해주세요.
다음을 포함해주세요:
- 프로젝트 개요
- 빠른 시작 가이드
- 기술 스택
- 디렉토리 구조"
```

#### 3. business/PRD.md (필수 - 3시간)
```
Claude에게 요청:
"다음 요구사항을 바탕으로 PRD.md를 작성해주세요:
- 문제 정의: [설명]
- 목표: [목표]
- 사용자 스토리: [스토리]
- 우선순위: [P0/P1/P2]"
```

### Step 3: 기술 명세서 작성 (Week 1)

#### 4. specs/API_SPEC.md (2시간)
```
Claude에게 요청:
"PRD.md를 참고하여 API_SPEC.md를 작성해주세요.
RESTful 규칙을 따르고, 모든 엔드포인트를 정의해주세요."
```

#### 5. specs/DATA_MODEL.md (2시간)
```
Claude에게 요청:
"API_SPEC.md를 참고하여 DATA_MODEL.md를 작성해주세요.
ERD 다이어그램과 테이블 정의를 포함해주세요."
```

#### 6. specs/DESIGN_SYSTEM.md (3시간)
```
Claude에게 요청:
"다음 디자인 철학을 바탕으로 DESIGN_SYSTEM.md를 작성해주세요:
- 색상 팔레트: [색상]
- 타이포그래피: [폰트]
- 컴포넌트: [목록]"
```

### Step 4: 개발 가이드 작성 (Week 1)

#### 7. guides/DEVELOPMENT_SETUP.md (1시간)
```
Claude에게 요청:
"개발 환경 설정 가이드를 작성해주세요.
Prerequisites, 설치 과정, 문제 해결을 포함해주세요."
```

#### 8. guides/CODING_CONVENTIONS.md (1시간)
```
Claude에게 요청:
"TypeScript, React, CSS 코딩 컨벤션을 작성해주세요.
TEE:UP의 CODING_CONVENTIONS.md를 참고해주세요."
```

### Step 5: Workflow 설정 (Week 1)

#### 9. .agent/workflows/ (2시간)
```
다음 워크플로우 파일 생성:
- dev-server.md
- create-page.md
- create-component.md
- create-api-endpoint.md
- deploy.md

TEE:UP의 워크플로우를 템플릿으로 사용
```

### Step 6: 환경 설정 (Week 1)

```bash
# 10. 환경 변수 템플릿
touch [frontend]/.env.example
touch [backend]/.env.example

# 11. Claude 권한 설정
cat > .claude/settings.local.json << 'EOF'
{
  "permissions": {
    "allow": [
      "Bash(npm:*)",
      "Bash(git status:*)",
      "Bash(ls:*)"
    ],
    "deny": [
      "Bash(rm -rf /:*)",
      "Bash(sudo:*)"
    ],
    "ask": [
      "Bash(git commit:*)",
      "Bash(git push:*)"
    ]
  }
}
EOF
```

---

## 📝 기능 개발 프로세스

### Phase 1: Planning (계획)

```
1. 요구사항 정의
   - 사용자 스토리 작성
   - 우선순위 결정 (P0/P1/P2)

2. 설계
   - API 엔드포인트 설계
   - 데이터 모델 설계
   - UI 컴포넌트 설계

3. Implementation Plan 작성
   Claude에게 요청:
   "다음 기능의 Implementation Plan을 작성해주세요:
   - 기능: [설명]
   - API: [엔드포인트]
   - UI: [컴포넌트]
   
   CONTEXT.md와 API_SPEC.md를 참고해주세요."
```

### Phase 2: Implementation (구현)

```
1. Backend 구현
   Claude에게 요청:
   "/create-api-endpoint 워크플로우를 따라
   [엔드포인트]를 구현해주세요.
   
   요구사항:
   - API_SPEC.md 준수
   - ERROR_HANDLING.md 패턴 적용
   - TypeScript strict mode"

2. Frontend 구현
   Claude에게 요청:
   "/create-component 워크플로우를 따라
   [컴포넌트]를 생성해주세요.
   
   요구사항:
   - CODING_CONVENTIONS.md 준수
   - Design System 색상 사용
   - Server Component 우선"

3. 통합
   - API 연동
   - 에러 처리
   - 로딩 상태
```

### Phase 3: Verification (검증)

```
1. 코드 리뷰
   Claude에게 요청:
   "CODE_REVIEW_CHECKLIST.md를 참고하여
   현재 변경사항을 검토해주세요."

2. 테스트
   - 단위 테스트 작성
   - 통합 테스트 작성
   - 브라우저 테스트

3. 배포 준비
   Claude에게 요청:
   "/deploy 워크플로우를 실행해주세요."
```

---

## 🔄 일일 개발 루틴

### 아침 (9:00 - 10:00)

```
1. Git pull
   git pull origin main

2. 오늘의 작업 확인
   - plan.md 또는 task.md 확인
   - 우선순위 파악

3. 개발 서버 시작
   Claude에게: "/dev-server"
```

### 개발 시간 (10:00 - 18:00)

```
1. 기능 개발
   - Implementation Plan 참고
   - Workflow 활용
   - 단계별 커밋

2. 코드 리뷰
   - 자가 검토 (CODE_REVIEW_CHECKLIST.md)
   - PR 생성
   - 피드백 반영

3. 문서 업데이트
   - 변경사항 문서화
   - API_SPEC.md 업데이트
   - README.md 업데이트
```

### 마무리 (18:00 - 19:00)

```
1. 작업 정리
   - 미완성 작업 커밋 (WIP)
   - task.md 업데이트

2. 내일 계획
   - 우선순위 정리
   - 블로커 확인

3. Git push
   git push origin [branch]
```

---

## 💡 Claude 활용 팁

### 효과적인 프롬프트 패턴

#### 패턴 1: 문서 참조
```
[문서명]을 참고하여 [작업]을 수행해주세요.

예시:
"API_SPEC.md를 참고하여 프로필 조회 API를 구현해주세요."
```

#### 패턴 2: Workflow 활용
```
/[workflow-name] 워크플로우를 따라 [작업]을 수행해주세요.

예시:
"/create-component 워크플로우를 따라 UserCard를 생성해주세요."
```

#### 패턴 3: 단계별 검증
```
다음 단계를 순서대로 수행해주세요:
1. [단계 1]
2. [단계 2]
3. [단계 3]
각 단계마다 결과를 확인해주세요.

예시:
"다음 단계를 순서대로 수행해주세요:
1. 컴포넌트 생성
2. TypeScript 타입 체크
3. Lint 검사
4. 브라우저에서 확인"
```

#### 패턴 4: 제약사항 명시
```
[작업]을 수행해주세요.

요구사항:
- [요구사항 1]
- [요구사항 2]
- [요구사항 3]

예시:
"LoginForm 컴포넌트를 생성해주세요.

요구사항:
- Client Component 사용
- Form validation 포함
- ERROR_HANDLING.md 패턴 적용
- Design System 색상 사용"
```

---

## 📋 체크리스트

### 프로젝트 시작 체크리스트

```
□ Git 저장소 생성
□ 디렉토리 구조 생성
□ .gitignore 생성
□ CONTEXT.md 작성
□ README.md 작성
□ INDEX.md 작성
□ PRD.md 작성
□ API_SPEC.md 작성
□ DATA_MODEL.md 작성
□ DESIGN_SYSTEM.md 작성
□ DEVELOPMENT_SETUP.md 작성
□ CODING_CONVENTIONS.md 작성
□ Workflow 파일 생성
□ 환경 변수 템플릿 생성
□ 개발 환경 설정 완료
```

### 기능 개발 체크리스트

```
□ 요구사항 정의
□ Implementation Plan 작성
□ API 설계 (필요시)
□ UI 설계 (필요시)
□ Backend 구현
□ Frontend 구현
□ 에러 처리 구현
□ 테스트 작성
□ 코드 리뷰
□ 문서 업데이트
□ 배포 준비
```

### 배포 전 체크리스트

```
□ 빌드 성공
□ TypeScript 타입 체크 통과
□ Lint 검사 통과
□ 테스트 통과
□ 환경 변수 확인
□ 보안 검토
□ 성능 확인 (Lighthouse > 90)
□ 문서 업데이트
□ CHANGELOG 작성
```

---

## 🔗 참고 자료

### 내부 문서
- [PROJECT_METHODOLOGY.md](./PROJECT_METHODOLOGY.md) - 상세 방법론
- [CONTEXT.md](../CONTEXT.md) - 시스템 컨텍스트
- [INDEX.md](../INDEX.md) - 문서 인덱스

### 템플릿
- [CONTEXT.md 템플릿](./PROJECT_METHODOLOGY.md#a-문서-템플릿)
- [Workflow 템플릿](./PROJECT_METHODOLOGY.md#b-workflow-템플릿)

---

**이 가이드를 따라 프로젝트를 체계적으로 진행하세요! 🚀**
