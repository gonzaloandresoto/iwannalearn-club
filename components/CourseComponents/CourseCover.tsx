import { courseCover } from '@/constants';
import TableOfContents from './TableOfContents';

export default function CourseCover() {
  return (
    <div className='fixed bottom-0 w-[720px] h-5/6 flex flex-col items-center px-8 pt-8 bg-tertiary-grey rounded-t-xl overflow-y-auto'>
      <div className='w-full h-max flex flex-col gap-8'>
        <div className='w-full h-[240px] flex items-center justify-center bg-white border border-2 border-secondary-grey rounded-lg'>
          <p className='text-4xl font-titan'>{courseCover.title}</p>
        </div>
        <p className='text-lg'>{courseCover.summary}</p>
        <TableOfContents />
      </div>
      <button className='fixed bottom-16 main-button'>Start learning</button>
    </div>
  );
}
