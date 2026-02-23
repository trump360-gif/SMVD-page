'use client';


interface HomeHeroProps {
  eventLabel?: string;
  eventDate?: string;
  title?: string;
}

export default function HomeHero({
  eventLabel = 'Event',
  eventDate = '2024.01.05',
  title = '2024 시각영상디자인과 졸업전시회',
}: HomeHeroProps) {


  return (
    <div className="flex flex-col gap-3 pb-5 border-b-2 border-[#000000ff] w-full">
      {/* Event Badge */}
      <div className="flex items-center gap-2 h-7">
        <div className="flex items-center justify-center w-10 sm:w-[50px] h-7 bg-[#0000001a] rounded-sm text-[10px] sm:text-[12px] font-semibold font-['Helvetica'] text-[#000000ff]">
          {eventLabel}
        </div>
        <p className="m-0 text-[12px] sm:text-[14px] font-medium text-[#575a60ff] font-['Helvetica']">
          {eventDate}
        </p>
      </div>

      {/* Title */}
      <h1 className="m-0 text-[28px] sm:text-[36px] lg:text-[48px] font-bold leading-[1.45] tracking-[-0.48px] text-[#000000ff] font-['Helvetica'] break-keep">
        {title}
      </h1>
    </div>
  );
}
