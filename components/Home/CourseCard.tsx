import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface CourseCardProps {
  courseId: string;
  title: string;
  date: string;
}

const CourseCard = ({ courseId, title, date }: CourseCardProps) => {
  return (
    <div className='md:w-[480px] w-full'>
      <div className='relative h-[32px] w-[144px] flex flex-col justify-center bg-white px-2 border-b-0 border-2 border-primary-tan'></div>
      <Link
        href={`/course/${courseId}`}
        prefetch={true}
        className='w-full h-[240px] flex flex-col justify-between bg-white px-4 py-4 rounded-r-md rounded-bl-md border-2 border-primary-tan '
      >
        <p className='text-2xl font-semibold font-rosario w-2/3'>{title}</p>
        <p className='text-base text-tertiary-black font-medium font-rosario'>
          {'created on ' + (date && formatDate(date))}
        </p>
      </Link>
    </div>
  );
};

export default CourseCard;
