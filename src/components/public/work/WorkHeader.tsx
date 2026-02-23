'use client';


interface WorkHeaderProps {
  currentCategory?: string;
  onCategoryChange?: (category: string) => void;
  categories?: string[];
}

const defaultCategories = ['All', 'UX/UI', 'Motion', 'Branding', 'Game', 'Graphics'];

export default function WorkHeader({
  currentCategory,
  onCategoryChange,
  categories = defaultCategories,
}: WorkHeaderProps) {

  return (
    <div className="max-w-[1440px] mx-auto flex flex-col gap-0 w-full pt-0 pb-0">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-3 sm:gap-4 w-full pb-0 border-none">
        {categories.map((category) => (
          <span
            key={category}
            onClick={() => onCategoryChange?.(category)}
            className={`font-satoshi font-medium text-[14px] sm:text-[15px] lg:text-[16px] transition-colors duration-300 ease-in ${currentCategory === category ? 'text-neutral-1450' : 'text-[#7b828e]'} ${onCategoryChange ? 'cursor-pointer' : 'cursor-default'}`}
          >
            {category}
          </span>
        ))}
      </div>
    </div>
  );
}
