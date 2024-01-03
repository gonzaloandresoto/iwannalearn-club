'use client';

import { useRouter } from 'next/navigation';

interface TableofContentsItem {
  id: string;
  title: string;
  unitId: string;
}

interface UnitCompletionsItem {
  [key: string]: string;
}

interface TableOfContentsProps {
  tableOfContents: string;
  nextUnit: string | null;
  courseId: string;
  unitCompletions: UnitCompletionsItem;
}

export default function TableOfContents({
  tableOfContents,
  nextUnit,
  courseId,
  unitCompletions,
}: TableOfContentsProps) {
  const router = useRouter();
  const tableOfContentsArray: TableofContentsItem[] =
    JSON.parse(tableOfContents);

  const allCompleted = Object.values(unitCompletions).every(
    (status) => status === 'COMPLETED'
  );

  const unitStatus = (unitId: string, index: number) => {
    const status = unitCompletions[unitId];
    const prevStatus = unitCompletions[tableOfContentsArray[index - 1]?.unitId];
    if (
      (index === 0 && status === 'NOT_STARTED') ||
      (prevStatus === 'COMPLETED' && status === 'NOT_STARTED')
    ) {
      return 'Start';
    } else if (status === 'COMPLETED' || allCompleted) {
      return 'Redo';
    } else if (status === 'IN_PROGRESS') {
      return 'Continue';
    } else if (status === 'NOT_STARTED') {
      return 'Locked';
    }
  };

  return (
    <div className='w-full'>
      <div className='w-full flex flex-col'>
        {tableOfContentsArray.map((item, index) => {
          const status = unitStatus(item.unitId, index);
          const isDisabled = status === 'Locked';

          return (
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
                disabled={isDisabled}
                className='flex-none px-4 py-1 bg-secondary-black text-lg text-tertiary-tan font-rosario rounded-sm disabled:opacity-60'
              >
                {status}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
