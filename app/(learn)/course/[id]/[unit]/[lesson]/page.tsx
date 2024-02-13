import CourseSidebar from '@/components/Course/Sidebar/CourseSidebar';
import LessonCard from '@/components/Course/Main/LessonCard';
import { getLessonById } from '@/lib/actions/element.action';
import { getUnitLessonTitles } from '@/lib/actions/unit.actions';

export default async function Lesson({
  params: { id, unit, lesson },
}: {
  params: { id: string; unit: string; lesson: string };
}) {
  const lessonContent = await getLessonById(lesson);
  const unitLessons = await getUnitLessonTitles(unit);

  return (
    <div className='course-page gap-6'>
      <LessonCard
        lesson={lessonContent}
        unitLessons={unitLessons}
        courseId={id}
        unitId={unit}
      />
      <CourseSidebar lesson={lessonContent} />
    </div>
  );
}
