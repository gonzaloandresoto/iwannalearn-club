import CourseCompletion from '@/components/CourseComponents/CourseCompletion';
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
  const nextUnitId = await getNextUncompletedUnit(id);

  return (
    <div className='flex grow justify-center'>
      <CourseCompletion
        unitContent={unitContent}
        nextUnitId={nextUnitId}
      />
    </div>
  );
}
