'use client';

import Link from 'next/link';
import { useState, useRef, use, useEffect } from 'react';
import CourseDropdown from './CourseDropdown';

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
    fetch('/api/course-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: courseId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCourseProgress(data);
      });
  }, []);

  return (
    <div>
      <div className='relative h-[32px] w-[144px] flex flex-col justify-center px-2 border-b-0 border-2 border-primary-tan'>
        <button
          className='w-[20px] h-[20px] flex items-center justify-center'
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          <img src='/course-icons/more.svg' />
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
        className='lg:w-[480px] w-full min-w-[320px] h-[240px] flex flex-col justify-between px-4 py-4 rounded-r-md rounded-bl-md border-2 border-primary-tan '
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
