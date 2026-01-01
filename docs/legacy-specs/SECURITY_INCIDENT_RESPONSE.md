# Security Incident Response: Git History Cleanup

민감한 데이터가 Git 히스토리에 커밋된 경우 완전한 제거를 위한 가이드입니다.

## ⚠️ 중요 사전 조치

1. **즉시 자격 증명 무효화**: 노출된 API 키, 비밀번호, 토큰을 **먼저** 무효화/재발급
2. **팀 공지**: 모든 팀원에게 로컬 리포지토리 삭제 후 재클론 필요 안내
3. **백업**: 작업 전 리포지토리 전체 백업

```bash
# 백업 생성
cp -r /path/to/repo /path/to/repo-backup-$(date +%Y%m%d)
```

---

## 방법 1: git-filter-repo (권장)

가장 빠르고 안전한 방법입니다.

### 설치

```bash
# macOS
pip3 install git-filter-repo

# Ubuntu/Debian
sudo apt install git-filter-repo

# 또는 pip
pip install git-filter-repo
```

### 특정 파일 완전 제거

```bash
# 단일 파일 제거
git filter-repo --path web/.env.test --invert-paths --force

# 여러 파일 제거
git filter-repo --path .env --path web/.env.test --path api/.env --invert-paths --force

# 디렉토리 제거
git filter-repo --path .claude/ --path .specify/ --invert-paths --force

# 패턴으로 제거 (예: 모든 .env 파일)
git filter-repo --path-glob '*.env' --invert-paths --force
git filter-repo --path-glob '**/.env.*' --invert-paths --force
```

### 특정 문자열(비밀키) 제거

```bash
# 파일에서 특정 문자열 교체
git filter-repo --replace-text <(echo 'ACTUAL_SECRET_KEY==>REDACTED') --force

# expressions.txt 파일 사용
cat > expressions.txt << 'EOF'
regex:sk_live_[a-zA-Z0-9]{24}==>REDACTED_STRIPE_KEY
regex:eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*==>REDACTED_JWT
literal:password123==>REDACTED
EOF

git filter-repo --replace-text expressions.txt --force
```

### 원격 저장소 업데이트

```bash
# 원격 URL 재설정 (filter-repo가 제거함)
git remote add origin https://github.com/ORG/REPO.git

# Force push (모든 브랜치 + 태그)
git push origin --force --all
git push origin --force --tags
```

---

## 방법 2: BFG Repo-Cleaner (대안)

대용량 파일이나 특정 패턴에 적합합니다.

### 설치

```bash
# macOS
brew install bfg

# 또는 직접 다운로드
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar
alias bfg='java -jar bfg-1.14.0.jar'
```

### 사용

```bash
# 파일 삭제
bfg --delete-files .env.test

# 폴더 삭제
bfg --delete-folders .claude

# 텍스트 교체 (passwords.txt에 비밀 목록)
bfg --replace-text passwords.txt

# 클린업
git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

---

## 방법 3: git filter-branch (레거시)

> ⚠️ 느리고 오류 가능성 있음. git-filter-repo 사용 권장.

```bash
# 단일 파일 제거
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch web/.env.test' \
  --prune-empty --tag-name-filter cat -- --all

# 클린업
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

---

## GitHub 특별 조치

### 캐시 무효화 요청

GitHub는 force push 후에도 커밋을 일시적으로 캐시합니다.

1. **GitHub Support 연락**: https://support.github.com/contact
2. **요청 내용**:
   - 리포지토리 URL
   - 제거할 커밋 SHA 목록
   - 민감 데이터 노출 여부 설명

### Pull Request 캐시

PR에 노출된 경우:
1. PR 닫기
2. 연관 브랜치 삭제
3. GitHub Support에 PR 캐시 삭제 요청

---

## 체크리스트

### 사전 작업
- [ ] 노출된 모든 자격 증명 무효화
- [ ] 새 자격 증명 발급
- [ ] 팀원 공지
- [ ] 리포지토리 백업

### 히스토리 정리
- [ ] git-filter-repo 설치
- [ ] 민감 파일/문자열 제거
- [ ] 로컬에서 검증 (`git log --all -- FILENAME` 결과 없음 확인)
- [ ] Force push

### 사후 작업
- [ ] 모든 팀원 로컬 리포지토리 재클론
- [ ] GitHub Support에 캐시 삭제 요청 (필요시)
- [ ] .gitignore 업데이트 확인
- [ ] CI/CD 환경변수 업데이트
- [ ] 보안 감사 로그 작성

---

## 현재 프로젝트 적용 예시

### 이미 커밋된 민감 파일 제거

```bash
# 1. 사전 조치: Supabase 키 재발급 필수!
#    https://app.supabase.com/project/[PROJECT_ID]/settings/api

# 2. git-filter-repo 설치
pip3 install git-filter-repo

# 3. 민감 파일 제거
git filter-repo \
  --path web/.env.test \
  --path .claude/ \
  --path .specify/ \
  --invert-paths \
  --force

# 4. 원격 저장소 재연결 및 push
git remote add origin https://github.com/Prometheus-P/tee-up.git
git push origin --force --all
git push origin --force --tags

# 5. 모든 팀원에게 안내
# "로컬 리포지토리를 삭제하고 새로 clone 해주세요"
```

### Supabase 키 교체 (필수)

```bash
# 1. Supabase 대시보드에서 새 anon key 발급
# 2. .env.local 업데이트
# 3. 배포 환경 변수 업데이트 (Vercel, etc.)
# 4. 기존 키 무효화 확인
```

---

## 참고 자료

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [git-filter-repo documentation](https://htmlpreview.github.io/?https://github.com/newren/git-filter-repo/blob/docs/html/git-filter-repo.html)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [Supabase key rotation](https://supabase.com/docs/guides/platform/going-into-prod#security)
