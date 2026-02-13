'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Professor {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  major: string;
  specialty: string;
  badge: string;
  description: string;
  profileImage: string;
}

const professors: Professor[] = [
  {
    id: 'yun',
    name: '윤여종',
    title: '정교수',
    email: 'yyj@sookmyung.ac.kr',
    phone: '+82-2-710-9682',
    major: '시각영상디자인',
    specialty: 'UI/UX 디자인',
    badge: 'Research & Mentoring',
    description:
      '윤여종 교수는 UI/UX 디자인의 선구자로, 사용자 중심 설계와 인터페이스 혁신을 통해 디지털 커뮤니케이션의 미래를 개척하고 있습니다.\n\n주요 연구 분야:\n• UI/UX 디자인 및 사용자 경험 연구\n• 인터랙티브 미디어 개발\n• 디지털 인터페이스 설계 방법론\n• 사용자 연구 및 인지심리학',
    profileImage: '/images/people/yun-yeojong.png',
  },
  {
    id: 'kim',
    name: '김기영',
    title: '정교수',
    email: 'kiyoungkim@sookmyung.ac.kr',
    phone: '+82-2-710-9683',
    major: '시각영상디자인',
    specialty: '그래픽 디자인',
    badge: 'Vision & Marketing',
    description:
      '김기영 교수는 브랜드 비전과 시각 전략을 통해 기업의 정체성을 재정의하는 전문가입니다. 마케팅과 디자인의 융합을 추구합니다.\n\n주요 연구 분야:\n• 브랜드 아이덴티티 개발\n• 마케팅 커뮤니케이션 디자인\n• 비주얼 스토리텔링\n• 기업 이미지 전략',
    profileImage: '/images/people/kim-kiyoung.png',
  },
  {
    id: 'lee',
    name: '이지선',
    title: '정교수',
    email: 'jisun.lee@sookmyung.ac.kr',
    phone: '+82-2-710-9684',
    major: '시각영상디자인',
    specialty: '사용자 경험',
    badge: 'User Experience',
    description:
      '이지선 교수는 사용자 중심의 디자인 철학으로 다양한 디지털 경험을 창출하고 있습니다. 사용성과 미학의 조화를 추구합니다.\n\n주요 연구 분야:\n• 사용자 경험(UX) 설계\n• 웹 및 모바일 인터페이스\n• 접근성 있는 디자인\n• 사용자 테스트 및 평가',
    profileImage: '/images/people/lee-jisun.png',
  },
  {
    id: 'na',
    name: '나유미',
    title: '정교수',
    email: 'youmi.na@sookmyung.ac.kr',
    phone: '+82-2-710-9685',
    major: '시각영상디자인',
    specialty: '디지털 미디어',
    badge: 'User Experience',
    description:
      '나유미 교수는 멀티미디어 콘텐츠 설계와 디지털 경험 개발의 전문가로, 기술과 예술의 경계를 넘어 새로운 창의성을 추구합니다.\n\n주요 연구 분야:\n• 멀티미디어 콘텐츠 제작\n• 인터랙티브 영상 디자인\n• 디지털 미디어 전략\n• 콘텐츠 기획 및 실행',
    profileImage: '/images/people/na-youmi.png',
  },
];

const instructors = [
  { name: '김아영', specialty: '기초그래픽디자인I' },
  { name: '신지영', specialty: '일러스트레이션과스토리텔링디자인 I/II' },
  { name: '최한솔', specialty: '기초그래픽디자인 I/II, 일러스트레이션과스토리텔링디자인 I/II' },
  { name: '전혜원', specialty: '일러스트레이션과스토리텔링디자인 I/II' },
  { name: '정승희', specialty: '일러스트레이션과스토리텔링디자인 I/II' },
  { name: '허주연', specialty: '기초그래픽디자인 I/II' },
  { name: '김태룡', specialty: '타이포그래피디자인 I/II' },
  { name: '권혁준', specialty: '브랜드디자인 I/II' },
  { name: '김연지', specialty: '사용자경험디자인 I/II' },
  { name: '이주형', specialty: '사용자경험디자인 I/II' },
  { name: '김도운', specialty: '사용자경험디자인 I/II' },
  { name: '장다윤', specialty: '모션디자인 I/II' },
];

export default function OurPeopleTab() {
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    professors[0]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '60px',
        width: '100%',
      }}
    >
      {/* Professor Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <h2
          style={{
            fontSize: '48px',
            fontWeight: '400',
            color: '#000000ff',
            fontFamily: 'Helvetica',
            margin: '0',
            letterSpacing: '-0.48px',
          }}
        >
          Professor
        </h2>

        {/* Professor List - 1 row, 4 columns */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            width: '100%',
          }}
        >
          {professors.map((prof) => (
            <div
              key={prof.id}
              onClick={() => setSelectedProfessor(prof)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0px',
                width: '236px',
                flexShrink: 0,
              }}
            >
              {/* Image Container */}
              <div
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  width: '236px',
                  height: '356px',
                  backgroundColor: '#ffffff',
                  borderRadius: '0px',
                  overflow: 'hidden',
                  border: 'none',
                }}
              >
                <Image
                  src={prof.profileImage}
                  alt={prof.name}
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                  priority={selectedProfessor?.id === prof.id}
                />
              </div>

              {/* Info Container */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0px',
                  backgroundColor: '#ffffff',
                  padding: '37px 30px 0 30px',
                  width: '236px',
                  boxSizing: 'border-box',
                }}
              >
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#141414ff',
                    fontFamily: 'Helvetica',
                    margin: '0 0 37px 0',
                    lineHeight: 1.5,
                  }}
                >
                  {prof.name}
                </h3>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: '400',
                    color: '#666666ff',
                    fontFamily: 'Helvetica',
                    margin: '0',
                  }}
                >
                  {prof.specialty}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructor Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '400',
            color: '#141414ff',
            fontFamily: 'Helvetica',
            margin: '0',
            letterSpacing: '0px',
          }}
        >
          Instructor
        </h2>

        {/* Instructor List - 1 column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {instructors.map((instructor, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '34px',
                paddingTop: '34px',
                borderBottom: '1px solid #e5e5e5ff',
                backgroundColor: '#ffffffff',
                minHeight: '95px',
                boxSizing: 'border-box',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '400',
                  color: '#353030ff',
                  fontFamily: 'Helvetica',
                  margin: '0',
                  width: '332px',
                  flexShrink: 0,
                }}
              >
                {instructor.name}
              </h3>
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: '400',
                  color: '#353030ff',
                  fontFamily: 'Helvetica',
                  margin: '0',
                  lineHeight: 1.4,
                }}
              >
                {instructor.specialty}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
