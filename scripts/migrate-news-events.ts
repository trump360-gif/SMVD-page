/**
 * News & Event 마이그레이션 스크립트
 * - 원본: https://smvd.sookmyung.ac.kr/?page_id=479
 * - 이미지 다운로드 + DB 생성/업데이트
 *
 * 실행: npx tsx scripts/migrate-news-events.ts
 */

import { PrismaClient, Prisma } from '../src/generated/prisma';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const prisma = new PrismaClient();

// ========== 이미지 다운로드 유틸리티 ==========

const IMAGE_DIR = path.join(process.cwd(), 'public/images/news/events');

async function downloadImage(url: string, filename: string): Promise<string> {
  const filepath = path.join(IMAGE_DIR, filename);
  const publicPath = `/images/news/events/${filename}`;

  if (fs.existsSync(filepath)) {
    console.log(`  [SKIP] ${filename} (이미 존재)`);
    return publicPath;
  }

  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, filename).then(resolve).catch(reject);
          return;
        }
      }

      if (res.statusCode !== 200) {
        console.log(`  [FAIL] ${filename} (HTTP ${res.statusCode})`);
        resolve(''); // 실패해도 진행
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`  [OK] ${filename}`);
        resolve(publicPath);
      });
      fileStream.on('error', (err) => {
        fs.unlinkSync(filepath);
        reject(err);
      });
    }).on('error', (err) => {
      console.log(`  [FAIL] ${filename}: ${err.message}`);
      resolve('');
    });
  });
}

// 첨부파일 다운로드 (xlsx 등)
const ATTACHMENT_DIR = path.join(process.cwd(), 'public/attachments/news');

async function downloadAttachment(url: string, filename: string): Promise<string> {
  if (!fs.existsSync(ATTACHMENT_DIR)) {
    fs.mkdirSync(ATTACHMENT_DIR, { recursive: true });
  }
  const filepath = path.join(ATTACHMENT_DIR, filename);
  const publicPath = `/attachments/news/${filename}`;

  if (fs.existsSync(filepath)) {
    console.log(`  [SKIP] ${filename} (이미 존재)`);
    return publicPath;
  }

  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          downloadAttachment(redirectUrl, filename).then(resolve).catch(reject);
          return;
        }
      }
      if (res.statusCode !== 200) {
        console.log(`  [FAIL] ${filename} (HTTP ${res.statusCode})`);
        resolve('');
        return;
      }
      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        const stats = fs.statSync(filepath);
        console.log(`  [OK] ${filename} (${(stats.size / 1024).toFixed(1)}KB)`);
        resolve(publicPath);
      });
      fileStream.on('error', (err) => {
        fs.unlinkSync(filepath);
        reject(err);
      });
    }).on('error', (err) => {
      console.log(`  [FAIL] ${filename}: ${err.message}`);
      resolve('');
    });
  });
}

// ========== Tiptap JSON 헬퍼 ==========

function text(str: string, marks?: Array<{ type: string }>): object {
  const node: Record<string, unknown> = { type: 'text', text: str };
  if (marks) node.marks = marks;
  return node;
}

function paragraph(...children: object[]): object {
  if (children.length === 0) return { type: 'paragraph' };
  return { type: 'paragraph', content: children };
}

function heading(level: number, str: string): object {
  return { type: 'heading', attrs: { level }, content: [text(str)] };
}

function image(src: string, alt: string): object {
  return { type: 'image', attrs: { src, alt, title: null } };
}

function bulletList(items: string[]): object {
  return {
    type: 'bulletList',
    content: items.map(item => ({
      type: 'listItem',
      content: [paragraph(text(item))],
    })),
  };
}

function doc(...children: object[]): object {
  return { type: 'doc', content: children };
}

function bold(str: string): object {
  return text(str, [{ type: 'bold' }]);
}

// ========== 게시물 데이터 정의 ==========

interface ArticleData {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  publishedAt: string;
  images: Array<{ url: string; filename: string; alt: string }>;
  attachmentUrl?: string;
  attachmentFilename?: string;
  buildContent: (imagePaths: string[]) => object | null;
}

// --- 그룹 A: 기존 게시물 업데이트 ---
const EXISTING_UPDATES: Array<{
  slug: string;
  category?: string;
  publishedAt?: string;
  excerpt?: string;
  images: Array<{ url: string; filename: string; alt: string }>;
  attachmentUrl?: string;
  attachmentFilename?: string;
  buildContent: (imagePaths: string[]) => object | null;
}> = [
  // A-1: 동문의 밤 2024
  {
    slug: '6',
    category: 'Event',
    publishedAt: '2024-10-28',
    excerpt: '백주년기념관 한상은 라운지에서 동문 특강과 황순선 교수님 퇴임식이 진행되었습니다.',
    images: [
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2024/11/KakaoTalk_20241108_130838730_05-2.jpg', filename: 'alumni-night-2024-01.jpg', alt: '2024 동문의 밤 행사' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2024/11/KakaoTalk_20241108_130838730_09-1.jpg', filename: 'alumni-night-2024-02.jpg', alt: '2024 동문의 밤 행사' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2024/11/%EB%8F%99%EB%AC%B8%EC%9D%98%EB%B0%A4-1024x769.jpg', filename: 'alumni-night-2024-03.jpg', alt: '2024 동문의 밤 단체사진' },
    ],
    buildContent: (imgs) => doc(
      heading(2, '2024 시각·영상디자인과 동문의 밤'),
      paragraph(bold('일시: '), text('2024년 10월 28일')),
      paragraph(bold('장소: '), text('백주년기념관 한상은 라운지')),
      paragraph(),
      heading(3, '1부: 동문 특강'),
      paragraph(text('동문 특강은 학문적 교류와 협력의 장으로, 학우들에게 실질적인 경험에서 우러나오는 조언을 전해주었습니다.')),
      ...(imgs[0] ? [image(imgs[0], '2024 동문의 밤 행사')] : []),
      paragraph(),
      heading(3, '2부: 황순선 교수님 서프라이즈 퇴임식'),
      paragraph(text('30년 동안 학과와 함께해 주신 교수님의 마지막을 축하하고 헌신에 대한 감사의 마음을 전하는 시간을 가졌습니다.')),
      ...(imgs[1] ? [image(imgs[1], '2024 동문의 밤 행사')] : []),
      paragraph(),
      paragraph(text('동문과 재학생이 함께하며 서로의 열정과 목표를 나누고, 시간의 경계를 넘어 소통을 이어갈 수 있는 뜻 깊은 시간이었습니다.')),
      ...(imgs[2] ? [image(imgs[2], '2024 동문의 밤 단체사진')] : []),
    ),
  },
  // A-3: 졸업학점 안내
  {
    slug: '10',
    category: 'Notice',
    publishedAt: '2024-03-01',
    excerpt: '2024학년도 1학기 재학생 졸업학점 이수현황 확인 및 과목 정리 안내',
    images: [],
    buildContent: () => doc(
      heading(2, '재학생 졸업학점 이수현황 확인 및 과목 정리 실시'),
      paragraph(bold('대상: '), text('현재 학기가 3학년 이상인 재학생')),
      paragraph(bold('기한: '), text('2024년 4월 15일(월)까지')),
      paragraph(),
      heading(3, '주요 업무'),
      bulletList([
        '연계전공/학생자율설계전공 중복과목 변경 (9학점 범위)',
        '코드쉐어 교과목 전공 간 이동',
      ]),
      paragraph(),
      heading(3, '절차'),
      paragraph(text('중복과목 변경 신청서를 작성하여 학사팀 이메일(haksa@sm.ac.kr)로 제출하고, 숙명포털 "졸업심사학점이수표"에서 확인해야 합니다.')),
    ),
  },
];

// --- 그룹 B: 신규 게시물 ---
const NEW_ARTICLES: ArticleData[] = [
  // ===== EVENT =====
  {
    slug: '7th-department-night',
    title: '제 7회 시각영상디자인과의 밤',
    category: 'Event',
    excerpt: '2년 만의 대면 모임, 80명 이상의 재학생과 26명의 동문 선배가 함께한 시간',
    publishedAt: '2022-12-14',
    images: [
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/02/IMG_3978-1024x768.jpg', filename: '7th-night-01.jpg', alt: '제7회 과의 밤 행사' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/02/IMG_3982-1024x768.jpg', filename: '7th-night-02.jpg', alt: '제7회 과의 밤 행사' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/02/IMG_3986-1024x768.jpg', filename: '7th-night-03.jpg', alt: '제7회 과의 밤 행사' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/02/IMG_3991-1024x768.jpg', filename: '7th-night-04.jpg', alt: '제7회 과의 밤 강연' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/02/IMG_3994-1024x768.jpg', filename: '7th-night-05.jpg', alt: '제7회 과의 밤 강연' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/02/IMG_4001-1024x768.jpg', filename: '7th-night-06.jpg', alt: '제7회 과의 밤 단체사진' },
    ],
    buildContent: (imgs) => doc(
      heading(2, '제 7회 시각영상디자인과의 밤'),
      paragraph(bold('일시: '), text('2022년 12월 14일 수요일')),
      paragraph(),
      paragraph(text('2022년 12월 14일 수요일 제 7회 시각영상디자인과의 밤을 진행했습니다.')),
      paragraph(text('2년 만의 대면 모임으로 진행되었으며, 80명 이상의 재학생과 26명의 동문 선배가 참석했습니다.')),
      paragraph(text('학생들은 한 해의 소회를 나누고, 다양한 분야에서 활동 중인 선배들의 강연을 듣고 질의응답을 진행하는 시간을 가졌습니다.')),
      ...imgs.filter(Boolean).map((img, i) => image(img, `제7회 과의 밤 ${i + 1}`)),
    ),
  },
  {
    slug: '4th-department-night',
    title: '제4회 시각・영상디자인과의 밤',
    category: 'Event',
    excerpt: '선배와의 만남 — 다양한 분야의 선배들과 이야기를 나누는 시간',
    publishedAt: '2019-12-03',
    images: [
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/night1.jpg', filename: '4th-night-01.jpg', alt: '제4회 과의 밤' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/night2.jpg', filename: '4th-night-02.jpg', alt: '제4회 과의 밤' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/night3.jpg', filename: '4th-night-03.jpg', alt: '제4회 과의 밤' },
    ],
    buildContent: (imgs) => doc(
      heading(2, '제4회 시각・영상디자인과의 밤'),
      paragraph(bold('일시: '), text('2019년 12월 3일')),
      paragraph(),
      paragraph(text('제4회 시각영상디자인과의 밤 – 선배와의 만남을 진행했습니다.')),
      paragraph(text('다양한 분야의 여러 선배들을 만나 이야기를 듣고 질문하고 답변을 받는 시간을 가졌습니다.')),
      ...imgs.filter(Boolean).map((img, i) => image(img, `제4회 과의 밤 ${i + 1}`)),
    ),
  },

  // ===== LECTURE =====
  {
    slug: '2022-winter-lecture',
    title: '2022-2 겨울방학 특강',
    category: 'Lecture',
    excerpt: 'CINEMA 4D Mograph 활용 모션 그래픽 / 타이포그래피 특강',
    publishedAt: '2023-01-30',
    images: [
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/02/KakaoTalk_Photo_2023-02-15-16-23-13-1024x1024.jpeg', filename: '2022-winter-01.jpg', alt: '겨울방학 특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/02/KakaoTalk_Photo_2023-02-15-16-23-20-976x1024.jpeg', filename: '2022-winter-02.jpg', alt: '겨울방학 특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/02/KakaoTalk_Photo_2023-02-15-16-40-38.jpeg', filename: '2022-winter-03.jpg', alt: '겨울방학 특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/02/KakaoTalk_Photo_2023-02-15-16-41-41-1024x526.jpeg', filename: '2022-winter-04.jpg', alt: '겨울방학 특강' },
    ],
    buildContent: (imgs) => doc(
      heading(2, '2022-2 겨울방학 특강'),
      paragraph(),
      heading(3, '1. CINEMA 4D Mograph 활용 모션 그래픽'),
      paragraph(bold('강사: '), text('김희수')),
      paragraph(bold('일정: '), text('2023.01.30 – 02.08 / 월, 수 13:00-16:00 / 3시간, 총 5회')),
      paragraph(bold('형태: '), text('실시간 온라인 강의')),
      paragraph(bold('정원: '), text('시각영상디자인과 제1전공자 재학생 중 선착순 20명')),
      ...(imgs[0] ? [image(imgs[0], 'CINEMA 4D 특강')] : []),
      ...(imgs[1] ? [image(imgs[1], 'CINEMA 4D 특강')] : []),
      paragraph(),
      heading(3, '2. 타이포그래피 특강'),
      paragraph(bold('강사: '), text('구자은')),
      paragraph(bold('일정: '), text('2023.01.31 – 02.10 / 화, 목, 금 10:00-13:00 / 3시간, 총 5회')),
      paragraph(bold('형태: '), text('실시간 온라인 강의')),
      paragraph(bold('정원: '), text('시각영상디자인과 제1전공자 재학생 중 선착순 20명')),
      ...(imgs[2] ? [image(imgs[2], '타이포그래피 특강')] : []),
      ...(imgs[3] ? [image(imgs[3], '타이포그래피 특강')] : []),
    ),
  },
  {
    slug: '2022-summer-lecture',
    title: '2022-1 여름방학 특강',
    category: 'Lecture',
    excerpt: '애프터이펙트 / CINEMA 4D / 마이크로 앤드 매크로 타이포그래피',
    publishedAt: '2022-07-21',
    images: [
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/02/KakaoTalk_Photo_2022-08-24-15-28-16-1024x584.png', filename: '2022-summer-01.png', alt: '여름방학 특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/02/KakaoTalk_Photo_2022-08-24-15-30-14-001-1-768x1024.jpeg', filename: '2022-summer-02.jpg', alt: '여름방학 특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/02/KakaoTalk_Photo_2022-08-24-15-30-15-002-1-768x1024.jpeg', filename: '2022-summer-03.jpg', alt: '여름방학 특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/02/KakaoTalk_Photo_2022-08-24-15-30-15-004-768x1024.jpeg', filename: '2022-summer-04.jpg', alt: '여름방학 특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/02/KakaoTalk_Photo_2022-08-24-15-30-15-005-1024x769.jpeg', filename: '2022-summer-05.jpg', alt: '여름방학 특강' },
    ],
    buildContent: (imgs) => doc(
      heading(2, '2022-1 여름방학 특강'),
      paragraph(),
      heading(3, '1. 애프터이펙트 디지털 영상 제작 심화과정'),
      paragraph(bold('강사: '), text('장다윤')),
      paragraph(bold('일정: '), text('2022.07.21 – 08.11 / 화, 목 10:30-12:30 / 2시간, 총 7회')),
      paragraph(bold('형태: '), text('실시간 온라인 강의 / 선착순 20명')),
      ...(imgs[0] ? [image(imgs[0], '애프터이펙트 특강')] : []),
      paragraph(),
      heading(3, '2. CINEMA 4D Mograph 활용 모션 그래픽'),
      paragraph(bold('강사: '), text('박도경')),
      paragraph(bold('일정: '), text('2022.08.06 – 08.21 / 토, 일 11:00-14:00 / 3시간, 총 6회')),
      paragraph(bold('형태: '), text('실시간 온라인 강의 / 선착순 20명')),
      ...(imgs[1] ? [image(imgs[1], 'CINEMA 4D 특강')] : []),
      ...(imgs[2] ? [image(imgs[2], 'CINEMA 4D 특강')] : []),
      paragraph(),
      heading(3, '3. 엠 & 엠: 마이크로 앤드 매크로 타이포그래피'),
      paragraph(bold('강사: '), text('김기창')),
      paragraph(bold('일정: '), text('2022.08.12 – 08.19 / 총 5회')),
      paragraph(bold('형태: '), text('대면 강의 / 선착순 20명')),
      ...(imgs[3] ? [image(imgs[3], '타이포그래피 특강')] : []),
      ...(imgs[4] ? [image(imgs[4], '타이포그래피 특강')] : []),
    ),
  },
  {
    slug: '2020-summer-lecture',
    title: '2020-1 여름방학 특강',
    category: 'Lecture',
    excerpt: 'CINEMA 4D / After Effects 실무 에센셜 / 실험적인 타이포그래피',
    publishedAt: '2020-08-03',
    images: [
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/typolecture.jpg', filename: '2020-summer-01.jpg', alt: '2020 여름방학 특강' },
    ],
    buildContent: (imgs) => doc(
      heading(2, '2020-1 여름방학 특강'),
      paragraph(),
      heading(3, '1. CINEMA 4D Mograph 활용 모션 그래픽'),
      paragraph(bold('강사: '), text('김수옥')),
      paragraph(text('다양한 오브젝트의 Mograph 컨트롤 방법과 모션 디자인 연구')),
      paragraph(bold('일정: '), text('2020.08.03 – 08.20 / 월, 목 10:00- / 3-4시간, 총 6회 / 실시간 온라인')),
      paragraph(),
      heading(3, '2. After Effects 실무 에센셜'),
      paragraph(bold('강사: '), text('윤영원')),
      paragraph(text('After Effects 기초에서 중급 사용자로 전환하기 위한 실무 테크닉 학습')),
      paragraph(bold('일정: '), text('2020.07.31 – 08.14 / 3시간, 총 6회 / 녹화 온라인 강의')),
      paragraph(),
      heading(3, '3. 실험적인 타이포그래피 – 앉다'),
      paragraph(bold('강사: '), text('김기창')),
      paragraph(text("'앉는다'는 행위를 바탕으로 다양한 타이포그래피 표현과 결과물 제작")),
      paragraph(bold('일정: '), text('2020.08.04 – 08.13 / 화, 목 13:00- / 4-5시간, 총 4회 / 실시간+대면')),
      ...(imgs[0] ? [image(imgs[0], '타이포그래피 특강')] : []),
    ),
  },
  {
    slug: '210604-jang-dayun-lecture',
    title: '시각영상디자인과 장다윤 선생님 특강',
    category: 'Lecture',
    excerpt: '포트폴리오, After Effects 3D 활용, Unreal Engine 실무 예시',
    publishedAt: '2021-06-04',
    images: [],
    buildContent: () => doc(
      heading(2, '시각영상디자인과 장다윤 선생님 특강'),
      paragraph(bold('일시: '), text('2021년 6월 4일')),
      paragraph(),
      heading(3, '강의 주제'),
      bulletList([
        '포트폴리오',
        'After Effects 3D 활용',
        'Unreal Engine 실무 예시',
      ]),
      paragraph(),
      heading(3, '강사 경력'),
      bulletList([
        '라이온하트 스튜디오 — 영상·연출팀',
        '로커스 — 3D 애니메이션 및 VFX',
        '동아일보 채널',
        '드림웍스 애니메이션',
        '극장판 3D 애니메이션 작품 참여',
      ]),
    ),
  },
  {
    slug: '210528-kang-jiyeon-alumni',
    title: '숙명적 디자인 마중 : 강지연 동문',
    category: 'Lecture',
    excerpt: '뉴욕 Enigma UX팀 프로덕트 디자인 리드 — 뉴욕 유학 생활, 데이터 디자인',
    publishedAt: '2021-05-28',
    images: [],
    buildContent: () => doc(
      heading(2, '숙명적 디자인 마중 : 강지연 동문'),
      paragraph(bold('일시: '), text('2021년 5월 28일')),
      paragraph(),
      heading(3, '강연자 소개'),
      paragraph(text('강지연 동문 (시각영상디자인과 09학번)')),
      bulletList([
        '뉴욕 파슨스 디자인 스쿨 대학원 수학',
        '현재: 뉴욕 데이터 테크놀로지 회사 Enigma에서 UX팀 프로덕트 디자인 리드',
      ]),
      paragraph(),
      heading(3, '강의 내용'),
      bulletList([
        '뉴욕 유학 생활',
        '회사 업무',
        '데이터 디자인',
        '파슨스 디자인 & 테크놀로지',
        'Q&A',
      ]),
    ),
  },
  {
    slug: '210521-kim-hyoyoung-alumni',
    title: '숙명적 디자인 마중 : 김효영 동문',
    category: 'Lecture',
    excerpt: 'Folks VFX MM/CG 감독 — 시각효과(VFX)란 무엇인가, 영화 시장 트렌드',
    publishedAt: '2021-05-21',
    images: [],
    buildContent: () => doc(
      heading(2, '숙명적 디자인 마중 : 김효영 동문'),
      paragraph(bold('일시: '), text('2021년 5월 21일')),
      paragraph(),
      heading(3, '강의 내용'),
      bulletList([
        '시각효과(VFX)란 무엇인가',
        '영화 시장 트렌드',
        '캐나다 영화 VFX 산업 위상',
        'VFX 팀 구성',
        '아티스트 커리어 경로',
        '해외 취업 방법',
        '토론토 인근 교육기관',
      ]),
      paragraph(),
      heading(3, '강연자 약력'),
      bulletList([
        'Folks VFX — MM/CG 감독 (2020.11~)',
        'Pixomondo — 감독/리드 아티스트 (2011~2020)',
        'Prochips — 시니어 산업디자이너 (2003~2005)',
        'LG 전자 — 산업디자이너 (1997~2001)',
      ]),
    ),
  },
  {
    slug: '2020-career-lecture',
    title: '2020-2 숙명행복 전임교수 진로특강',
    category: 'Lecture',
    excerpt: '학년별 진로특강 — 취업준비, 4차 산업혁명, 무모한 용기, 꿈을 디자인하다',
    publishedAt: '2020-09-21',
    images: [
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/2020-2_js01.jpg', filename: 'career-2020-01.jpg', alt: '4학년 진로특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/2020-2_ky01.jpg', filename: 'career-2020-02.jpg', alt: '3학년 진로특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/2020-2_sh02.jpg', filename: 'career-2020-03.jpg', alt: '2학년 진로특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/2020-2_sh01.jpg', filename: 'career-2020-04.jpg', alt: '2학년 진로특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/2020-2_ss01.jpg', filename: 'career-2020-05.jpg', alt: '1학년 진로특강' },
    ],
    buildContent: (imgs) => doc(
      heading(2, '2020-2 숙명행복 전임교수 진로특강'),
      paragraph(bold('일시: '), text('2020년 9월 21일 ~ 25일')),
      paragraph(),
      heading(3, '[4학년 진로특강] 선배들의 취업 사례를 통한 실제 취업준비'),
      ...(imgs[0] ? [image(imgs[0], '4학년 진로특강')] : []),
      paragraph(),
      heading(3, '[3학년 진로특강] 4차 산업혁명과 포스트 코로나 시대 이후의 디자인'),
      ...(imgs[1] ? [image(imgs[1], '3학년 진로특강')] : []),
      paragraph(),
      heading(3, '[2학년 진로특강] 어디든 갈 수 있는 무모한 용기'),
      ...(imgs[2] ? [image(imgs[2], '2학년 진로특강')] : []),
      ...(imgs[3] ? [image(imgs[3], '2학년 진로특강')] : []),
      paragraph(),
      heading(3, '[1학년 진로특강] 나의 꿈을 디자인하다'),
      ...(imgs[4] ? [image(imgs[4], '1학년 진로특강')] : []),
    ),
  },
  {
    slug: '2020-women-specialization',
    title: '2020-1 전공별 여대생 특성화 프로그램',
    category: 'Lecture',
    excerpt: '캐릭터디자인, 취업 준비 노하우, 광고 아트디렉터 프로그램',
    publishedAt: '2020-05-22',
    images: [
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/hyo1.jpg', filename: 'specialization-2020-01.jpg', alt: '캐릭터디자인 특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/hyo2-1024x587.jpg', filename: 'specialization-2020-02.jpg', alt: '캐릭터디자인 특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/lee1.jpg', filename: 'specialization-2020-03.jpg', alt: '취업 준비 특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/lee2.jpg', filename: 'specialization-2020-04.jpg', alt: '취업 준비 특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/choi1.jpg', filename: 'specialization-2020-05.jpg', alt: '광고 아트디렉터 특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/choi2.jpg', filename: 'specialization-2020-06.jpg', alt: '광고 아트디렉터 특강' },
    ],
    buildContent: (imgs) => doc(
      heading(2, '2020-1 전공별 여대생 특성화 프로그램'),
      paragraph(),
      heading(3, '1. 캐릭터디자인 (2020.05.22)'),
      paragraph(bold('강사: '), text('이효숙')),
      paragraph(text('졸업 후의 인턴 과정과 취업 준비할 때 필요한 역량들을 상세히 다루었습니다.')),
      ...(imgs[0] ? [image(imgs[0], '캐릭터디자인 특강')] : []),
      ...(imgs[1] ? [image(imgs[1], '캐릭터디자인 특강')] : []),
      paragraph(),
      heading(3, '2. 내가 취준생 때 알았으면 좋았을 것들 (2020.06.12)'),
      paragraph(bold('강사: '), text('이소담, 박서희, 박소연, 김성경, 최린아, 이시영')),
      ...(imgs[2] ? [image(imgs[2], '취업 준비 특강')] : []),
      ...(imgs[3] ? [image(imgs[3], '취업 준비 특강')] : []),
      paragraph(),
      heading(3, '3. 광고 아트디렉터 프로그램 (2020.07.03)'),
      paragraph(bold('강사: '), text('최혜송')),
      paragraph(text('취업역량을 강화하기 위하여 광고아트 디렉터를 초대하여 디자인 현장과 업무를 청취하였습니다.')),
      ...(imgs[4] ? [image(imgs[4], '광고 아트디렉터 특강')] : []),
      ...(imgs[5] ? [image(imgs[5], '광고 아트디렉터 특강')] : []),
    ),
  },
  {
    slug: '2020-design-thinking-lecture',
    title: '디자인씽킹앤시각화 수업 내 특강',
    category: 'Lecture',
    excerpt: '비쥬얼라이징 & 디자인의 확장성과 출판 / 1인 기업과 인하우스 디자인',
    publishedAt: '2020-06-09',
    images: [
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/Design-thinking-1.png', filename: 'design-thinking-01.png', alt: '디자인씽킹 특강' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/Design-thinking-2.png', filename: 'design-thinking-02.png', alt: '디자인씽킹 특강' },
    ],
    buildContent: (imgs) => doc(
      heading(2, '디자인씽킹앤시각화 수업 내 특강'),
      paragraph(bold('일시: '), text('2020년 6월 9일')),
      paragraph(),
      heading(3, '특강 1: 비쥬얼라이징 & 디자인의 확장성과 출판'),
      paragraph(bold('강사: '), text('박혜미')),
      paragraph(text('독립출판과 시각이미지의 다양한 매체 적용, 출판계와 독립출판계의 경계를 넘나드는 젊은 작가의 경험을 공유했습니다.')),
      ...(imgs[0] ? [image(imgs[0], '비쥬얼라이징 특강')] : []),
      paragraph(),
      heading(3, '특강 2: 1인 기업과 인하우스 디자인'),
      paragraph(bold('강사: '), text('방소담(프리랜서), 김유리(신세계 인터네셔널)')),
      paragraph(text('선배와의 대화 및 진로 특강을 진행했습니다.')),
      ...(imgs[1] ? [image(imgs[1], '인하우스 디자인 특강')] : []),
    ),
  },

  // ===== EXHIBITION =====
  {
    slug: '2020-flatisher-presentation',
    title: '2020-1 플래티셔일러스트레이션 캠퍼스 사업 프레젠테이션',
    category: 'Exhibition',
    excerpt: '창업 및 용산 관련 프로젝트 프레젠테이션 — 미술대 411호',
    publishedAt: '2020-06-25',
    images: [
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/ill2.jpg', filename: 'flatisher-01.jpg', alt: '캠퍼스 사업 프레젠테이션' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/ill1.jpg', filename: 'flatisher-02.jpg', alt: '캠퍼스 사업 프레젠테이션' },
    ],
    buildContent: (imgs) => doc(
      heading(2, '2020-1 플래티셔일러스트레이션 캠퍼스 사업 프레젠테이션'),
      paragraph(bold('일시: '), text('2020년 6월 25일')),
      paragraph(bold('장소: '), text('미술대 411호')),
      paragraph(),
      paragraph(text('6월 25일 플래티셔일러스트레이션 캠퍼스사업(창업 및 용산 관련 프로젝트) 프레젠테이션을 미술대 411호에서 진행했습니다.')),
      ...imgs.filter(Boolean).map((img, i) => image(img, `캠퍼스 사업 프레젠테이션 ${i + 1}`)),
    ),
  },

  // ===== EVENT (과제전) =====
  {
    slug: '2020-design-thinking-exhibition',
    title: '2020-1 디자인씽킹앤이미지 과제전',
    category: 'Event',
    excerpt: '1학년 수업 디자인씽킹앤이미지 과제전',
    publishedAt: '2020-05-20',
    images: [
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/assign1.jpg', filename: 'assignment-2020-01.jpg', alt: '과제전' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/assign2.jpg', filename: 'assignment-2020-02.jpg', alt: '과제전' },
      { url: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2020/10/assign3.jpg', filename: '과제전' },
    ],
    buildContent: (imgs) => doc(
      heading(2, '2020-1 디자인씽킹앤이미지 과제전'),
      paragraph(bold('일시: '), text('2020년 5월 20일')),
      paragraph(),
      paragraph(text('1학년 수업 디자인씽킹앤이미지 과제전을 진행했습니다.')),
      ...imgs.filter(Boolean).map((img, i) => image(img, `과제전 ${i + 1}`)),
    ),
  },

  // ===== NOTICE: 학생경비 (신규 7개) =====
  {
    slug: '2023-student-expenses-undergraduate',
    title: '시각영상디자인과 2023년도 학생경비 집행내역 공개',
    category: 'Notice',
    excerpt: '2023년도 학부 학생경비 집행내역',
    publishedAt: '2024-04-01',
    images: [],
    attachmentUrl: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2024/04/2023_%ED%95%99%EC%83%9D%EA%B2%BD%EB%B9%84%EC%A7%91%ED%96%89%EB%82%B4%EC%97%AD%ED%95%99%EB%B6%80.xlsx',
    attachmentFilename: '2023_학생경비집행내역_학부.xlsx',
    buildContent: () => null,
  },
  {
    slug: '2022-student-expenses-phd',
    title: '디자인학과(박사) 2022 학생경비집행내역 공개',
    category: 'Notice',
    excerpt: '2022년도 박사 학생경비 집행내역',
    publishedAt: '2023-04-01',
    images: [],
    attachmentUrl: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/04/1_2022_%ED%95%99%EC%83%9D%EA%B2%BD%EB%B9%84%EC%A7%91%ED%96%89%EB%82%B4%EC%97%AD_%EB%94%94%EC%9E%90%EC%9D%B8%ED%95%99%EA%B3%BC%EB%B0%95%EC%82%AC.xlsx',
    attachmentFilename: '2022_학생경비집행내역_디자인학과박사.xlsx',
    buildContent: () => null,
  },
  {
    slug: '2022-student-expenses-masters',
    title: '시각영상디자인학과(석사) 2022 학생경비집행내역 공개',
    category: 'Notice',
    excerpt: '2022년도 석사 학생경비 집행내역',
    publishedAt: '2023-04-01',
    images: [],
    attachmentUrl: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/04/2022_%ED%95%99%EC%83%9D%EA%B2%BD%EB%B9%84%EC%A7%91%ED%96%89%EB%82%B4%EC%97%AD_%EC%8B%9C%EA%B0%81%EC%98%81%EC%83%81%EB%94%94%EC%9E%90%EC%9D%B8%ED%95%99%EA%B3%BC%EC%84%9D%EC%82%AC-1.xlsx',
    attachmentFilename: '2022_학생경비집행내역_석사.xlsx',
    buildContent: () => null,
  },
  {
    slug: '2022-student-expenses-undergraduate',
    title: '시각영상디자인과 2022년도 학생경비 집행내역 공개',
    category: 'Notice',
    excerpt: '2022년도 학부 학생경비 집행내역',
    publishedAt: '2023-04-01',
    images: [],
    attachmentUrl: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2023/04/2022_%ED%95%99%EC%83%9D%EA%B2%BD%EB%B9%84%EC%A7%91%ED%96%89%EB%82%B4%EC%97%AD_%EC%8B%9C%EA%B0%81%EC%98%81%EC%83%81%EB%94%94%EC%9E%90%EC%9D%B8%EA%B3%BC.xlsx',
    attachmentFilename: '2022_학생경비집행내역_학부.xlsx',
    buildContent: () => null,
  },
  {
    slug: '2021-student-expenses-masters',
    title: '시각영상디자인학과(석사) 2021 학생경비집행내역 공개',
    category: 'Notice',
    excerpt: '2021년도 석사 학생경비 집행내역',
    publishedAt: '2022-04-01',
    images: [],
    buildContent: () => null,
  },
  {
    slug: '2021-student-expenses-undergraduate',
    title: '시각영상디자인과 2021년도 학생경비 집행내역 공개',
    category: 'Notice',
    excerpt: '2021년도 학부 학생경비 집행내역',
    publishedAt: '2022-04-01',
    images: [],
    attachmentUrl: 'http://smvd.sookmyung.ac.kr/wp-content/uploads/2022/04/%EC%8B%9C%EA%B0%81%EC%98%81%EC%83%81%EB%94%94%EC%9E%90%EC%9D%B8%EA%B3%BC_2021_%ED%95%99%EC%83%9D%EA%B2%BD%EB%B9%84%EC%A7%91%ED%96%89%EB%82%B4%EC%97%AD.xlsx',
    attachmentFilename: '2021_학생경비집행내역_학부.xlsx',
    buildContent: () => null,
  },
  {
    slug: '2020-student-expenses-phd',
    title: '시각영상디자인과 2020학년도 학생경비 집행내역 (박사)',
    category: 'Notice',
    excerpt: '2020년도 박사 학생경비 집행내역',
    publishedAt: '2021-04-01',
    images: [
      { url: 'http://smvd.sookmyung.ac.kr/wp-content/uploads/2021/04/image.png', filename: '2020-expenses-phd.png', alt: '2020 박사 학생경비' },
    ],
    buildContent: (imgs) => imgs[0] ? doc(image(imgs[0], '2020 박사 학생경비 집행내역')) : null,
  },
  {
    slug: '2020-student-expenses-undergraduate',
    title: '시각영상디자인과 2020학년도 학생경비 집행내역 (학부)',
    category: 'Notice',
    excerpt: '2020년도 학부 학생경비 집행내역',
    publishedAt: '2021-04-01',
    images: [
      { url: 'http://smvd.sookmyung.ac.kr/wp-content/uploads/2021/04/2020smvd-scaled.jpg', filename: '2020-expenses-undergrad.jpg', alt: '2020 학부 학생경비' },
    ],
    buildContent: (imgs) => imgs[0] ? doc(image(imgs[0], '2020 학부 학생경비 집행내역')) : null,
  },
];

// ========== 기존 학생경비 첨부파일 업데이트 ==========

const EXISTING_ATTACHMENT_UPDATES: Array<{
  slug: string;
  publishedAt: string;
  attachmentUrl: string;
  attachmentFilename: string;
}> = [
  {
    slug: '1',
    publishedAt: '2025-05-01',
    attachmentUrl: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2025/05/%EB%AF%B8%EC%88%A0%EB%8C%80%ED%95%99_2024_%ED%95%99%EC%83%9D%EA%B2%BD%EB%B9%84%EC%A7%91%ED%96%89%EB%82%B4%EC%97%AD.xlsx',
    attachmentFilename: '미술대학_2024_학생경비집행내역.xlsx',
  },
  {
    slug: '2',
    publishedAt: '2025-05-01',
    attachmentUrl: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2025/05/1.-%EC%8B%9C%EA%B0%81%EC%98%81%EC%83%81%EB%94%94%EC%9E%90%EC%9D%B8-%EB%B0%95%EC%82%AC_2024_%ED%95%99%EC%83%9D%EA%B2%BD%EB%B9%84%EC%A7%91%ED%96%89%EB%82%B4%EC%97%AD-1.xlsx',
    attachmentFilename: '디자인학과_박사_2024_학생경비집행내역.xlsx',
  },
  {
    slug: '3',
    publishedAt: '2025-05-01',
    attachmentUrl: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2025/05/1.-%EC%8B%9C%EA%B0%81%EC%98%81%EC%83%81%EB%94%94%EC%9E%90%EC%9D%B8%ED%95%99%EA%B3%BC-%EC%84%9D%EC%82%AC_2024_%ED%95%99%EC%83%9D%EA%B2%BD%EB%B9%84%EC%A7%91%ED%96%89%EB%82%B4%EC%97%AD-1.xlsx',
    attachmentFilename: '시각영상디자인학과_석사_2024_학생경비집행내역.xlsx',
  },
  {
    slug: '4',
    publishedAt: '2025-05-01',
    attachmentUrl: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2025/05/1.-%EC%8B%9C%EA%B0%81%EC%98%81%EC%83%81%EB%94%94%EC%9E%90%EC%9D%B8%ED%95%99%EA%B3%BC-%ED%95%99%EC%82%AC_2024_%ED%95%99%EC%83%9D%EA%B2%BD%EB%B9%84%EC%A7%91%ED%96%89%EB%82%B4%EC%97%AD-1.xlsx',
    attachmentFilename: '시각영상디자인학과_학사_2024_학생경비집행내역.xlsx',
  },
  {
    slug: '8',
    publishedAt: '2024-04-01',
    attachmentUrl: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2024/04/2023_%ED%95%99%EC%83%9D%EA%B2%BD%EB%B9%84%EC%A7%91%ED%96%89%EB%82%B4%EC%97%AD%EB%B0%95%EC%82%AC.xlsx',
    attachmentFilename: '2023_학생경비집행내역_박사.xlsx',
  },
  {
    slug: '9',
    publishedAt: '2024-04-01',
    attachmentUrl: 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2024/04/2023_%ED%95%99%EC%83%9D%EA%B2%BD%EB%B9%84%EC%A7%91%ED%96%89%EB%82%B4%EC%97%AD%EB%8C%80%ED%95%99%EC%9B%90.xlsx',
    attachmentFilename: '2023_학생경비집행내역_대학원.xlsx',
  },
];

// ========== 메인 실행 ==========

async function main() {
  console.log('=== News & Event 마이그레이션 시작 ===\n');

  // 이미지 폴더 확인
  if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
  }

  // 현재 DB 상태 확인
  const existingCount = await prisma.newsEvent.count();
  console.log(`현재 DB 게시물: ${existingCount}개\n`);

  // ===== Step 1: 기존 게시물 업데이트 (그룹 A) =====
  console.log('--- Step 1: 기존 게시물 업데이트 ---\n');

  for (const update of EXISTING_UPDATES) {
    console.log(`[UPDATE] slug="${update.slug}"`);

    // 이미지 다운로드
    const imagePaths: string[] = [];
    for (const img of update.images) {
      const path = await downloadImage(img.url, img.filename);
      imagePaths.push(path);
    }

    const content = update.buildContent(imagePaths);

    const updateData: Record<string, unknown> = {};
    if (update.category) updateData.category = update.category;
    if (update.publishedAt) updateData.publishedAt = new Date(update.publishedAt);
    if (update.excerpt) updateData.excerpt = update.excerpt;
    if (content) updateData.content = content as Prisma.InputJsonValue;

    try {
      await prisma.newsEvent.update({
        where: { slug: update.slug },
        data: updateData,
      });
      console.log(`  ✅ 업데이트 완료\n`);
    } catch (err) {
      console.log(`  ❌ 업데이트 실패: ${err}\n`);
    }
  }

  // ===== Step 2: 기존 학생경비 첨부파일 업데이트 =====
  console.log('--- Step 2: 기존 학생경비 첨부파일 다운로드 ---\n');

  for (const att of EXISTING_ATTACHMENT_UPDATES) {
    console.log(`[ATTACHMENT] slug="${att.slug}"`);
    const filePath = await downloadAttachment(att.attachmentUrl, att.attachmentFilename);

    if (filePath) {
      const attachments = [{
        filename: att.attachmentFilename,
        filepath: filePath,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }];

      try {
        await prisma.newsEvent.update({
          where: { slug: att.slug },
          data: {
            attachments: attachments as unknown as Prisma.InputJsonValue,
            publishedAt: new Date(att.publishedAt),
          },
        });
        console.log(`  ✅ 첨부파일 추가\n`);
      } catch (err) {
        console.log(`  ❌ 실패: ${err}\n`);
      }
    }
  }

  // ===== Step 3: 학생경비 종합 (slug=7) 이미지 업데이트 =====
  console.log('--- Step 3: 학생경비 종합 이미지 업데이트 ---\n');
  const expenseImgUrl = 'https://smvd.sookmyung.ac.kr/wp-content/uploads/2024/05/%ED%95%99%EC%83%9D%EA%B2%BD%EB%B9%84-%EC%A7%91%ED%96%89-%EB%82%B4%EC%97%AD.png';
  const expenseImgPath = await downloadImage(expenseImgUrl, 'student-expenses-summary.png');
  if (expenseImgPath) {
    await prisma.newsEvent.update({
      where: { slug: '7' },
      data: {
        content: doc(image(expenseImgPath, '학생경비 집행 내역 종합')) as Prisma.InputJsonValue,
        publishedAt: new Date('2024-05-01'),
      },
    });
    console.log('  ✅ 학생경비 종합 이미지 추가\n');
  }

  // ===== Step 4: 신규 게시물 생성 (그룹 B) =====
  console.log('--- Step 4: 신규 게시물 생성 ---\n');

  // 현재 최대 order 값
  const lastArticle = await prisma.newsEvent.findFirst({ orderBy: { order: 'desc' } });
  let nextOrder = lastArticle ? lastArticle.order + 1 : 0;

  for (const article of NEW_ARTICLES) {
    console.log(`[CREATE] "${article.title}"`);

    // slug 중복 체크
    const existing = await prisma.newsEvent.findUnique({ where: { slug: article.slug } });
    if (existing) {
      console.log(`  [SKIP] slug="${article.slug}" 이미 존재\n`);
      continue;
    }

    // 이미지 다운로드
    const imagePaths: string[] = [];
    for (const img of article.images) {
      const imgPath = await downloadImage(img.url, img.filename);
      imagePaths.push(imgPath);
    }

    // 첨부파일 다운로드
    let attachments: unknown = Prisma.JsonNull;
    if (article.attachmentUrl && article.attachmentFilename) {
      const attPath = await downloadAttachment(article.attachmentUrl, article.attachmentFilename);
      if (attPath) {
        attachments = [{
          filename: article.attachmentFilename,
          filepath: attPath,
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }];
      }
    }

    const content = article.buildContent(imagePaths);

    try {
      await prisma.newsEvent.create({
        data: {
          slug: article.slug,
          title: article.title,
          category: article.category,
          excerpt: article.excerpt,
          thumbnailImage: '/Group-27.svg',
          content: content ? (content as Prisma.InputJsonValue) : Prisma.JsonNull,
          attachments: attachments as Prisma.InputJsonValue,
          publishedAt: new Date(article.publishedAt),
          published: true,
          order: nextOrder++,
        },
      });
      console.log(`  ✅ 생성 완료 (order: ${nextOrder - 1})\n`);
    } catch (err) {
      console.log(`  ❌ 생성 실패: ${err}\n`);
    }
  }

  // ===== 최종 확인 =====
  const finalCount = await prisma.newsEvent.count();
  const categories = await prisma.$queryRaw`SELECT category, COUNT(*)::int as count FROM news_events GROUP BY category ORDER BY category`;

  console.log('\n=== 마이그레이션 완료 ===');
  console.log(`총 게시물: ${finalCount}개`);
  console.log('카테고리별:', categories);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('마이그레이션 실패:', err);
  prisma.$disconnect();
  process.exit(1);
});
