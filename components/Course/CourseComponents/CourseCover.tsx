import Link from 'next/link';
import TableOfContents from './Other/TableOfContents';
import { getNextUncompletedUnit } from '@/lib/actions/unit.actions';

interface CourseCoverProps {
  courseId: string;
  title: string;
  summary: string;
  tableOfContents: string;
}

export default async function CourseCover({
  courseId,
  title,
  summary,
  tableOfContents,
}: CourseCoverProps) {
  const nextUnit = await getNextUncompletedUnit(courseId);

  let route;
  if (!nextUnit.message) {
    route = `/course/${courseId}/${nextUnit}`;
  } else {
    route = `/course/${courseId}`;
  }

  return (
    <div className='fixed bottom-0 w-[720px] h-5/6 flex flex-col items-center px-8 pt-8 bg-tertiary-grey rounded-t-xl overflow-y-auto'>
      <div className='w-full h-max flex flex-col gap-8'>
        <div className='w-full h-[240px] flex items-center justify-center px-4 bg-white border-2 border-secondary-grey rounded-lg'>
          <p className='text-4xl text-center font-titan'>{title}</p>
        </div>
        <p className='text-lg'>{summary}</p>
        <TableOfContents tableOfContents={tableOfContents} />
      </div>

      <Link
        href={route}
        className='fixed bottom-16 main-button'
      >
        Start learning
      </Link>
    </div>
  );
}
