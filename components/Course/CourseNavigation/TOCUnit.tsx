import TOCLesson from './TOCLesson';

interface Unit {
  unitName: string;
  courseId: string;
  content: {
    title: string;
    type: string;
    unitId: string;
    status: boolean;
    completed: boolean;
  }[];
}

interface TOCUnitProps {
  unit: Unit;
}

const TOCUnit = ({ unit }: TOCUnitProps) => {
  return (
    <div className='flex flex-col gap-4 px-4 py-4 bg-white border-2 border-primary-tan rounded-md shadow-sm'>
      <p className='text-lg font-bold font-rosario'>{unit.unitName}</p>
      <div className='flex flex-col gap-2'>
        {unit.content.length > 0 ? (
          unit.content.map((lesson, lessonIndex) => (
            <TOCLesson
              key={lessonIndex}
              lesson={lesson}
              courseId={unit.courseId}
            />
          ))
        ) : (
          <div className='w-full'>
            <p className='text-sm text-tertiary-black font-bold font-rosario'>
              Loading...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TOCUnit;
