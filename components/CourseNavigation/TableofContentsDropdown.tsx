'use client';

import { useRouter } from 'next/navigation';

interface TableOfContentsProps {
  tableOfContents: {
    unitName: string;
    courseId: string;
    content: {
      title: string;
      type: string;
      unitId: string;
    }[];
  }[];
  dropdownRef: any;
}

export default function TableOfContentsDropdown({
  tableOfContents,
  dropdownRef,
}: TableOfContentsProps) {
  const router = useRouter();

  const handleNavigation = (unitId: string, courseId: string) => {
    router.push(`/course/${courseId}/${unitId}`);
  };
  return (
    <div
      ref={dropdownRef}
      className='absolute right-0 z-20 my-3 max-h-[680px] overflow-y-scroll'
    >
      <div className='min-w-[480px] w-max h-full flex flex-col gap-4'>
        {Object.values(tableOfContents).map((unit, unitIndex) => (
          <div
            key={unitIndex}
            className='flex flex-col gap-4 px-4 py-6 bg-white border border-2 border-secondary-grey rounded-xl shadow-sm'
          >
            <p className='text-lg font-semibold'>{unit.unitName}</p>
            <div className='flex flex-col gap-2'>
              {unit.content.map((lesson, lessonIndex) => (
                <button
                  key={lessonIndex}
                  onClick={() => handleNavigation(lesson.unitId, unit.courseId)}
                  className='px-4 py-2 bg-tertiary-grey rounded-md '
                >
                  {lesson.type === 'text' && (
                    <p className='text-base font-regular text-left'>
                      {lesson.title}
                    </p>
                  )}
                  {lesson.type === 'quiz' && (
                    <p className='text-sm font-semibold text-left'>QUIZ</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
