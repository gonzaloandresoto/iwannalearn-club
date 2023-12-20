interface TableOfContentsProps {
  tableOfContents: {
    unitName: string;
    content: {
      title: string;
      type: string;
    }[];
  }[];
}

export default function TableOfContentsDropdown({
  tableOfContents,
}: TableOfContentsProps) {
  console.log(tableOfContents);
  return (
    <div className='absolute right-0 z-20 my-3 max-h-[680px] overflow-y-scroll'>
      <div className='w-max h-full flex flex-col gap-4'>
        {Object.values(tableOfContents).map((unit, unitIndex) => (
          <div
            key={unitIndex}
            className='flex flex-col gap-4 px-4 py-6 bg-white border border-2 border-secondary-grey rounded-xl shadow-sm'
          >
            <p className='text-lg font-semibold'>{unit.unitName}</p>
            <div className='flex flex-col gap-2'>
              {unit.content.map((lesson, lessonIndex) => (
                <div
                  key={lessonIndex}
                  className='px-4 py-2 bg-tertiary-grey rounded-md'
                >
                  {lesson.type === 'text' && (
                    <p className='text-base font-regular'>{lesson.title}</p>
                  )}
                  {lesson.type === 'quiz' && (
                    <p className='text-sm font-semibold'>QUIZ</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
