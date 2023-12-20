import { courseCover } from '@/constants';

interface TableofContentsItem {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  tableOfContents: string;
}

export default function TableOfContents({
  tableOfContents,
}: TableOfContentsProps) {
  const tableOfContentsArray: TableofContentsItem[] =
    JSON.parse(tableOfContents);
  console.log(tableOfContentsArray);
  return (
    <div className='w-full flex flex-col gap-4'>
      <p className='text-2xl font-bold'>Table of Contents</p>
      <div className='w-full h-max flex flex-col gap-2'>
        {tableOfContentsArray.map((item, index) => (
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
