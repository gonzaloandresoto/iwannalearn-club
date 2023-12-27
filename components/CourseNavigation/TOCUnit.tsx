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
    <div className='flex flex-col gap-4 px-4 py-6 bg-white border-2 border-secondary-grey rounded-xl shadow-sm'>
      <p className='text-lg font-semibold'>{unit.unitName}</p>
      <div className='flex flex-col gap-2'>
        {unit.content.map((lesson, lessonIndex) => (
          <TOCLesson
            key={lessonIndex}
            lesson={lesson}
            courseId={unit.courseId}
          />
        ))}
      </div>
    </div>
  );
};

export default TOCUnit;
