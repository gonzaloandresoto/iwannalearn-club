import UnitCompletion from '@/components/Course/CourseComponents/UnitCompletion';
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
    <div className='flex flex-col grow items-center justify-end bg-tertiary-tan'>
      <UnitCompletion
        unitContent={unitContent}
        nextUnitId={nextUnit || null}
      />
    </div>
  );
}
