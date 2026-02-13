# 🚀 빠른 시작 가이드 (Quick Start)

**Phase 1 완료 후 서버 실행까지 5분 안에 완료**

---

## 📝 필수 선행 조건

```bash
# Node.js 18+ 확인
node --version  # v18.0.0 이상

# PostgreSQL 설치 확인
psql --version  # PostgreSQL 14 이상
```

---

## 🔧 Step 1-5: 한 줄씩 차례로 실행

### 1️⃣ PostgreSQL 데이터베이스 생성

**macOS (Homebrew)**
```bash
# PostgreSQL 설치 (처음 한 번만)
brew install postgresql@16
brew services start postgresql@16

# 데이터베이스 생성
createdb smvd_cms

# 연결 확인
psql -d smvd_cms -c "\dt"
```

**Docker 사용**
```bash
docker run --name postgres-smvd \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=smvd_cms \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### 2️⃣ NEXTAUTH_SECRET 생성 및 설정

```bash
# 터미널에서 비밀번호 생성
openssl rand -base64 32
# 출력 예: "abc123def456..."

# 생성된 값을 복사하여 .env.local 수정
# smvd-cms/.env.local 파일을 열고
# NEXTAUTH_SECRET="생성된값_붙여넣기"
```

### 3️⃣ 프로젝트 폴더로 이동

```bash
cd smvd-cms
```

### 4️⃣ 데이터베이스 마이그레이션 실행

```bash
npm run db:migrate

# 또는 직접 실행
npx prisma migrate dev --name init
```

### 5️⃣ 초기 데이터 생성

```bash
npx prisma db seed

# 완료 메시지 확인
# ✅ Admin user created: admin@smvd.ac.kr
# ✅ Page created: home
# ... 등등
```

---

## ✨ 개발 서버 시작

```bash
npm run dev
```

**성공 메시지**:
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.3s
```

---

## 🌐 웹사이트 확인

| URL | 설명 |
|-----|------|
| **http://localhost:3000** | 홈페이지 (공개) |
| **http://localhost:3000/about** | 학과소개 |
| **http://localhost:3000/admin/login** | 관리자 로그인 |

---

## 🔐 관리자 로그인

```
이메일:  admin@smvd.ac.kr
비밀번호: admin123
```

**로그인 후**: http://localhost:3000/admin/dashboard

---

## 📊 데이터베이스 확인 (선택)

```bash
# Prisma Studio 열기 (시각적 데이터 관리)
npm run db:studio

# http://localhost:5555 에서 확인
```

**생성된 데이터**:
- ✅ Users: admin@smvd.ac.kr
- ✅ Pages: home, about, curriculum, people, work, news
- ✅ Navigation: 6개 메뉴
- ✅ Footer: 기본 정보

---

## 🛑 문제 해결

### PostgreSQL 연결 오류
```bash
# PostgreSQL 상태 확인
brew services list

# PostgreSQL 다시 시작
brew services restart postgresql@16

# 또는 Docker 사용
docker ps  # 컨테이너 실행 확인
```

### PORT 3000 이미 사용 중
```bash
# 다른 포트로 실행
npm run dev -- -p 3001
```

### 마이그레이션 오류
```bash
# 마이그레이션 초기화 (경고: 데이터 삭제)
npx prisma migrate reset
npx prisma db seed
```

---

## 📚 다음 단계

1. **Phase 2**: 인증 시스템 구현
   - NextAuth 설정
   - 관리자 대시보드

2. **Phase 3**: API 구현
   - 페이지 관리
   - 섹션 CRUD
   - 이미지 업로드

3. **Phase 4**: 공개 페이지
   - 홈페이지
   - 학과소개 등

---

## 📖 자세한 문서

- **전체 계획**: [계획 문서](../../../.claude/plans/vast-zooming-bentley.md)
- **설정 가이드**: [SETUP.md](./SETUP.md)
- **Phase 1 완료**: [PHASE_1_COMPLETE.md](./PHASE_1_COMPLETE.md)
- **프로젝트 정보**: [README.md](./README.md)

---

## ⏱️ 소요 시간

- PostgreSQL 설정: 2-5분
- 마이그레이션: 1-2분
- Seed 실행: 1분
- **총소요 시간: 5-10분**

---

**준비 완료!** 위의 단계를 따라 진행하면 **5-10분 안에 개발 서버**가 실행됩니다.

질문이 있으면 [SETUP.md](./SETUP.md)를 참고하세요.
