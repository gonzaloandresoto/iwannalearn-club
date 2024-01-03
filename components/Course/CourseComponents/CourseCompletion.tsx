import Link from 'next/link';

interface UnitContentItem {
  _id: string;
  title: string;
  imageUrl: string;
  status: string;
  order: string;
  courseId: string;
}

interface CourseCompletionProps {
  unitContent: UnitContentItem;
  nextUnitId: string | null;
}

export default function CourseCompletion({
  unitContent,
  nextUnitId,
}: CourseCompletionProps) {
  console.log(nextUnitId);
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
    <div className='lg:w-[800px] w-full lg:h-5/6 h-full flex flex-col gap-6 items-center justify-center lg:px-12 px-4  bg-white lg:border-2 border-t-2 border-primary-tan lg:rounded-t-2xl overflow-y-auto'>
      <div className='w-full h-full flex flex-col lg:gap-8 gap-4 items-center justify-center'>
        <p className='lg:text-2xl text-xl text-secondary-black font-bold font-rosario text-center'>
          Congratulations on completing
        </p>
        <p className='lg:text-6xl text-4xl text-secondary-black font-sourceSerif font-bold text-center'>
          {unitContent.title}
        </p>
        <p className='text-xl text-secondary-black font-semibold font-rosario text-center'>{`awarded on ${today}`}</p>
      </div>

      <div className='h-[96px]'>
        <Link
          href={route}
          className='main-button '
        >
          Next Unit
        </Link>
      </div>
    </div>
  );
}