'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import CourseDropdown from './CourseDropdown';
import { getCourseProgressById } from '@/lib/actions/generate.actions';
import { MoreHorizontal } from 'lucide-react';

interface CourseCardProps {
  title: string;
  courseId: string;
}

export default function CourseCard({ title, courseId }: CourseCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [courseProgress, setCourseProgress] = useState<number>(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const progressBarWidth =
    courseProgress &&
    progressBarRef.current &&
    progressBarRef.current?.clientWidth * (courseProgress / 100);

  useEffect(() => {
    if (!courseId) return;

    const getCourseProgress = async () => {
      const progress = await getCourseProgressById(courseId);
      if (progress) {
        setCourseProgress(progress.progress);
      }
    };

    getCourseProgress();
  }, []);

  return (
    <div className='max-w-[480px] w-full'>
      <div className='relative h-[32px] w-[144px] flex flex-col justify-center bg-white px-2 border-b-0 border-2 border-primary-tan'>
        <button
          className='w-[20px] h-[20px] flex items-center justify-center'
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          <MoreHorizontal />
        </button>
        {isDropdownOpen && (
          <CourseDropdown
            courseId={courseId}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        )}
      </div>
      <Link
        href={`/course/${courseId}`}
        className='w-full h-[240px] flex flex-col justify-between bg-white px-4 py-4 rounded-r-md rounded-bl-md border-2 border-primary-tan '
      >
        <p className='text-2xl font-semibold font-rosario w-2/3'>{title}</p>

        <div className='w-full flex flex-col gap-2'>
          <p className='text-xl font-semibold font-rosario'>{`Progress: ${courseProgress}%`}</p>
          <div
            ref={progressBarRef}
            className='w-full h-[20px] bg-primary-tan'
          >
            <div
              className='h-full bg-secondary-black'
              style={{ width: `${progressBarWidth}px` }}
            ></div>
          </div>
        </div>
      </Link>
    </div>
  );
}
