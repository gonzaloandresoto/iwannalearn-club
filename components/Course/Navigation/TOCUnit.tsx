import { StructuredCourseContent } from '@/types';
import TOCLesson from './TOCLesson';

interface TOCUnitProps {
  unit: any;
}

const TOCUnit = ({ unit }: TOCUnitProps) => {
  return (
    <div className='flex flex-col gap-4 px-4 py-4 bg-white border-2 border-primary-tan rounded-md shadow-sm'>
      <p className='text-lg font-bold font-rosario'>{unit?.unitName}</p>
      <div className='flex flex-col gap-2'>
        {unit?.content?.length > 0 ? (
          unit.content?.map((lesson: any, lessonIndex: any) => (
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
