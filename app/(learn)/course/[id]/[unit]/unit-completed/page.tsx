import UnitCompletion from '@/components/Course/CourseComponents/UnitCompletion';
import EmptyState from '@/components/Course/EmptyState';
import {
  getFirstLesson,
  getNextUncompletedUnit,
  getUnitContentById,
} from '@/lib/actions/unit.actions';

export default async function Completed({
  params: { id, unit },
}: {
  params: { id: string; unit: string };
}) {
  const unitContent = await getUnitContentById(unit);
  const nextUnit = await getNextUncompletedUnit(id, unit);

  return (
    <div className='course-page'>
      {unitContent ? (
        <UnitCompletion
          unitContent={unitContent}
          nextUnitId={nextUnit?.nextUnit}
          firstLessonId={nextUnit?.firstLesson}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
