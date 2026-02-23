import type { FilterOption } from './types';

interface FilterSectionProps {
  checkedClassification: string;
  classificationOptions: FilterOption[];
  trackOptions: FilterOption[];
}

export default function FilterSection({
  checkedClassification,
  classificationOptions,
  trackOptions,
}: FilterSectionProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 lg:gap-[60px] flex-nowrap sm:flex-wrap pb-5 border-b border-[#e0e0e0] items-start">
      {/* Classification Filter */}
      <div className="flex gap-3 sm:gap-5 items-start min-w-0">
        <p className="text-[14px] sm:text-[18px] font-medium font-pretendard text-neutral-1500 m-0 whitespace-nowrap shrink-0">
          분류
        </p>
        <div className="flex flex-col gap-2">
          {classificationOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer text-[14px] sm:text-[18px] font-medium font-pretendard text-neutral-1500 m-0"
            >
              <input
                type="checkbox"
                checked={checkedClassification === option.value}
                onChange={() => {}}
                disabled
                className={`appearance-none w-3 h-3 cursor-not-allowed border border-[#ccc] rounded-[2px] shrink-0 ${
                  checkedClassification === option.value ? 'bg-[#d0d0d0]' : 'bg-[#ffffff]'
                }`}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Track Filter */}
      <div className="flex gap-3 sm:gap-[30px] items-start min-w-0">
        <p className="text-[14px] sm:text-[18px] font-medium font-pretendard text-neutral-1500 m-0 whitespace-nowrap shrink-0 w-auto sm:w-[35px]">
          트랙
        </p>
        <div className="flex flex-wrap gap-x-3 sm:gap-x-5 gap-y-3 sm:gap-y-5 items-center">
          {trackOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-2 p-0 rounded-none bg-transparent border-none min-w-0"
            >
              <div
                className="w-[18px] h-[18px] shrink-0"
                style={{ backgroundColor: option.color }}
              />
              <p className="text-[14px] sm:text-[18px] font-medium font-pretendard text-neutral-1500 m-0 whitespace-nowrap break-keep leading-[1.3]">
                {option.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
