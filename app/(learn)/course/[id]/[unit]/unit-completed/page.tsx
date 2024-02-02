import UnitCompletion from '@/components/Course/CourseComponents/UnitCompletion';
import EmptyState from '@/components/Course/EmptyState';
import {
  getNextUncompletedUnit,
  getUnitContentById,
} from '@/lib/actions/unit.actions';

export default async function Completed({
  params: { id, unit },
}: {
  params: { id: string; unit: string };
}) {
  const unitContent = await getUnitContentById(unit);
  const nextUncompletedUnit = await getNextUncompletedUnit(id);
  const nextUnit = null;

  return (
    <div className='course-page'>
      {unitContent ? (
        <UnitCompletion
          unitContent={unitContent}
          nextUnitId={nextUncompletedUnit || null}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
