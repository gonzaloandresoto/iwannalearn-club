import TableOfContents from './TableOfContents';
import { getUnitCompletions } from '@/lib/actions/unit.actions';

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
  const unitCompletions = await getUnitCompletions(courseId);

  return (
    <div className='course-card'>
      <div className='course-card-inner h-full items-center gap-6'>
        <div className='w-full flex flex-col items-center gap-4'>
          <p className='lg:text-4xl text-2xl text-center font-bold font-sourceSerif text-secondary-black'>
            {title}
          </p>
          <p className='md:text-lg text-base text-center text-tertiary-black font-medium font-rosario'>
            {summary}
          </p>
        </div>
        <div className='h-[2px] bg-primary-tan w-1/3'></div>
        <TableOfContents
          tableOfContents={tableOfContents}
          courseId={courseId}
          unitCompletions={unitCompletions}
        />
      </div>
    </div>
  );
}
