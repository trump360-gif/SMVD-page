'use client';


const DEFAULT_TIMELINE_ITEMS = [
  { year: '2021', description: '디자인학부로 통합되었던 학과가 시각영상디자인전공, 산업디자인전공,\n환경디자인학과로 나누어져 1학년 때부터 전공을 심화하여 학습할 수 있도록 개편' },
  { year: '2006', description: '3개 전공 (시각영상디자인전공, 산업디자인전공, 환경디자인전공)\n영역으로 통합 개편' },
  { year: '2002', description: '디자인학부내 6개 전공(시각정보디자인전공, 영상애니메이션전공,\n산업디자인전공, 실내디자인전공, 도시조경 건축 디자인전공, 건축디자인전공)으로\n세분화하여 전공제로 개편\n\n실시된 전국 디자인계열 대학 종합 평가에서 최우수 대학으로\n선정되는 성과를 거둠' },
  { year: '2000', description: '학과제를 학부제로 통합하면서 산업디자인전공, 영상애니메이션전공,\n환경디자인전공의 3개 세부전공으로 운영' },
  { year: '1997', description: '야간에 신설된 환경디자인학과가 미술대학으로 편입되면서\n산업디자인과, 환경디자인과 구조로 확대 운영' },
  { year: '1993', description: '9월 미술대학의 산업미술과에서 산업디자인과로 학과 명칭을 변경,\n시각디자인 분야와 제품디자인 분야로 세부전공을 운영' },
  { year: '1980', description: '12월 산업미술대학을 미술대학으로 명칭을 변경' },
  { year: '1973', description: '12월 응용미술과를 산업미술과 산업공예과로 분과하여\n산업미술대학을 신설' },
  { year: '1968', description: '응용 미술과로 변경' },
  { year: '1962', description: '문리과대학 생활미술과로 구체화' },
  { year: '1948', description: '문학부 미술학과가 설립' },
];

interface AboutPageHistoryProps {
  title?: string;
  introText?: string;
  timelineItems?: Array<{ year: string; description: string }>;
}

export default function AboutPageHistory({
  title = 'History',
  introText = '숙명여자대학교 시각영상디자인과는 설립 이래 디지털 시대가 요구하는 창의적 시각 커뮤니케이션의 중심에서 인재를 배출해 왔습니다.\n축적된 전통과 혁신을 바탕으로 미래 디자인 교육을 선도하고 있습니다.',
  timelineItems = DEFAULT_TIMELINE_ITEMS,
}: AboutPageHistoryProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-start gap-[10px] sm:gap-4 lg:gap-[10px] w-full">
      {/* Title */}
      <h2 className="text-[24px] sm:text-[32px] lg:text-[48px] font-medium text-neutral-1450 font-inter m-0 tracking-[-0.128px] leading-[1.1] min-w-auto sm:min-w-[200px] lg:min-w-[333px] flex-1 sm:flex-none sm:w-[200px] lg:w-[333px] pb-2 sm:pb-0">
        {title}
      </h2>

      {/* Content */}
      <div className="flex flex-col items-start sm:items-end gap-9 sm:gap-12 lg:gap-[60px] flex-1 w-full sm:w-auto">
        {/* Intro Text */}
        <p className="text-[14px] sm:text-[16px] lg:text-[18px] font-medium text-neutral-1450 font-inter m-0 tracking-[-0.619px] leading-relaxed whitespace-pre-wrap self-start break-keep text-left w-full sm:w-auto">
          {introText}
        </p>

        {/* Timeline Container */}
        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 w-full lg:w-[504px]">
          {timelineItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-2"
            >
              {/* Year Badge */}
              <div className="flex items-center justify-center h-6 sm:h-7 px-2 bg-[#ebecf0] rounded-none w-fit">
                <span className="text-[12px] sm:text-[13px] lg:text-[14px] font-medium text-neutral-1450 font-inter tracking-[-0.29px] leading-relaxed">
                  {item.year}
                </span>
              </div>

              {/* Description */}
              <p className="text-[14px] sm:text-[16px] lg:text-[18px] font-medium text-neutral-1450 font-inter m-0 tracking-[-0.619px] leading-relaxed whitespace-pre-wrap break-keep">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
