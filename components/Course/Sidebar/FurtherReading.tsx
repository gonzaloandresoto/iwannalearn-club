'use client';

import { saveFurtherReadingLinks } from '@/lib/actions/element.action';
import { Lesson } from '@/types';
import { ListCollapse } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Link {
  title: string;
  url: string;
}
interface FurtherReadingProps {
  lesson: Lesson | undefined;
}

export default function FurtherReading({ lesson }: FurtherReadingProps) {
  const [open, setOpen] = useState<boolean>(true);
  const [links, setLinks] = useState<Link[]>(
    (lesson?.links && JSON.parse(lesson?.links)) || []
  );

  useEffect(() => {
    if (lesson?.links || !lesson?.content) return;

    const getLessonLinks = async () => {
      const response = await fetch('/api/further-reading-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: lesson?.title }),
      });

      if (response.ok) {
        const data = await response.json();
        setLinks(data);
        await saveFurtherReadingLinks(lesson?._id, JSON.stringify(data));
      }
    };

    getLessonLinks();
  }, [lesson?._id, lesson?.content]);

  return (
    <div className='flex-none w-full h-max p-4 general-container flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <h2 className='h3 font-rosario'>Further Reading</h2>
        <button onClick={() => setOpen(!open)}>
          <ListCollapse
            size={18}
            className='text-tertiary-black'
          />
        </button>
      </div>

      {open && (
        <div className='grid gap-2'>
          {links &&
            links?.map((link: Link, index: number) => (
              <Link
                key={index}
                href={link.url}
                target='_blank'
                className='text-base text-tertiary-black hover:text-primary-blue font-rosario font-medium hover:underline'
              >
                {link.title}
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
