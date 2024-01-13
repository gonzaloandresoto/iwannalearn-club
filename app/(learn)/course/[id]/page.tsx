import { getCourseById } from '@/lib/actions/generate.actions';
import CourseCover from '@/components/Course/CourseComponents/CourseCover';

import EmptyState from '@/components/Course/EmptyState';

export default async function CourseContent({
  params: { id },
}: {
  params: { id: string };
}) {
  const course = await getCourseById(id);
  return (
    <section className='course-page'>
      {course ? (
        <CourseCover
          courseId={course?._id.toString()}
          title={course?.title}
          summary={course?.summary}
          tableOfContents={course?.tableOfContents}
        />
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
