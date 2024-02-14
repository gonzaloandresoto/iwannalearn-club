import { StructuredCourseContent } from '@/types';
import TOCUnit from './TOCUnit';

interface TableOfContentsProps {
  tableOfContents: StructuredCourseContent[];
}

export default function TOCDropdown({ tableOfContents }: TableOfContentsProps) {
  return (
    <div className='absolute right-0 my-2 max-h-[680px] overflow-y-scroll'>
      <div className='md:min-w-[480px] min-w-[300px] w-full h-full flex flex-col gap-4'>
        {Object.values(tableOfContents).map((unit, unitIndex) => (
          <TOCUnit
            key={unitIndex}
            unit={unit}
          />
        ))}
      </div>
    </div>
  );
}
