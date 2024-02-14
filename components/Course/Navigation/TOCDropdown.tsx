import { StructuredCourseContent, StructuredUnitContent } from '@/types';
import TOCUnit from './TOCUnit';

interface TableOfContentsProps {
  tableOfContents: StructuredCourseContent;
}

export default function TOCDropdown({ tableOfContents }: TableOfContentsProps) {
  return (
    <div className='absolute right-0 my-2 max-h-[680px] overflow-y-scroll'>
      <div className='md:min-w-[480px] min-w-[300px] w-full h-full flex flex-col gap-4'>
        {Object.entries(tableOfContents).map(([unitId, unit]) => (
          <TOCUnit
            key={unitId}
            unit={unit}
          />
        ))}
      </div>
    </div>
  );
}
