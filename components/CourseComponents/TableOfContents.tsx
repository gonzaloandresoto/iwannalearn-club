import { courseCover } from '@/constants';

interface TableOfContentsProps {
  tableOfContents: string;
}

export default function TableOfContents({
  tableOfContents,
}: TableOfContentsProps) {
  console.log(tableOfContents);
  return (
    <div className='w-full flex flex-col gap-4'>
      <p className='text-2xl font-bold'>Table of Contents</p>
      <div className='w-full h-max flex flex-col gap-2'>
        {JSON.parse(tableOfContents).map((item, index) => (
          <div
            key={index}
            className='w-full h-[48px] flex items-center px-2 bg-white border border-2 border-secondary-grey  rounded-md'
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}
