import Link from 'next/link';

interface UnitContentItem {
  _id: string;
  title: string;
  imageUrl: string;
  status: string;
  order: string;
  courseId: string;
}

interface UnitCompletionProps {
  unitContent: UnitContentItem;
  nextUnitId: string | null;
}

export default function UnitCompletion({
  unitContent,
  nextUnitId,
}: UnitCompletionProps) {
  let route;
  if (!nextUnitId) {
    route = `/course/${unitContent.courseId}`;
  } else {
    route = `/course/${unitContent.courseId}/${nextUnitId}`;
  }

  const today = new Date().toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className='course-card'>
      <div className='w-full h-full flex flex-col lg:gap-8 gap-4 items-center justify-center lg:px-12 px-4'>
        <p className='lg:text-2xl text-xl text-secondary-black font-bold font-rosario text-center'>
          {`Congratulations on completing Unit ${unitContent?.order}`}
        </p>
        <p className='lg:text-6xl text-4xl text-secondary-black font-sourceSerif font-bold text-center'>
          {unitContent?.title}
        </p>
        <p className='text-xl text-secondary-black font-semibold font-rosario text-center'>{`awarded on ${today}`}</p>
      </div>

      <div className='w-full min-h-[88px] flex gap-2 pt-[16px] justify-center border-t-2 border-primary-tan lg:px-12 px-4'>
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
