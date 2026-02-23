import type { GraduateModule } from './types';
import { TRACK_COLORS } from './data';

interface TrackTableProps {
  modules: GraduateModule[];
}

export default function TrackTable({ modules }: TrackTableProps) {
  return (
    <>
      {/* Section Title */}
      <div className="flex flex-col gap-5 pb-5 border-b-[3px] border-neutral-1500">
        <h2 className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold text-[#1b1d1f] font-pretendard m-0">
          트랙별 과목 및 이수기준
        </h2>
      </div>

      {/* Information Section */}
      <div className="flex flex-col gap-0 mt-6 sm:mt-10">
        {/* Info Box 1 */}
        <div className="flex gap-3 sm:gap-6 pb-5 flex-col sm:flex-row">
          <p className="text-[13px] sm:text-[15px] lg:text-[18px] font-semibold text-[#4e535b] font-pretendard m-0 w-auto sm:w-[60px] shrink-0">
            트랙
          </p>
          <p className="text-[12px] sm:text-[15px] lg:text-[18px] font-normal text-[#4e535b] font-pretendard m-0 leading-normal break-keep">
            전공교육과정을 기반으로 한 전문 인재육성 교육커리큘럼, 진출분야 및
            역량강화를 위한 모듈과 교과목으로 구성된 전공로드맵
          </p>
        </div>

        {/* Info Box 2 */}
        <div className="flex gap-3 sm:gap-6 flex-col sm:flex-row">
          <p className="text-[13px] sm:text-[15px] lg:text-[18px] font-semibold text-[#4e535b] font-pretendard m-0 w-auto sm:w-[60px] shrink-0">
            모듈
          </p>
          <p className="text-[12px] sm:text-[15px] lg:text-[18px] font-normal text-[#4e535b] font-pretendard m-0 leading-normal break-keep">
            공통된 주제의 교과목으로 구성된 집합체
          </p>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-[1.2fr_1.5fr_1fr_0.8fr] gap-5 w-full mb-0 mt-10">
        <div className="pb-1 text-[14px] lg:text-[18px] font-bold text-neutral-1500 font-pretendard text-left">트랙명</div>
        <div className="pb-1 text-[14px] lg:text-[18px] font-bold text-neutral-1500 font-pretendard text-left">해당과목</div>
        <div className="hidden lg:block pb-1 text-[18px] font-bold text-neutral-1500 font-pretendard text-left">이수기준</div>
        <div className="hidden lg:block pb-1 text-[18px] font-bold text-neutral-1500 font-pretendard text-left">기준학점</div>
      </div>

      {/* Table Rows */}
      <div className="flex flex-col gap-0">
        {modules.map((module, index) => {
          const moduleColor = TRACK_COLORS[index % TRACK_COLORS.length];

          return (
            <div
              key={index}
              className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-[1.2fr_1.5fr_1fr_0.8fr] gap-4 sm:gap-5 items-start sm:items-center min-h-auto sm:min-h-20 border-b border-t border-neutral-1500 box-border p-4 sm:p-0"
            >
              {/* Track Name with Color Box */}
              <div className="flex items-start sm:items-center gap-[10px] h-auto sm:h-full p-0 sm:py-5 sm:px-3 border-none w-full sm:w-auto">
                <span className="sm:hidden text-[12px] font-semibold text-[#4e535b] min-w-10">
                  트랙명
                </span>
                <div
                  className="w-[10px] h-[10px] sm:w-[14px] sm:h-[14px] shrink-0"
                  style={{ backgroundColor: moduleColor }}
                />
                <p className="text-[13px] sm:text-[15px] lg:text-[18px] font-medium text-[#353030] font-pretendard m-0 text-left whitespace-pre-wrap wrap-break-word leading-normal">
                  {module.track}
                </p>
              </div>

              {/* Courses */}
              <div className="flex items-start sm:justify-start h-auto sm:h-full p-0 sm:py-5 sm:px-3 border-none w-full sm:w-auto flex-col sm:flex-row gap-1 sm:gap-0">
                <span className="sm:hidden text-[12px] font-semibold text-[#4e535b] min-w-10">
                  해당과목
                </span>
                <p className="text-[13px] sm:text-[15px] lg:text-[18px] font-medium text-[#353030] font-pretendard m-0 text-left whitespace-pre-wrap wrap-break-word leading-normal">
                  {module.courses.replace(/\\n/g, '\n')}
                </p>
              </div>

              {/* Requirements */}
              <div className="hidden sm:flex items-center justify-start h-full py-5 px-3 border-none">
                <p className="text-[13px] lg:text-[18px] font-medium text-[#353030] font-pretendard m-0 text-left whitespace-pre-wrap wrap-break-word leading-normal">
                  {module.requirements}
                </p>
              </div>

              {/* Credits */}
              <div className="hidden sm:flex items-center justify-start h-full py-5 px-3">
                <p className="text-[13px] lg:text-[18px] font-medium text-[#353030] font-pretendard m-0 text-left">
                  {module.credits}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
