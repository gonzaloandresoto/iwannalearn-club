import Link from 'next/link';

interface Lesson {
  title: string;
  type: string;
  unitId: string;
  completed: boolean;
}

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
      {lesson.type === 'lesson' && (
        <p className='md:text-base text-sm font-regular font-rosario text-left'>
          {lesson.title}
        </p>
      )}
      {lesson.type === 'quiz' && (
        <>
          <p className='text-sm font-bold font-rosario text-left'>QUIZ</p>
          {lesson.completed === false ? (
            <img
              src='/course-icons/uncompleted.svg'
              width={20}
              height={20}
            />
          ) : (
            <img
              src='/course-icons/completed.svg'
              width={20}
              height={20}
            />
          )}
        </>
      )}
    </Link>
  );
};

export default TOCLesson;
