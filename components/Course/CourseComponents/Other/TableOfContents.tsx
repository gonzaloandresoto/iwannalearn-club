import useUserContext from '@/hooks/useUserContext';
import Link from 'next/link';

interface TableofContentsItem {
  id: string;
  title: string;
  unitId: string;
}

interface UnitCompletionsItem {
  [key: string]: {
    status: string;
    order: string;
  };
}

interface TableOfContentsProps {
  tableOfContents: string;
  nextUnit: string | null;
  courseId: string;
  unitCompletions: UnitCompletionsItem | null;
}

export default function TableOfContents({
  tableOfContents,
  courseId,
  unitCompletions,
}: TableOfContentsProps) {
  const { user } = useUserContext();
  const tableOfContentsArray: TableofContentsItem[] =
    JSON.parse(tableOfContents);

  const unitStatus = (unitId: string, index: number) => {
    if (!unitCompletions) return 'Locked';

    if (!user?._id) return 'Start';

    const status = unitCompletions[unitId]?.status;
    const prevStatus =
      index > 0
        ? unitCompletions[tableOfContentsArray[index - 1].unitId]?.status
        : 'NOT_STARTED';

    if (
      status === 'NOT_STARTED' &&
      (index === 0 || prevStatus === 'COMPLETE')
    ) {
      return 'Start';
    } else if (status === 'COMPLETE') {
      return 'Done';
    } else if (status === 'IN_PROGRESS') {
      return 'Continue';
    } else {
      return 'Locked';
    }
  };

  return (
    <div className='w-full flex flex-col'>
      {tableOfContentsArray.map((item, index) => {
        const status = unitStatus(item.unitId, index);
        const isDisabled = status === 'Locked';

        return (
          <div
            key={index}
            className='w-full flex items-center justify-between gap-4 lg:py-4 py-3 border-b-2 border-primary-tan'
          >
            <div className='flex flex-col gap-4'>
              <p className='lg:text-base text-sm text-tertiary-black font-bold font-rosario uppercase'>
                {'Unit ' + (index + 1) + ': '}
              </p>
              <p className='lg:text-xl text-lg text-secondary-black font-semibold font-rosario'>
                {item.title}
              </p>
            </div>

            <Link
              href={{
                pathname: `/course/${courseId}/${item.unitId}`,
                query: { activePage: 0 },
              }}
              style={{
                pointerEvents: isDisabled ? 'none' : 'auto',
              }}
              className={`flex-none px-4 py-1 lg:text-lg text-sm text-tertiary-tan font-rosario rounded-sm disabled:opacity-60 ${
                status === 'Done' || status === 'Locked'
                  ? 'bg-secondary-black'
                  : 'bg-primary-green'
              }`}
            >
              <p>{status}</p>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
