'use client';


interface AboutPageVisionProps {
  title?: string;
  content?: string;
  chips?: string[];
}

export default function AboutPageVision({
  title = 'Vision',
  content = '시각정보의 전달 및 상품과 서비스의 유통과정에서 직면하는 각종\n커뮤니케이션 문제를 분석하고 이를 대처해 나갈 수 있도록 다양한 분야에\n적용되고 있습니다. 시각영상디자인과는 현대산업사회에서 보다 다양하고\n광범위한 양상으로 변모되고 있습니다. 이러한 시대와 사회적 요구에 부응하기\n위해 건실한 예술적 기량과 개성적이며 창의적인 조형감각을 지닌 디자이너를\n양성하는 것에 교육 목표를 두고 있습니다.',
  chips = ['UX/UI', 'Graghic', 'Editorial', 'Illustration', 'Branding', 'CM/CF', 'Game'],
}: AboutPageVisionProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-start gap-[10px] sm:gap-4 lg:gap-[10px] w-full">
      {/* Title */}
      <h2 className="text-[24px] sm:text-[32px] lg:text-[48px] font-medium text-neutral-1450 font-inter m-0 tracking-[-0.128px] leading-[1.1] min-w-auto sm:min-w-[200px] lg:min-w-[333px] flex-1 sm:flex-none sm:w-[200px] lg:w-[333px] pb-2 sm:pb-0">
        {title}
      </h2>

      {/* Content Container */}
      <div className="flex flex-col gap-4 flex-1 w-full items-start">
        {/* Chips/Tags Container */}
        <div className="flex flex-wrap justify-start gap-[6px] sm:gap-5 lg:gap-6">
          {chips.map((chip) => (
            <div
              key={chip}
              className="flex items-center justify-center h-6 sm:h-7 px-2 bg-[#ebecf0] rounded-none"
            >
              <span className="text-[12px] sm:text-[13px] lg:text-[14px] font-medium text-neutral-1450 font-inter tracking-[-0.29px] leading-relaxed whitespace-nowrap">
                {chip}
              </span>
            </div>
          ))}
        </div>

        {/* Text Content */}
        <p className="text-[14px] sm:text-[16px] lg:text-[18px] font-medium text-neutral-1450 font-inter m-0 tracking-[-0.619px] leading-relaxed break-keep text-left">
          {content}
        </p>
      </div>
    </div>
  );
}
