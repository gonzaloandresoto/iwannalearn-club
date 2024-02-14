import useUserContext from '@/lib/hooks/useUserContext';
import Link from 'next/link';

interface UnitContentItem {
  _id: string;
  title: string;
  order: number;
  courseId: string;
}

interface UnitCompletionProps {
  unitContent: UnitContentItem;
  nextUnitId: string | null;
  firstLessonId: string | null;
}

export default function UnitCompletion({
  unitContent,
  nextUnitId,
  firstLessonId,
}: UnitCompletionProps) {
  let route;
  if (!nextUnitId || !firstLessonId) {
    route = `/course/${unitContent?.courseId}/course-completed`;
  } else {
    route = `/course/${unitContent?.courseId}/${nextUnitId}/${firstLessonId}`;
  }

  const today = new Date().toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className='course-card'>
      <div className='course-card-inner h-full flex flex-col gap-6 justify-center pb-[120px]'>
        <p className='lg:text-xl text-lg text-secondary-black font-bold font-rosario text-center'>
          {`Congratulations on completing Unit ${unitContent?.order}`}
        </p>
        <p className='lg:text-6xl text-4xl text-secondary-black font-sourceSerif font-bold text-center'>
          {unitContent?.title}
        </p>
        <p className='lg:text-xl text-lg text-secondary-black font-semibold font-rosario text-center'>{`awarded on ${today}`}</p>
      </div>

      <div className='fixed bottom-0 max-w-[876px] w-full min-h-[88px] flex gap-2 bg-white p-[16px] justify-center border-t-2 border-primary-tan'>
        <Link
          href={route}
          className='main-button '
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
