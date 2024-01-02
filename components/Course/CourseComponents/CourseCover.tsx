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
    <div className='lg:w-[800px] w-full lg:h-5/6 h-full flex flex-col gap-6 items-center lg:px-12 px-8 lg:pt-16 pt-12 bg-white lg:border-2 border-t-2 border-primary-tan lg:rounded-t-2xl overflow-y-auto'>
      <div className='w-full flex flex-col gap-4'>
        <p className='lg:text-4xl text-2xl text-center font-bold font-sourceSerif text-secondary-black'>
          {title}
        </p>
        <p className='md:text-lg text-base text-tertiary-black font-medium font-rosario'>
          {summary}
        </p>
      </div>
      <div className='h-[2px] bg-primary-tan w-1/3'></div>
      <TableOfContents
        tableOfContents={tableOfContents}
        courseId={courseId}
        nextUnit={nextUnit?.toString()}
      />
    </div>
  );
}
