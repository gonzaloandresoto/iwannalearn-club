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
  const nextUnit = await getNextUncompletedUnit(id);

  return (
    <div className='flex flex-col items-center'>
      <CourseCompletion
        unitContent={unitContent}
        nextUnit={nextUnit}
      />
    </div>
  );
}
