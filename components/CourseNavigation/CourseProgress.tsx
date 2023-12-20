'use client';

interface CourseProgressProps {
  progressPercent: number;
  setIsDropdownOpen: any;
}

export default function CourseProgress({
  progressPercent,
  setIsDropdownOpen,
}: CourseProgressProps) {
  return (
    <button
      onClick={() => {
        setIsDropdownOpen(true);
      }}
      className='h-[48px] flex items-center gap-3 px-4 bg-tertiary-grey rounded-md cursor-pointer'
    >
      <p className='text-sm font-medium text-black'>Course Progress</p>
      <div className='w-[88px] h-[10px] bg-white border border-secondary-grey rounded-full'>
        <div className='w-[20px] h-full bg-primary-blue rounded-full'></div>
      </div>
      <p className='text-sm font-medium text-black'>{progressPercent}%</p>
    </button>
  );
}
