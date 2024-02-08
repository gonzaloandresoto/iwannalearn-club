'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const links = [
  {
    title: 'Title 1',
    url: 'https://www.google.com',
  },
  {
    title: 'Title 2',
    url: 'https://www.google.com',
  },
  {
    title: 'Title 3',
    url: 'https://www.google.com',
  },
  {
    title: 'Title 4',
    url: 'https://www.google.com',
  },
];

export default function FurtherReading() {
  const { unit } = useParams<{ unit: string }>() || {
    unit: '',
  };
  return (
    <div className='w-full min-h-[144px] h-max p-4 general-container flex flex-col gap-4'>
      <h2 className='h3 font-rosario'>Further Reading</h2>
      <div className='grid gap-2'>
        {links.map((link) => (
          <Link
            key={link.url}
            href={link.url}
            className='text-base text-tertiary-black hover:text-primary-blue font-rosario font-medium hover:underline'
          >
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
