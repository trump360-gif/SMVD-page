# News Data Mapping - 10 News Items + 1 Detail

---

## 1. 데이터 소스 파일 목록

| 파일 | 역할 | 데이터 수 |
|------|------|-----------|
| `src/components/public/news/NewsEventArchive.tsx` | 뉴스 목록 (10개 아이템) | 10 |
| `src/components/public/news/NewsEventDetailContent.tsx` | 뉴스 상세 (1개 상세 데이터) | 1 |

---

## 2. NewsEventArchive - 10개 뉴스 아이템 완전 매핑

### 아이템 #1
| 필드 | 값 |
|------|-----|
| id | `'1'` |
| category | `'Notice'` |
| date | `'2025-01-05'` |
| title | `'미술대학 2024년도 학생경비 집행내역 공개'` |
| description | `''` (빈 문자열) |
| image | `/Group-27.svg` |

### 아이템 #2
| 필드 | 값 |
|------|-----|
| id | `'2'` |
| category | `'Notice'` |
| date | `'2025-01-05'` |
| title | `'디자인학과(박사) 2024년도 학생경비 집행내역 공개'` |
| description | `''` |
| image | `/Group-27.svg` |

### 아이템 #3
| 필드 | 값 |
|------|-----|
| id | `'3'` |
| category | `'Notice'` |
| date | `'2025-01-05'` |
| title | `'시각영상디자인학과(석사) 2024년도 학생경비 집행내역 공개'` |
| description | `''` |
| image | `/Group-27.svg` |

### 아이템 #4
| 필드 | 값 |
|------|-----|
| id | `'4'` |
| category | `'Notice'` |
| date | `'2025-01-05'` |
| title | `'시각영상디자인학과 2024년도 학생경비 집행내역 공개'` |
| description | `''` |
| image | `/Group-27.svg` |

### 아이템 #5 (상세 페이지 있음)
| 필드 | 값 |
|------|-----|
| id | `'5'` |
| category | `'Event'` |
| date | `'2025-01-05'` |
| title | `'2024 시각·영상디자인과 졸업전시회'` |
| description | `'이번 전시 주제인 "Ready, Set, Go!" KICK OFF는 들을 제기 한전을 넘어 새로운 도약을 준비하는 결심을 담고 있습니다...'` |
| image | `/images/news/Image-1.png` |

### 아이템 #6
| 필드 | 값 |
|------|-----|
| id | `'6'` |
| category | `'Event'` |
| date | `'2025-01-05'` |
| title | `'2024 시각·영상디자인과 동문의 밤'` |
| description | `'2024년 10월 28일, 백주년기념관 한상은 라운지에서 2024 시각·영상디자인과 동문의 밤 행사를 진행했습니다. 1부에는 동문 특강을, 2부에는 황순선 교수님의 서프라이즈 퇴임식을 진행했습니다...'` |
| image | `/images/news/Image.png` |

### 아이템 #7
| 필드 | 값 |
|------|-----|
| id | `'7'` |
| category | `'Notice'` |
| date | `'2025-01-05'` |
| title | `'학생경비 집행 내역'` |
| description | `''` |
| image | `/Group-27.svg` |

### 아이템 #8
| 필드 | 값 |
|------|-----|
| id | `'8'` |
| category | `'Notice'` |
| date | `'2025-01-05'` |
| title | `'[ 시각영상디자인과(박사) 2023 학생경비 집행내역 공개 ]'` |
| description | `''` |
| image | `/Group-27.svg` |

### 아이템 #9
| 필드 | 값 |
|------|-----|
| id | `'9'` |
| category | `'Notice'` |
| date | `'2025-01-05'` |
| title | `'[ 시각영상디자인과(석사) 2023 학생경비 집행내역 공개 ]'` |
| description | `''` |
| image | `/Group-27.svg` |

### 아이템 #10
| 필드 | 값 |
|------|-----|
| id | `'10'` |
| category | `'Notice'` |
| date | `'2025-01-05'` |
| title | `'[졸업] 재학생 졸업학점 이수완환 확인 및 과목 정리 실시'` |
| description | `''` |
| image | `/Group-27.svg` |

---

## 3. NewsEventDetailContent - 1개 상세 데이터

### 아이템 #5 상세 (유일한 상세 데이터)
| 필드 | 값 |
|------|-----|
| id | `'5'` |
| category | `'Event'` |
| date | `'2025-01-05'` |
| title | `'2024 시각·영상디자인과 졸업전시회'` |
| description | `''` |
| introTitle | `'2024 시각영상디자인과 졸업전시회'` |
| introText | (아래 참조 - 장문) |
| images.main | `/images/work-detail/Rectangle 240652481.png` |
| images.centerLeft | `/images/work-detail/Rectangle 240652482.png` |
| images.centerRight | `/images/work-detail/Rectangle 240652483.png` |
| images.bottomLeft | `/images/work-detail/Rectangle 240652486.png` |
| images.bottomCenter | `/images/work-detail/Rectangle 240652485.png` |
| images.bottomRight | `/images/work-detail/Rectangle 240652484.png` |

**introText (원문 보존 필수):**
```
이번 전시 주제인 'Ready, Set, Go!' KICK OFF는 틀을 깨고 한계를 넘어 새로운 도약을 준비하는 결심을 담아 진행되었습니다.
필드를 넘어서 더 넓은 세계로 나아가는 여정을 함께해주신 교수님들과 관객 분들께 감사 인사를 전합니다.
```

---

## 4. 카테고리 분류

### 카테고리별 분포
| 카테고리 | 개수 | 아이템 ID |
|---------|------|----------|
| Notice | 8 | 1, 2, 3, 4, 7, 8, 9, 10 |
| Event | 2 | 5, 6 |
| Awards | 0 | (없음) |
| Recruiting | 0 | (없음) |

### 필터 카테고리 (NewsEventArchive + NewsEventDetailContent 공통)
`['ALL', 'Notice', 'Event', 'Awards', 'Recruiting']`

---

## 5. 이미지 경로 전체 목록

### 썸네일 이미지
| 이미지 경로 | 사용처 | 비고 |
|-----------|--------|------|
| `/Group-27.svg` | Notice 아이템 8개 (id: 1,2,3,4,7,8,9,10) | SVG 플레이스홀더 |
| `/images/news/Image-1.png` | Event #5 졸업전시회 | 실제 이미지 |
| `/images/news/Image.png` | Event #6 동문의 밤 | 실제 이미지 |

### 상세 갤러리 이미지 (아이템 #5 전용 - 6개)
```
/images/work-detail/Rectangle 240652481.png  (main - 전체 너비, 765px 높이)
/images/work-detail/Rectangle 240652482.png  (centerLeft - 670x670px)
/images/work-detail/Rectangle 240652483.png  (centerRight - 670x670px)
/images/work-detail/Rectangle 240652486.png  (bottomLeft - 440x440px)
/images/work-detail/Rectangle 240652485.png  (bottomCenter - 440x440px)
/images/work-detail/Rectangle 240652484.png  (bottomRight - 440x440px)
```

---

## 6. 갤러리 레이아웃 구조 (상세 페이지)

```
+---------------------------------------------+
|                 main image                   |  전체 너비, 높이 765px
|             (1360px x 765px)                 |
+---------------------------------------------+

+---------------------+  +---------------------+
|    centerLeft       |  |    centerRight      |  2열, 각 670x670px
|   (670 x 670px)    |  |   (670 x 670px)     |
+---------------------+  +---------------------+

+-----------+  +-----------+  +-----------+
| bottomLeft|  |bottomCenter|  |bottomRight|   3열, 각 440x440px
| (440x440) |  | (440x440)  |  | (440x440) |
+-----------+  +-----------+  +-----------+
```

---

## 7. DB 필드 매핑 (NewsItem -> NewsEvent 모델)

### 목록 데이터 (NewsEventArchive)

| 하드코딩 필드 | DB 필드 | DB 타입 | 비고 |
|-------------|--------|--------|------|
| id | id | String (cuid) | 자동 생성 |
| - | slug | String (unique) | 기존 id 값: '1'~'10' |
| category | category | String | 'Notice', 'Event', 'Awards', 'Recruiting' |
| date | publishedAt | DateTime | '2025-01-05' -> DateTime |
| title | title | String | 그대로 |
| description | excerpt | String? | 목록에 표시되는 요약 (빈 문자열은 null) |
| image | thumbnailImage | String | 썸네일 이미지 경로 |
| - | order | Int | 표시 순서 (1~10) |
| - | published | Boolean | 공개 여부 |

### 상세 데이터 (NewsEventDetailContent) - content JSON

| 하드코딩 필드 | DB 필드 (content JSON 내부) | 비고 |
|-------------|--------------------------|------|
| introTitle | content.introTitle | 상세 페이지 제목 (없으면 title 사용) |
| introText | content.introText | 본문 텍스트 |
| images.main | content.gallery.main | 메인 이미지 |
| images.centerLeft | content.gallery.centerLeft | 중단 좌측 |
| images.centerRight | content.gallery.centerRight | 중단 우측 |
| images.bottomLeft | content.gallery.bottomLeft | 하단 좌측 |
| images.bottomCenter | content.gallery.bottomCenter | 하단 중앙 |
| images.bottomRight | content.gallery.bottomRight | 하단 우측 |

---

## 8. 특이사항 및 주의점

1. **Notice 아이템은 상세 페이지가 없음**: 8개 Notice는 description이 빈 문자열이고 상세 데이터도 없음
2. **Event 아이템 #5만 상세 데이터 있음**: #6 동문의 밤은 상세 데이터가 없음
3. **플레이스홀더 이미지**: Notice 8개는 모두 `/Group-27.svg` 사용 (기본 아이콘)
4. **날짜 통일**: 모든 아이템의 날짜가 `'2025-01-05'` (테스트 데이터일 가능성)
5. **갤러리 이미지 경로 주의**: 상세 이미지는 `/images/work-detail/` 폴더에 있음 (news가 아님!)
6. **introTitle vs title 차이**: #5의 title은 `'2024 시각.영상디자인과 졸업전시회'`, introTitle은 `'2024 시각영상디자인과 졸업전시회'` (가운뎃점 차이)
7. **상세 갤러리 레이아웃이 고정 구조**: main(1장) + center(2장) + bottom(3장) = 6장 고정, 다른 레이아웃도 지원 가능하도록 유연한 갤러리 구조 필요
8. **카테고리 필터**: 목록 / 상세 페이지 모두 카테고리 필터 탭이 있음

---

## 9. 기존 Prisma NewsEvent 모델과의 차이

### 현재 모델 (schema.prisma)
```prisma
model NewsEvent {
  id          String    @id @default(cuid())
  title       String
  content     String       // <- 단순 문자열
  excerpt     String?
  type        String    @default("news")  // "news" or "event"
  mediaIds    Json?
  eventDate   DateTime?
  published   Boolean   @default(true)
  order       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### 필요한 변경사항
1. `content` -> `content Json?` (갤러리 구조를 JSON으로 저장)
2. `type` -> `category String` (Notice/Event/Awards/Recruiting)
3. `thumbnailImage String` 추가 (썸네일 이미지 경로)
4. `slug String @unique` 추가 (URL용)
5. `publishedAt DateTime` 추가 (표시 날짜)
6. `excerpt` 유지 (목록 설명)
