# SMVD CMS - 로컬 개발 환경 설정 가이드

## 개요
이 문서는 SMVD CMS 프로젝트를 로컬 환경에서 개발하기 위한 PostgreSQL 설정 및 실행 방법을 설명합니다.

---

## 1. 필수 소프트웨어

### 1.1 macOS Homebrew 설치
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 1.2 PostgreSQL 설치
```bash
brew install postgresql@16
```

### 1.3 설치 확인
```bash
psql --version
# Output: psql (PostgreSQL) 16.11 (Homebrew)
```

---

## 2. PostgreSQL 서비스 관리

### 2.1 PostgreSQL 시작
```bash
brew services start postgresql@16
```

### 2.2 PostgreSQL 중지
```bash
brew services stop postgresql@16
```

### 2.3 PostgreSQL 재시작
```bash
brew services restart postgresql@16
```

### 2.4 상태 확인
```bash
brew services list | grep postgresql
# Output: postgresql@16 started jeonminjun ~/Library/LaunchAgents/homebrew.mxcl.postgresql@16.plist
```

---

## 3. 데이터베이스 설정

### 3.1 데이터베이스 생성
```bash
createdb smvd_cms
```

### 3.2 데이터베이스 확인
```bash
psql -l | grep smvd_cms
```

### 3.3 데이터베이스 삭제 (필요시)
```bash
dropdb smvd_cms
```

---

## 4. 프로젝트 환경 설정

### 4.1 .env 파일 설정
프로젝트 루트 디렉토리에서:

```env
DATABASE_URL="postgresql://jeonminjun@localhost/smvd_cms"
NEXTAUTH_SECRET="smvd-cms-test-secret-key-2026-02-12-dev"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_UPLOAD_DIR="/uploads"
MAX_FILE_SIZE="10485760"
NEXT_PUBLIC_SITE_NAME="숙명여자대학교 시각영상디자인과"
NEXT_PUBLIC_SITE_DESCRIPTION="숙명여자대학교 시각영상디자인과 공식 웹사이트"
```

### 4.2 .env.local 파일 (로컬 재정의)
필요시 .env.local 파일을 생성하여 로컬 설정 추가:

```env
DATABASE_URL="postgresql://jeonminjun@localhost/smvd_cms"
NEXTAUTH_SECRET="your-local-secret"
```

---

## 5. Prisma 설정

### 5.1 마이그레이션 초기화 (첫 실행만)
```bash
npx prisma migrate dev --name init
```

### 5.2 마이그레이션 적용
```bash
npx prisma migrate deploy
```

### 5.3 Prisma 클라이언트 생성
```bash
npx prisma generate
```

### 5.4 Prisma Studio (DB 시각화 도구)
```bash
npx prisma studio
# http://localhost:5555 에서 브라우저로 접근
```

---

## 6. 개발 서버 실행

### 6.1 개발 서버 시작
```bash
cd /Users/jeonminjun/claude/SMVD_page/smvd-cms
npm run dev
```

### 6.2 서버 확인
브라우저에서 http://localhost:3000 접속

### 6.3 개발 서버 중지
```bash
pkill -f "npm run dev"
```

---

## 7. API 엔드포인트 테스트

### 7.1 네비게이션 API
```bash
curl http://localhost:3000/api/navigation
```

응답 예시:
```json
{
  "success": true,
  "data": [
    {"id": "nav-001", "label": "Home", "href": "/", "order": 1},
    {"id": "nav-002", "label": "About Major", "href": "/about", "order": 2}
  ],
  "message": "네비게이션을 조회했습니다"
}
```

### 7.2 푸터 API
```bash
curl http://localhost:3000/api/footer
```

### 7.3 페이지 API
```bash
curl http://localhost:3000/api/pages
```

---

## 8. 초기 데이터 로드

프로젝트 초기화 시 다음 데이터가 자동으로 로드됩니다:

### 8.1 관리자 계정
- Email: `admin@smvd.ac.kr`
- Role: `admin`

### 8.2 페이지
| slug | title | order |
|------|-------|-------|
| home | 홈페이지 | 1 |
| about | 학과소개 | 2 |
| curriculum | 교과과정 | 3 |
| people | 교수진 | 4 |
| work | 포트폴리오 | 5 |
| news | 뉴스/이벤트 | 6 |

### 8.3 네비게이션 메뉴
모두 활성화 상태이며 순서대로 정렬됨.

### 8.4 푸터
숙명여자대학교 시각영상디자인과 정보 포함

---

## 9. 데이터베이스 직접 접속

### 9.1 PostgreSQL 쉘로 접속
```bash
psql smvd_cms
```

### 9.2 자주 사용하는 명령어

#### 테이블 목록 조회
```sql
\dt
```

#### 페이지 테이블 조회
```sql
SELECT * FROM pages;
```

#### 네비게이션 조회
```sql
SELECT * FROM navigation ORDER BY "order";
```

#### 사용자 조회
```sql
SELECT * FROM users;
```

#### 테이블 구조 확인
```sql
\d pages
```

#### PostgreSQL 종료
```sql
\q
```

---

## 10. 문제 해결

### 10.1 "connection to server on socket failed" 오류
```bash
# PostgreSQL이 실행 중인지 확인
brew services list | grep postgresql

# 실행 중이 아니면 시작
brew services start postgresql@16
```

### 10.2 "database does not exist" 오류
```bash
# 데이터베이스가 존재하는지 확인
psql -l | grep smvd_cms

# 없으면 생성
createdb smvd_cms
```

### 10.3 "User `postgres` was denied access" 오류
```bash
# .env 파일의 DATABASE_URL 확인
cat .env | grep DATABASE_URL
# 형식: postgresql://jeonminjun@localhost/smvd_cms
```

### 10.4 Prisma 캐시 문제
```bash
# 캐시 정리
rm -rf node_modules/.prisma ~/.prisma

# Prisma 클라이언트 재생성
npx prisma generate
```

### 10.5 포트 3000 이미 사용 중
```bash
# 포트 사용 현황 확인
lsof -i :3000

# 프로세스 종료 (PID는 위 명령 결과에서 확인)
kill -9 <PID>
```

---

## 11. 개발 워크플로우

### 11.1 일반적인 개발 단계

1. PostgreSQL 실행 확인
   ```bash
   brew services list | grep postgresql
   ```

2. 프로젝트 디렉토리 이동
   ```bash
   cd /Users/jeonminjun/claude/SMVD_page/smvd-cms
   ```

3. 의존성 설치 (필요시)
   ```bash
   npm install
   ```

4. 개발 서버 시작
   ```bash
   npm run dev
   ```

5. 브라우저로 http://localhost:3000 접속

6. 코드 수정 후 자동 리로드 확인

---

## 12. 배포 전 체크리스트

- [ ] PostgreSQL 실행 확인
- [ ] 데이터베이스 생성 및 마이그레이션 완료
- [ ] .env 파일 설정 확인
- [ ] npm run dev로 서버 실행 확인
- [ ] http://localhost:3000 응답 확인
- [ ] API 엔드포인트 테스트 완료
- [ ] Prisma 클라이언트 생성 완료
- [ ] 모든 초기 데이터 로드 확인

---

## 13. 유용한 명령어 모음

```bash
# PostgreSQL 서비스 시작
brew services start postgresql@16

# 개발 서버 실행
npm run dev

# Prisma 마이그레이션
npx prisma migrate dev --name <name>

# Prisma Studio
npx prisma studio

# 데이터베이스 접속
psql smvd_cms

# API 테스트
curl http://localhost:3000/api/pages

# 프로세스 확인
ps aux | grep "npm run dev"

# 포트 사용 현황
lsof -i :3000
```

---

## 14. 문서 참고자료

- [Prisma 공식 문서](https://www.prisma.io/docs/)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [NextAuth.js 문서](https://next-auth.js.org/)

---

**마지막 업데이트**: 2026-02-12
**작성자**: Claude Code
**상태**: 운영 준비 완료
