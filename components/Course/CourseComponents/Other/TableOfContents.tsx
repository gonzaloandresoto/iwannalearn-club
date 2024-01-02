'use client';

import { useRouter } from 'next/navigation';

interface TableofContentsItem {
  id: string;
  title: string;
  unitId: string;
}

interface TableOfContentsProps {
  tableOfContents: string;
  nextUnit: string;
  courseId: string;
}

export default function TableOfContents({
  tableOfContents,
  nextUnit,
  courseId,
}: TableOfContentsProps) {
  const router = useRouter();
  const tableOfContentsArray: TableofContentsItem[] =
    JSON.parse(tableOfContents);

  return (
    <div className='w-full'>
      <div className='w-full flex flex-col'>
        {tableOfContentsArray.map((item, index) => (
          <div
            key={index}
            className='w-full flex items-center justify-between lg:py-4 py-3 border-b-2 border-primary-tan'
          >
            <div className='flex flex-col gap-2'>
              <p className='lg:text-base text-sm text-tertiary-black font-bold font-rosario uppercase'>
                {'Unit ' + (index + 1) + ': '}
              </p>
              <p className='lg:text-xl text-lg text-secondary-black font-semibold font-rosario'>
                {item.title}
              </p>
            </div>

            <button
              onClick={() => {
                router.push(`/course/${courseId}/${item.unitId}`);
              }}
              disabled={item.unitId !== nextUnit}
              className='flex-none px-4 py-1 bg-secondary-black text-lg text-tertiary-tan font-rosario rounded-sm disabled:opacity-60'
            >
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
