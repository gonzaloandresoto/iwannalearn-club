import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import CourseCardHandle from './CourseCardHandle';
import CourseCardProgress from './CourseCardProgress';

interface CourseCardProps {
  courseId: string;
  title: string;
  date: string;
  progress?: number;
  isPublic: boolean;
}

const CourseCard = ({
  courseId,
  title,
  date,
  progress,
  isPublic,
}: CourseCardProps) => {
  return (
    <div className='md:w-[480px] w-full'>
      {!isPublic ? (
        <CourseCardHandle courseId={courseId} />
      ) : (
        <div className='relative h-[32px] w-[144px] flex flex-col justify-center bg-white px-2 border-b-0 border-2 border-primary-tan'></div>
      )}

      <Link
        href={`/course/${courseId}`}
        prefetch={true}
        className='w-full h-[240px] flex flex-col justify-between bg-white px-4 py-4 rounded-r-md rounded-bl-md border-2 border-primary-tan '
      >
        <p className='text-2xl font-semibold font-rosario w-2/3'>{title}</p>
        {!isPublic && progress != null ? (
          <CourseCardProgress progress={progress} />
        ) : (
          <p className='text-base text-tertiary-black font-medium font-rosario'>
            {'created on ' + (date && formatDate(date))}
          </p>
        )}
      </Link>
    </div>
  );
};

export default CourseCard;

{
  /* Only show creation date if the course is public */
}
{
  /* {isPublic && (
  <p className='text-base text-tertiary-black font-medium font-rosario'>
    {'created on ' + (date && formatDate(date))}
  </p>
)} */
}
{
  /* Only show progress if the course is not public */
}
{
  /* {!isPublic && progress && <CourseCardProgress progress={progress} />} */
}
