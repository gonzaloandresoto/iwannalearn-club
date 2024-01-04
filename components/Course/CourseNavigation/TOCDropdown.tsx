import TOCUnit from './TOCUnit';

interface Content {
  title: string;
  type: string;
  unitId: string;
  status: boolean;
  completed: boolean;
}

interface TableOfContentsProps {
  tableOfContents: {
    unitName: string;
    courseId: string;
    content: Content[];
  }[];
}

export default function TOCDropdown({ tableOfContents }: TableOfContentsProps) {
  return (
    <div className='absolute right-0 z-50 my-3 max-h-[680px] overflow-y-scroll'>
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
