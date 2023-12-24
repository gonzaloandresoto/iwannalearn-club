import TOCUnit from './TOCUnit';

interface Content {
  title: string;
  type: string;
  unitId: string;
  status: boolean;
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
    <div className='absolute right-0 z-20 my-3 max-h-[680px] overflow-y-scroll'>
      <div className='min-w-[480px] w-max h-full flex flex-col gap-4'>
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
