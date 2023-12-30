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
  nextUnitId: string;
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

  return (
    <div className='fixed bottom-0 w-[720px] h-5/6 flex flex-col items-center px-8 pt-8 bg-tertiary-grey rounded-t-xl overflow-y-auto'>
      <div className='flex flex-col gap-4 items-center'>
        <p className='text-lg font-mediu text-center'>
          Congratulations! You completed
        </p>
        <p className='text-4xl font-titan text-center'>{unitContent.title}</p>
      </div>

      <Link
        href={route}
        className='fixed bottom-16 main-button'
      >
        Continue to next unit
      </Link>
    </div>
  );
}
