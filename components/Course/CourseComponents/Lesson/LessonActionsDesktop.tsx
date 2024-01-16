'use client';

import useOutsideClick from '@/hooks/useOutsideClick';
import useUserContext from '@/hooks/useUserContext';
import { goDeeper } from '@/lib/actions/course.actions';
import {
  Blocks,
  Eye,
  NotebookPen,
  Plus,
  RefreshCcw,
  Youtube,
} from 'lucide-react';
import React from 'react';

function LessonActionsDesktop({ lesson, unitId }: any) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const ref = useOutsideClick(() => setIsOpen(false));
  return (
    <div className='hidden relative w-full h-max lg:flex flex-col'>
      <button
        onClick={() => setIsOpen(true)}
        className='secondary-button w-max'
      >
        <Plus className='max-w-[20px]' />
        <p>More</p>
      </button>
      {isOpen && (
        <Dropdown
          lesson={lesson}
          unitId={unitId}
          dropdownRef={ref}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
}

export default LessonActionsDesktop;

function Dropdown({ lesson, unitId, dropdownRef, setIsOpen }: any) {
  const { user } = useUserContext();
  const deeper = async (e: any) => {
    e.preventDefault();
    setIsOpen(false);

    // show a loading state
    const response = await goDeeper(
      lesson,
      unitId,
      'i want to know more about the timeline'
    );

    // refresh the page
    if (response) {
      window.location.reload();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className='dropdown mt-2 !top-[48px] !left-0'
    >
      <div className='px-4 py-2'>
        <p className='text-sm text-tertiary-black font-rosario font-bold'>
          Options
        </p>
      </div>
      <button
        onClick={deeper}
        className='dropdown-button '
      >
        <NotebookPen className='max-w-[20px]' />
        <p>Go deeper</p>
      </button>
      <button className='dropdown-button'>
        <Blocks className='max-w-[20px]' />
        <p>Explain like im 5</p>
      </button>
      <button className='dropdown-button '>
        <RefreshCcw className='max-w-[20px]' />
        <p>Regenerate content</p>
      </button>
      <button className='dropdown-button '>
        <Youtube className='max-w-[20px]' />
        <p>Add a video</p>
      </button>
      <button className='dropdown-button'>
        <Eye className='max-w-[20px]' />
        <p>Give me an example</p>
      </button>
    </div>
  );
}

// go deeper
// regenerate Content
// explain like im 5

// add an imageConfigDefault

// add a video
// give me an example
