import Link from 'next/link';
import { Lesson } from '@/types';

interface TOCLessonProps {
  lesson: Lesson;
  courseId: string;
}

const TOCLesson = ({ lesson, courseId }: TOCLessonProps) => {
  return (
    <Link
      href={`/course/${courseId}/${lesson.unitId}`}
      className='flex flex-row justify-between px-4 py-2 bg-tertiary-tan border-2 border-primary-tan rounded-md '
    >
      <p className='md:text-base text-sm font-regular font-rosario text-left'>
        {lesson.title}
      </p>
    </Link>
  );
};

export default TOCLesson;
