'use client';

import useUserContext from '@/lib/hooks/useUserContext';
import { markCourseAsComplete } from '@/lib/actions/course.actions';
import { Course } from '@/types';
import { useLogSnag } from '@logsnag/next';
import { useRouter } from 'next/navigation';

interface CourseCompletionProps {
  course: Course | undefined;
}

export default function CourseCompletion({ course }: CourseCompletionProps) {
  const { user } = useUserContext();
  const router = useRouter();
  const { track, setUserId, setDebug } = useLogSnag();
  setUserId(user?._id || '');

  const today = new Date().toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const completeCourse = async () => {
    if (user?._id) {
      await markCourseAsComplete(course?._id || '');
      track({
        channel: 'learn',
        event: 'Course Completed',
        icon: '✅',
        notify: true,
        tags: {
          title: course?.title || '',
        },
      });
    }
    router.push(`/course/${course?._id}`);
  };

  return (
    <div className='course-card'>
      <div className='course-card-inner h-full flex flex-col gap-6 justify-center pb-[120px]'>
        <p className='lg:text-xl text-lg text-secondary-black font-bold font-rosario text-center'>
          {`Congratulations, you've completed`}
        </p>
        <p className='lg:text-6xl text-4xl text-secondary-black font-sourceSerif font-bold text-center'>
          {course?.title}
        </p>
        <p className='lg:text-xl text-lg text-secondary-black font-semibold font-rosario text-center'>{`${today}`}</p>
      </div>

      <div className='fixed bottom-0 max-w-[876px] w-full min-h-[88px] flex gap-2 bg-white p-[16px] justify-center border-t-2 border-primary-tan'>
        <button
          onClick={completeCourse}
          className='main-button'
        >
          Finish
        </button>
      </div>
    </div>
  );
}
