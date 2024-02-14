import { Lesson, StructuredUnitContent } from '@/types';

import TOCLesson from './TOCLesson';

interface TOCUnitProps {
  unit: StructuredUnitContent;
}

const TOCUnit = ({ unit }: TOCUnitProps) => {
  return (
    <div className='flex flex-col gap-4 px-4 py-4 bg-white border-2 border-primary-tan rounded-md shadow-sm'>
      <h2 className='text-lg font-bold font-rosario'>{unit.unitName}</h2>
      <div className='flex flex-col gap-2'>
        {unit?.content?.map((lesson) => (
          <TOCLesson
            key={lesson._id}
            lesson={lesson}
            courseId={unit.courseId}
          />
        ))}
      </div>
    </div>
  );
};

export default TOCUnit;
