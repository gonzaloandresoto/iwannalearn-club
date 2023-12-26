import Link from 'next/link';

interface CourseCardProps {
  title: string;
  summary: string;
  courseId: string;
}

function CourseCard({ title, summary, courseId }: CourseCardProps) {
  return (
    <Link
      className='w-full flex flex-col gap-4 px-4 py-4 bg-tertiary-grey rounded-xl'
      href={`/${courseId}`}
    >
      <p className='text-lg font-semibold'>{title}</p>
      <p>{summary}</p>
    </Link>
  );
}

export default CourseCard;
