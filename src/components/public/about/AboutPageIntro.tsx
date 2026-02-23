'use client';

import Image from 'next/image';

interface AboutPageIntroProps {
  title?: string;
  description?: string;
  imageSrc?: string;
}

export default function AboutPageIntro({
  title = 'About',
  description = '시각·영상디자인과에서는 커뮤니케이션 시대의 다양한 정보, 인간의 의사,\n사물의 이미지를 정확하고 합리적인 방법으로 전달하기 위한 창의적 사고와\n창조 행위를 배웁니다. 사람들의 마음을 움직일 수 있는 시각을 통해\n자신의 생각과 표현력을 효과적으로 전달하는 방법을 탐구하는 학문입니다.',
  imageSrc = '/images/about/image 32.png',
}: AboutPageIntroProps) {
  return (
    <div className="flex flex-col items-start gap-[10px] sm:gap-8 lg:gap-10 w-full">
      {/* Top Section - Title & Description */}
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-[24px] sm:text-[32px] lg:text-[48px] font-medium text-neutral-1450 font-inter m-0 tracking-[-0.128px] leading-[1.1]">
          {title}
        </h1>
        {/* Description Section */}
        <div className="text-[14px] sm:text-[16px] lg:text-[18px] font-medium text-neutral-1450 font-inter tracking-[-0.619px] leading-relaxed w-full lg:w-[848px] break-keep whitespace-pre-wrap">
          {description}
        </div>
      </div>

      {/* Bottom Section - Image */}
      <div className="relative w-full h-[196px] sm:h-[300px] lg:h-[500px] bg-[#e1e1e1] overflow-hidden rounded-lg sm:rounded-none">
        <Image
          src={imageSrc}
          alt="About SMVD Hero Image"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1360px"
          className="object-cover"
          priority
          quality={85}
        />
      </div>
    </div>
  );
}
